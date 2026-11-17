// Content invariants for the restaurant, menu and banquets. Runs with Node's built-in TypeScript type stripping.
// When one of these fails after an edit, the message names the dish, section, banquet or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { formatAddress, publicLinks, restaurant, telHref } from '../content/restaurant.ts';
import {
  allDishes, ALLERGENS, ARTS, BADGES, DIETS, dishByNumber, dishId, featuredDishes, formatPrice, menu, sectionRange,
  type Allergen,
} from '../content/menu.ts';
import { banquets, howItWorks, isMenuCourse } from '../content/banquets.ts';
import { DAYS, SERVICE_LABELS, toMinutes } from '../lib/hours.ts';
import { matchesAll, matchesFilter } from '../lib/menu-filter.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
// Han characters (CJK Unified Ideographs and Extension A) plus the Latin letters some dish names use, e.g. "XO醬".
const CHINESE = /^[㐀-䶿一-鿿A-Z]+$/;
const HAN = /[㐀-䶿一-鿿]/;
// A few common Simplified forms whose Traditional form differs. Catches a Simplified name pasted by mistake.
const SIMPLIFIED = /[饺虾烧鸡汤饭龙蓝卖肠鱼凤酱双门车马鸟东灯馆]/;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;
const label = (number: number) => `Dish ${number} (${dishByNumber(number)?.name ?? 'unknown'})`;

test('sections have unique, URL-safe ids, titles and dishes', () => {
  const ids = menu.sections.map(section => section.id);
  for (const id of ids) assert.match(id, SLUG, `section id "${id}" must be lowercase words joined by hyphens`);
  assert.equal(new Set(ids).size, ids.length, `section ids must be unique: ${ids.join(', ')}`);
  for (const section of menu.sections) {
    assert.ok(section.title.trim() && section.description.trim(), `section ${section.id} needs a title and description`);
    assert.match(section.titleZh, CHINESE, `section ${section.id}.titleZh must be Chinese characters`);
    assert.ok(ARTS.includes(section.art), `section ${section.id}.art must be one of ${ARTS.join(', ')}`);
    assert.ok(section.dishes.length >= 1, `section ${section.id} has no dishes`);
  }
});

test('menu numbers are unique, ascending within a section, and sections don’t overlap', () => {
  const numbers = allDishes.map(dish => dish.number);
  for (const dish of allDishes) {
    assert.ok(Number.isInteger(dish.number) && dish.number > 0, `${dish.name}: number must be a whole number above 0`);
  }
  const duplicates = numbers.filter((n, i) => numbers.indexOf(n) !== i);
  assert.deepEqual(duplicates, [], `menu numbers must be unique; repeated: ${duplicates.join(', ')}`);
  let previous = 0;
  for (const section of menu.sections) {
    for (const dish of section.dishes) {
      assert.ok(dish.number > previous,
        `${label(dish.number)} in "${section.title}" must come after ${previous}: numbers rise within a section and each section starts after the last one ends`);
      previous = dish.number;
    }
  }
  assert.equal(sectionRange(menu.sections[0]), `${menu.sections[0].dishes[0].number}–${menu.sections[0].dishes.at(-1)!.number}`);
  assert.equal(dishId(27), 'd27');
});

test('every dish is complete', () => {
  for (const dish of allDishes) {
    const name = label(dish.number);
    assert.ok(dish.name.trim(), `${name}: name`);
    assert.ok(dish.description.trim(), `${name}: description`);
    assert.ok(dish.description.length <= 120, `${name}: keep the description to one line (120 characters or fewer)`);
    if (dish.nameZh) {
      assert.match(dish.nameZh, CHINESE, `${name}: nameZh must be Chinese characters (Traditional), or '' if unsure`);
      assert.ok(HAN.test(dish.nameZh), `${name}: nameZh needs at least one Chinese character`);
      assert.doesNotMatch(dish.nameZh, SIMPLIFIED, `${name}: nameZh looks Simplified; use Traditional characters`);
    }
    assert.ok([0, 1, 2, 3].includes(dish.spice), `${name}: spice must be 0, 1, 2 or 3`);
    if (dish.diet) assert.ok(dish.diet in DIETS, `${name}: unknown diet "${dish.diet}"`);
    for (const allergen of dish.allergens) assert.ok(allergen in ALLERGENS, `${name}: unknown allergen "${allergen}"`);
    assert.equal(new Set(dish.allergens).size, dish.allergens.length, `${name}: an allergen is listed twice`);
    if (dish.diet && dish.allergens.some(a => a === 'shellfish' || a === 'fish')) {
      assert.fail(`${name}: is marked ${dish.diet} but lists fish or shellfish`);
    }
    if (dish.badge) assert.ok(dish.badge in BADGES, `${name}: unknown badge "${dish.badge}"`);
    if (typeof dish.price === 'number') {
      assert.ok(validPrice(dish.price), `${name}: price ${dish.price} must be a positive amount with at most two decimals`);
    } else {
      assert.ok(dish.price.length >= 2, `${name}: give two or more sizes, or a single number`);
      for (const option of dish.price) {
        assert.ok(option.label.trim(), `${name}: every size needs a label`);
        assert.ok(validPrice(option.amount), `${name} ${option.label}: price ${option.amount}`);
      }
      assert.equal(new Set(dish.price.map(o => o.label)).size, dish.price.length, `${name}: repeats a size label`);
    }
  }
});

