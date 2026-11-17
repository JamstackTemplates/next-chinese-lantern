// The numbered menu. Add, remove, reorder or reprice dishes here; every page reads from this file.
// Names, numbers and prices are placeholders for a fictitious restaurant: replace them with your own.
// Plain strings only: text is rendered as text, never as HTML.
//
// The owner's most frequent edits are one-line changes here:
//   sold out today       → add `soldOut: true` to the dish (remove it when it's back)
//   new price            → change `price`
//   chef's special       → add `badge: 'chef'` (and `featured: true` to show it on the home page)

/** Dietary marks. Vegan dishes count as vegetarian in the filters, so tag a dish with just one. */
export type Diet = 'vegetarian' | 'vegan';

export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
};

/** Allergens marked on dishes. Guidance only: the kitchen handles all of them. */
export type Allergen = 'peanut' | 'tree-nut' | 'shellfish' | 'fish' | 'sesame' | 'soy' | 'gluten' | 'egg';

export const ALLERGENS: Record<Allergen, { label: string; short: string }> = {
  peanut: { label: 'Peanut', short: 'Pn' },
  'tree-nut': { label: 'Tree nuts', short: 'Nt' },
  shellfish: { label: 'Shellfish', short: 'Sh' },
  fish: { label: 'Fish', short: 'Fi' },
  sesame: { label: 'Sesame', short: 'Se' },
  soy: { label: 'Soy', short: 'So' },
  gluten: { label: 'Gluten (wheat)', short: 'Gl' },
  egg: { label: 'Egg', short: 'Eg' },
};

export type Badge = 'chef' | 'house' | 'seasonal' | 'new';

export const BADGES: Record<Badge, string> = {
  chef: 'Chef’s choice',
  house: 'House favourite',
  seasonal: 'Seasonal',
  new: 'New',
};

/** A size or piece count, e.g. { label: 'Large', amount: 14 } or { label: '8 pcs', amount: 9.5 }. */
export interface PriceOption {
  label: string;
  amount: number;
}

/** Line drawing used for featured dishes and section headings. See components/dish-art.tsx. */
export type Art = 'steamer' | 'bowl' | 'wok' | 'teapot';

export const ARTS: readonly Art[] = ['steamer', 'bowl', 'wok', 'teapot'];

export interface Dish {
  /** The menu number people order by. Unique across the menu and ascending within a section. */
  number: number;
  /** English name, e.g. "Salt & pepper squid". */
  name: string;
  /** Chinese name in Traditional characters, e.g. "椒鹽鮮魷". Leave '' rather than guess. */
  nameZh: string;
  /** One line: what's in it and how it's cooked. */
  description: string;
  /** One price, or sizes / piece counts. Amounts are in `menu.currency`, e.g. 16.5. */
  price: number | PriceOption[];
  /** Chilli heat from 0 (none) to 3 (hot). */
  spice: 0 | 1 | 2 | 3;
  /** Vegetarian or vegan (just one). Leave out for dishes with meat or seafood. */
  diet?: Diet;
  /** Allergens in the recipe. Guidance only; see `menu.allergenNote`. */
  allergens: Allergen[];
  /** Optional mark beside the name. */
  badge?: Badge;
  /** Show among the home page "Chef's specials" (keep 4–6 featured dishes). */
  featured?: boolean;
  /** Keep the dish listed as "Sold out today" without deleting it. It can't be added to a takeaway list. */
  soldOut?: boolean;
}

export interface MenuSection {
  /** Unique, URL-safe id used for links such as /menu/#dim-sum. */
  id: string;
  title: string;
  /** Chinese title, shown large and faint behind the heading. */
  titleZh: string;
  /** Short line under the title. */
  description: string;
  /** Line drawing for featured dishes from this section. */
  art: Art;
  dishes: Dish[];
}

export interface Menu {
  /** ISO 4217 currency code. */
  currency: string;
  /** Locale used to format prices, e.g. "en-US". */
  locale: string;
  sections: MenuSection[];
  /** Shown with the allergen key at the top and bottom of the menu. */
  allergenNote: string;
  /** Small print under the menu. */
  notes: string[];
}