test('the sample menu covers what the template shows off', () => {
  assert.ok(allDishes.length >= 40 && allDishes.length <= 55, `Keep 40–55 numbered dishes (now ${allDishes.length})`);
  assert.ok(allDishes.some(dish => dish.soldOut), 'Keep at least one sold-out dish so the "Sold out today" style is visible');
  for (const level of [0, 1, 2, 3]) assert.ok(allDishes.some(dish => dish.spice === level), `No dish has spice ${level}`);
  const vegetarian = allDishes.filter(dish => matchesFilter(dish, 'vegetarian'));
  assert.ok(vegetarian.length >= 8, `Keep 8 or more vegetarian dishes (now ${vegetarian.length})`);
  for (const allergen of Object.keys(ALLERGENS) as Allergen[]) {
    assert.ok(allDishes.some(dish => dish.allergens.includes(allergen)), `No dish is marked "${allergen}"`);
  }
});

test('the home page has 4–6 chef’s specials to show, all available', () => {
  assert.ok(featuredDishes.length >= 4 && featuredDishes.length <= 6, `Mark 4–6 dishes with featured: true (now ${featuredDishes.length})`);
  for (const { dish } of featuredDishes) assert.ok(!dish.soldOut, `${label(dish.number)} is featured but sold out`);
  for (const number of restaurant.dimSum.favourites) {
    const dish = dishByNumber(number);
    assert.ok(dish, `dimSum.favourites lists ${number}, which isn't on the menu`);
    assert.equal(menu.sections.find(s => s.dishes.includes(dish))?.id, 'dim-sum', `dimSum.favourites: ${label(number)} isn't in Dim sum`);
  }
});

test('menu filters: vegan counts as vegetarian; allergens and spice exclude', () => {
  assert.ok(matchesFilter({ diet: 'vegan', spice: 0, allergens: [] }, 'vegetarian'));
  assert.ok(!matchesFilter({ spice: 0, allergens: [] }, 'vegetarian'));
  assert.ok(!matchesFilter({ diet: 'vegan', spice: 1, allergens: [] }, 'no-spice'));
  assert.ok(!matchesFilter({ spice: 0, allergens: ['peanut'] }, 'no-peanut'));
  assert.ok(!matchesFilter({ spice: 0, allergens: ['shellfish'] }, 'no-shellfish'));
  assert.ok(matchesAll({ spice: 0, allergens: [] }, []));
  assert.ok(!matchesAll(dishByNumber(32)!, ['no-peanut']), 'kung pao has peanuts');
});

test('banquets are complete, available and use real menu numbers', () => {
  assert.ok(banquets.length >= 1, 'Add at least one banquet');
  const ids = banquets.map(b => b.id);
  assert.equal(new Set(ids).size, ids.length, `banquet ids must be unique: ${ids.join(', ')}`);
  for (const banquet of banquets) {
    const name = `Banquet "${banquet.id}"`;
    assert.match(banquet.id, SLUG, `${name}: id must be lowercase words joined by hyphens`);
    assert.ok(!menu.sections.some(s => s.id === banquet.id), `${name}: id clashes with a menu section`);
    assert.ok(banquet.name.trim() && banquet.description.trim(), `${name}: name and description`);
    assert.match(banquet.nameZh, CHINESE, `${name}: nameZh must be Chinese characters`);
    assert.ok(Number.isInteger(banquet.minGuests) && banquet.minGuests >= 2, `${name}: minGuests must be 2 or more`);
    assert.ok(validPrice(banquet.pricePerPerson), `${name}: pricePerPerson must be a positive amount`);
    assert.ok(Number.isInteger(banquet.noticeDays) && banquet.noticeDays >= 1, `${name}: noticeDays must be 1 or more`);
    assert.ok(banquet.courses.length >= 3, `${name}: list at least 3 courses`);
    for (const course of banquet.courses) {
      if (isMenuCourse(course)) {
        const dish = dishByNumber(course);
        assert.ok(dish, `${name}: course ${course} isn't a menu number`);
        assert.ok(!dish.soldOut, `${name}: course ${label(course)} is sold out; swap it or remove soldOut`);
      } else {
        assert.ok(course.name.trim(), `${name}: a banquet-only course needs a name`);
        assert.match(course.nameZh, CHINESE, `${name}: "${course.name}" needs a Chinese name`);
      }
    }
    const numbers = banquet.courses.filter(isMenuCourse);
    assert.equal(new Set(numbers).size, numbers.length, `${name}: lists a menu number twice`);
  }
  assert.equal(howItWorks.length, 3, 'Keep three "How banquets work" steps');
});