export const menu: Menu = {
  currency: 'USD',
  locale: 'en-US',
  sections: [
    {
      id: 'dim-sum',
      title: 'Dim sum',
      titleZh: '點心',
      description: 'Folded by hand every morning and steamed to order. Served at lunch every day we’re open.',
      art: 'steamer',
      dishes: [
        { number: 1, name: 'Har gow', nameZh: '蝦餃', description: 'Crystal-skin shrimp dumplings with bamboo shoot, four to a basket.', price: 7.5, spice: 0, allergens: ['shellfish', 'gluten'], badge: 'house', featured: true },
        { number: 2, name: 'Siu mai', nameZh: '燒賣', description: 'Open pork and shrimp dumplings topped with a little crab roe.', price: 7, spice: 0, allergens: ['shellfish', 'egg', 'gluten', 'soy'] },
        { number: 3, name: 'Char siu bao', nameZh: '叉燒包', description: 'Fluffy steamed buns filled with sticky barbecue pork.', price: 6.5, spice: 0, allergens: ['gluten', 'soy', 'sesame'] },
        { number: 4, name: 'Shrimp cheung fun', nameZh: '鮮蝦腸粉', description: 'Silky rice noodle rolls wrapped round whole shrimp, with sweet soy.', price: 7.5, spice: 0, allergens: ['shellfish', 'soy', 'gluten'] },
        { number: 5, name: 'Plain cheung fun', nameZh: '齋腸粉', description: 'Rice noodle rolls with sesame sauce, hoisin and toasted sesame seeds.', price: 6, spice: 0, diet: 'vegan', allergens: ['sesame', 'soy', 'gluten'] },
        { number: 6, name: 'Pan-fried turnip cake', nameZh: '蘿蔔糕', description: 'Daikon cake with dried shrimp and Chinese sausage, crisp on both sides.', price: 6.5, spice: 0, allergens: ['shellfish', 'soy'] },
        { number: 7, name: 'Potstickers', nameZh: '鍋貼', description: 'Pork and cabbage dumplings, steamed then fried until the bottoms crackle.', price: [{ label: '6 pcs', amount: 8 }, { label: '10 pcs', amount: 12.5 }], spice: 0, allergens: ['gluten', 'soy', 'sesame'] },
        { number: 8, name: 'Vegetable dumplings', nameZh: '素餃', description: 'Chinese chive, shiitake and glass noodles in a thin wheat skin.', price: 7, spice: 0, diet: 'vegan', allergens: ['gluten', 'soy'] },
        { number: 9, name: 'Lo mai gai', nameZh: '糯米雞', description: 'Sticky rice with chicken, mushroom and sausage, steamed in a lotus leaf.', price: 7.5, spice: 0, allergens: ['soy', 'gluten'], soldOut: true },
        { number: 10, name: 'Black bean spare ribs', nameZh: '豉汁蒸排骨', description: 'Bite-size pork ribs steamed with fermented black beans, garlic and red chilli.', price: 6.5, spice: 1, allergens: ['soy', 'gluten'] },
        { number: 11, name: 'Custard buns', nameZh: '奶黃包', description: 'Soft steamed buns with a sweet egg custard centre.', price: 6, spice: 0, diet: 'vegetarian', allergens: ['egg', 'gluten'] },
        { number: 12, name: 'Egg tarts', nameZh: '蛋撻', description: 'Flaky pastry with a just-set egg custard, baked through the morning.', price: [{ label: '3 pcs', amount: 6 }, { label: '6 pcs', amount: 11 }], spice: 0, diet: 'vegetarian', allergens: ['egg', 'gluten'] },
      ],
    },
    {
      id: 'soups',
      title: 'Soups',
      titleZh: '湯羹',
      description: 'Our stock simmers all day with pork bones, dried scallop and ginger.',
      art: 'bowl',
      dishes: [
        { number: 13, name: 'Wonton soup', nameZh: '雲吞湯', description: 'Pork and shrimp wontons in clear broth with yellow chives.', price: [{ label: 'Small', amount: 7.5 }, { label: 'Large', amount: 12 }], spice: 0, allergens: ['shellfish', 'egg', 'gluten', 'soy'] },
        { number: 14, name: 'Hot and sour soup', nameZh: '酸辣湯', description: 'Tofu, wood ear and bamboo shoot with white pepper and black vinegar.', price: [{ label: 'Small', amount: 6.5 }, { label: 'Large', amount: 10.5 }], spice: 2, diet: 'vegetarian', allergens: ['egg', 'soy', 'gluten'] },
        { number: 15, name: 'Chicken and sweetcorn soup', nameZh: '粟米雞茸羹', description: 'A gentle, thick soup of creamed corn, minced chicken and egg ribbons.', price: [{ label: 'Small', amount: 6.5 }, { label: 'Large', amount: 10.5 }], spice: 0, allergens: ['egg'] },
      ],
    },
    {
      id: 'starters',
      title: 'Starters',
      titleZh: '小食',
      description: 'Small plates to share while the wok gets going.',
      art: 'wok',
      dishes: [
        { number: 16, name: 'Vegetable spring rolls', nameZh: '齋春卷', description: 'Crisp rolls of cabbage, carrot and mushroom with sweet chilli dip.', price: 6.5, spice: 0, diet: 'vegan', allergens: ['gluten', 'soy'] },
        { number: 17, name: 'Fried wontons', nameZh: '炸雲吞', description: 'Golden pork and shrimp wontons with sweet and sour sauce.', price: 7.5, spice: 0, allergens: ['shellfish', 'egg', 'gluten'] },
        { number: 18, name: 'Sesame prawn toast', nameZh: '蝦多士', description: 'Minced prawn on toast, rolled in sesame seeds and fried.', price: 8, spice: 0, allergens: ['shellfish', 'sesame', 'egg', 'gluten'] },
        { number: 19, name: 'Salt & pepper tofu', nameZh: '椒鹽豆腐', description: 'Soft tofu with a light crust, tossed with garlic, scallion and chilli.', price: 9, spice: 1, diet: 'vegan', allergens: ['soy'] },
        { number: 20, name: 'Smashed cucumber', nameZh: '拍青瓜', description: 'Cold cucumber with garlic, black vinegar, chilli oil and sesame.', price: 6.5, spice: 1, diet: 'vegan', allergens: ['sesame', 'soy', 'gluten'] },
        { number: 21, name: 'Honey-glazed char siu', nameZh: '蜜汁叉燒', description: 'Barbecue pork shoulder, roasted until the edges char, sliced to order.', price: 13.5, spice: 0, allergens: ['soy', 'gluten', 'sesame'], badge: 'house' },
      ],
    },
    {
      id: 'noodles-rice',
      title: 'Noodles & rice',
      titleZh: '粉麵飯',
      description: 'Wok-tossed over a roaring flame for that smoky wok hei.',
      art: 'bowl',
      dishes: [
        { number: 22, name: 'Beef ho fun', nameZh: '乾炒牛河', description: 'Wide rice noodles seared with beef, bean sprouts and scallion.', price: 15.5, spice: 0, allergens: ['soy', 'gluten'], badge: 'house', featured: true },
        { number: 23, name: 'Singapore noodles', nameZh: '星洲炒米', description: 'Thin rice vermicelli with curry, char siu, shrimp, egg and peppers.', price: 14.5, spice: 1, allergens: ['shellfish', 'egg', 'soy'] },
        { number: 24, name: 'Yeung chow fried rice', nameZh: '揚州炒飯', description: 'The classic: char siu, shrimp, egg, peas and scallion.', price: [{ label: 'Small', amount: 9 }, { label: 'Large', amount: 14 }], spice: 0, allergens: ['shellfish', 'egg', 'soy'] },
        { number: 25, name: 'Soy sauce chow mein', nameZh: '豉油皇炒麵', description: 'Thin egg noodles tossed with superior soy, bean sprouts and onion.', price: 12.5, spice: 0, diet: 'vegetarian', allergens: ['egg', 'gluten', 'soy', 'sesame'] },
        { number: 26, name: 'Wonton noodle soup', nameZh: '雲吞麵', description: 'Springy egg noodles and shrimp wontons in a deep, clear broth.', price: 13, spice: 0, allergens: ['shellfish', 'egg', 'gluten', 'soy'] },
        { number: 27, name: 'Vegetable fried rice', nameZh: '蔬菜炒飯', description: 'Egg fried rice with gai lan stems, carrot, corn and scallion.', price: [{ label: 'Small', amount: 8 }, { label: 'Large', amount: 12.5 }], spice: 0, diet: 'vegetarian', allergens: ['egg', 'soy'] },
        { number: 28, name: 'Steamed jasmine rice', nameZh: '白飯', description: 'A bowl of plain jasmine rice.', price: [{ label: 'Bowl', amount: 2.5 }, { label: 'Family', amount: 6 }], spice: 0, diet: 'vegan', allergens: [] },
      ],
    },
    {
      id: 'mains',
      title: 'Mains (meat & seafood)',
      titleZh: '肉類海鮮',
      description: 'Big plates for the middle of the table. Order rice or noodles alongside.',
      art: 'wok',
      dishes: [
        { number: 29, name: 'Salt & pepper squid', nameZh: '椒鹽鮮魷', description: 'Tender squid in a feather-light batter with garlic, chilli and scallion.', price: 17.5, spice: 1, allergens: ['shellfish', 'gluten', 'egg'], badge: 'house', featured: true },
        { number: 30, name: 'Sweet & sour pork', nameZh: '咕嚕肉', description: 'Crisp pork with pineapple and peppers in a bright, tangy glaze.', price: 16.5, spice: 0, allergens: ['gluten', 'egg', 'soy'] },
        { number: 31, name: 'Black bean beef', nameZh: '豉汁牛肉', description: 'Sliced beef with green peppers and onion in fermented black bean sauce.', price: 17, spice: 1, allergens: ['soy', 'gluten'] },
        { number: 32, name: 'Kung pao chicken', nameZh: '宮保雞丁', description: 'Diced chicken with dried chillies, Sichuan pepper and roasted peanuts.', price: 16.5, spice: 2, allergens: ['peanut', 'soy', 'gluten'] },
        { number: 33, name: 'Lemon chicken', nameZh: '檸檬雞', description: 'Crisp chicken breast with a fresh lemon sauce.', price: 16, spice: 0, allergens: ['gluten', 'egg'] },
        { number: 34, name: 'Chicken with cashews', nameZh: '腰果雞丁', description: 'Chicken, celery and water chestnut stir-fried with toasted cashews.', price: 16.5, spice: 0, allergens: ['tree-nut', 'soy', 'gluten'] },
        { number: 35, name: 'Honey walnut prawns', nameZh: '合桃蝦球', description: 'Crisp prawns in a light honey mayonnaise with candied walnuts.', price: 21, spice: 0, allergens: ['shellfish', 'tree-nut', 'egg', 'gluten'] },
        { number: 36, name: 'Fish with black bean & peppers', nameZh: '豉椒魚片', description: 'Silky white fish fillet with peppers, onion and black bean.', price: 18.5, spice: 1, allergens: ['fish', 'soy', 'gluten'] },
        { number: 37, name: 'Satay beef', nameZh: '沙爹牛肉', description: 'Beef and onion in a warm, peanutty satay sauce.', price: 17, spice: 1, allergens: ['peanut', 'soy', 'shellfish'] },
      ],
    },
    {
      id: 'vegetables-tofu',
      title: 'Vegetables & tofu',
      titleZh: '蔬菜豆腐',
      description: 'All made without meat or fish sauce. Tell us if you’d like them milder.',
      art: 'wok',
      dishes: [
        { number: 38, name: 'Mapo tofu', nameZh: '麻婆豆腐', description: 'Silken tofu in a numbing, fiery chilli bean sauce, made with mushrooms instead of pork.', price: 14, spice: 3, diet: 'vegan', allergens: ['soy', 'gluten'], featured: true },
        { number: 39, name: 'Buddha’s delight', nameZh: '羅漢齋', description: 'Braised tofu skin, mushrooms, cabbage, carrot and glass noodles.', price: 14.5, spice: 0, diet: 'vegan', allergens: ['soy', 'gluten'] },
        { number: 40, name: 'Gai lan with garlic', nameZh: '蒜蓉炒芥蘭', description: 'Chinese broccoli stir-fried with plenty of garlic.', price: 12, spice: 0, diet: 'vegan', allergens: [] },
        { number: 41, name: 'Fish-fragrant eggplant', nameZh: '魚香茄子', description: 'Soft eggplant in a sweet, sour and spicy garlic sauce. No fish, despite the name.', price: 13.5, spice: 2, diet: 'vegan', allergens: ['soy', 'gluten'] },
        { number: 42, name: 'Dry-fried green beans', nameZh: '乾煸四季豆', description: 'Blistered green beans with preserved vegetable and dried chilli.', price: 13, spice: 2, diet: 'vegan', allergens: ['soy'] },
      ],
    },
    {
      id: 'chefs-specials',
      title: 'Chef’s specials',
      titleZh: '廚師推介',
      description: 'What Mr. Lau cooks when he has the time. Worth the wait.',
      art: 'wok',
      dishes: [
        { number: 43, name: 'Crispy roast pork belly', nameZh: '脆皮燒肉', description: 'Pork belly roasted until the crackling shatters, with mustard on the side.', price: 19, spice: 0, allergens: [], badge: 'chef', featured: true },
        { number: 44, name: 'Scallops in XO sauce', nameZh: 'XO醬炒帶子', description: 'Seared scallops with asparagus in our house XO sauce of dried scallop and shrimp.', price: 26, spice: 1, allergens: ['shellfish', 'fish', 'soy'], badge: 'chef' },
        { number: 45, name: 'Lobster with ginger & scallion', nameZh: '薑葱龍蝦', description: 'Whole lobster wok-tossed with young ginger and scallion. Please allow 30 minutes.', price: 48, spice: 0, allergens: ['shellfish', 'soy'], badge: 'seasonal' },
      ],
    },
    {
      id: 'desserts',
      title: 'Desserts',
      titleZh: '甜品',
      description: 'Something sweet and cool to finish.',
      art: 'bowl',
      dishes: [
        { number: 46, name: 'Mango pudding', nameZh: '芒果布甸', description: 'Smooth mango pudding with evaporated milk poured over.', price: 6, spice: 0, diet: 'vegetarian', allergens: [] },
        { number: 47, name: 'Sesame balls', nameZh: '煎堆', description: 'Chewy glutinous rice balls with red bean paste, rolled in sesame.', price: 6, spice: 0, diet: 'vegan', allergens: ['sesame', 'gluten'] },
        { number: 48, name: 'Tofu pudding in ginger syrup', nameZh: '薑汁豆腐花', description: 'Warm silken tofu with a warming ginger and brown sugar syrup.', price: 5.5, spice: 0, diet: 'vegan', allergens: ['soy'], badge: 'new' },
      ],
    },
    {
      id: 'drinks-tea',
      title: 'Drinks & tea',
      titleZh: '茶飲',
      description: 'Tea comes by the pot and we’ll top it up as often as you like.',
      art: 'teapot',
      dishes: [
        { number: 49, name: 'Jasmine tea', nameZh: '茉莉花茶', description: 'Green tea scented with jasmine blossom. Light and floral.', price: 3.5, spice: 0, diet: 'vegan', allergens: [] },
        { number: 50, name: 'Oolong (Tieguanyin)', nameZh: '鐵觀音', description: 'A rolled oolong with a toasty, orchid-like finish.', price: 4, spice: 0, diet: 'vegan', allergens: [] },
        { number: 51, name: 'Pu-erh', nameZh: '普洱', description: 'Dark, earthy aged tea. The dim sum regulars’ choice.', price: 4, spice: 0, diet: 'vegan', allergens: [] },
        { number: 52, name: 'Chrysanthemum tea', nameZh: '菊花茶', description: 'Whole dried flowers steeped with a little rock sugar.', price: 3.5, spice: 0, diet: 'vegan', allergens: [] },
        { number: 53, name: 'Hong Kong milk tea', nameZh: '港式奶茶', description: 'Strong black tea pulled with evaporated milk. Hot or iced.', price: 4.5, spice: 0, diet: 'vegetarian', allergens: [] },
        { number: 54, name: 'Iced lemon tea', nameZh: '凍檸茶', description: 'Black tea over ice with fresh lemon slices to muddle.', price: 4, spice: 0, diet: 'vegan', allergens: [] },
        { number: 55, name: 'Soft drinks', nameZh: '汽水', description: 'Cola, lemon-lime, ginger ale or sparkling water.', price: 2.5, spice: 0, diet: 'vegan', allergens: [] },
      ],
    },
  ],
  allergenNote:
    'Allergen marks are a guide, not a guarantee. Our kitchen handles all of these allergens, and woks, fryers and steamers are shared, so please tell us about any allergy when you order.',
  notes: [
    'We don’t add MSG. Some sauces we buy in, such as oyster and soy sauce, contain naturally occurring glutamates.',
    'Spice marks show heat from none to three. We can make most dishes milder; just ask when you call.',
    'Prices on the website are a guide and are confirmed when you order.',
  ],
};