test('prices format in the menu currency', () => {
  assert.equal(formatPrice(16.5), '$16.50');
  assert.equal(formatPrice(16), '$16');
  assert.doesNotThrow(() => new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency }));
});

test('opening hours list each day once, with valid services in order', () => {
  assert.deepEqual(restaurant.hours.map(entry => entry.day), [...DAYS], 'List every day once, Monday first.');
  for (const entry of restaurant.hours) {
    let previousClose = -1;
    for (const service of entry.services) {
      const name = `${entry.day} ${service.label}`;
      assert.ok(SERVICE_LABELS.includes(service.label), `${name}: label must be one of ${SERVICE_LABELS.join(', ')}`);
      assert.match(service.opens, TIME, `${name}.opens must be "HH:MM"`);
      assert.match(service.closes, TIME, `${name}.closes must be "HH:MM"`);
      assert.ok(toMinutes(service.opens) < toMinutes(service.closes), `${name} must open before it closes`);
      assert.ok(toMinutes(service.opens) >= previousClose, `${name} overlaps or comes before the service listed above it`);
      assert.ok(toMinutes(service.closes) - toMinutes(service.opens) > restaurant.takeaway.lastOrdersMinutes,
        `${name} is shorter than takeaway.lastOrdersMinutes, so it would never take calls`);
      previousClose = toMinutes(service.closes);
    }
  }
  assert.ok(restaurant.hours.some(entry => entry.services.length), 'Open on at least one day.');
});

test('takeaway is by phone, with no delivery or online ordering promises', () => {
  const { takeaway } = restaurant;
  assert.match(takeaway.phone, /\d{3}.*\d{4}/, 'takeaway.phone');
  assert.match(telHref(takeaway.phone), /^tel:\+?\d{7,15}$/);
  assert.ok(Number.isInteger(takeaway.lastOrdersMinutes) && takeaway.lastOrdersMinutes >= 0 && takeaway.lastOrdersMinutes <= 90,
    'takeaway.lastOrdersMinutes must be a whole number of minutes, 0–90');
  assert.ok(takeaway.pickupWait.trim() && takeaway.payment.trim() && takeaway.note.trim());
  const text = JSON.stringify({ restaurant, menu, banquets, howItWorks });
  assert.doesNotMatch(text, /doordash|uber ?eats|grubhub|postmates|deliveroo|seamless|caviar/i, 'No third-party delivery app names.');
  assert.doesNotMatch(text, /order online|online ordering|we deliver|free delivery|pay online/i, 'There is no online ordering, delivery or payment.');
  assert.doesNotMatch(text, /oriental/i, 'Avoid the word "Oriental".');
});

test('contact details, story and FAQs are publishable', () => {
  assert.match(restaurant.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.match(restaurant.nameZh, CHINESE, 'nameZh must be Chinese characters');
  assert.ok(restaurant.sealZh.length >= 1 && restaurant.sealZh.length <= 4 && CHINESE.test(restaurant.sealZh), 'sealZh: 1–4 Chinese characters');
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(restaurant.story.length >= 1, 'Write at least one story paragraph');
  assert.equal(restaurant.storyPoints.length, 3, 'Write three story points');
  assert.ok(restaurant.faqs.length >= 1 && restaurant.amenities.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('America/Los_Angeles'), 'Pacific Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(restaurant.address[key].trim(), `address.${key}`);
  assert.match(restaurant.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, 'Chinatown Friendship Gate, Philadelphia, PA 19107');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=Chinatown%20Friendship%20Gate'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sChinatown+Friendship+Gate%2C+Philadelphia%2C+PA+19107!6i16');
  assert.ok(mapEmbedUrl('Shop! 1').includes('1sShop%21+1!6i16'));
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