/** Every dish in menu order. */
export const allDishes: Dish[] = menu.sections.flatMap(section => section.dishes);

/** Dish lookup by number. */
const byNumber = new Map(allDishes.map(dish => [dish.number, dish]));
export const dishByNumber = (number: number): Dish | undefined => byNumber.get(number);

/** The page anchor for a dish, e.g. 27 → "d27" (/menu/#d27). Derived, so it can never drift. */
export const dishId = (number: number) => `d${number}`;

/** Each section's number range, derived from its dishes, e.g. "1–12". */
export function sectionRange(section: MenuSection): string {
  const numbers = section.dishes.map(dish => dish.number);
  if (!numbers.length) return '';
  const first = Math.min(...numbers);
  const last = Math.max(...numbers);
  return first === last ? `${first}` : `${first}–${last}`;
}

/** Featured dishes for the home page, in menu order, with the section they belong to. */
export const featuredDishes = menu.sections.flatMap(section =>
  section.dishes.filter(dish => dish.featured).map(dish => ({ dish, section })));

const formatter = new Intl.NumberFormat(menu.locale, { style: 'currency', currency: menu.currency });

/** $7.50, or $16 for whole amounts. */
export function formatPrice(amount: number): string {
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** Lowest price, e.g. for banquet comparisons. */
export function startingPrice(dish: Dish): number {
  return typeof dish.price === 'number' ? dish.price : Math.min(...dish.price.map(option => option.amount));
}
