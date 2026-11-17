// The takeaway list: a phone-order note kept in the browser. Pure logic, tested without a browser.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  addDish, changeOption, describeLine, estimatedTotal, itemCount, listAsText, MAX_QUANTITY, removeLine, restoreList,
  setQuantity, type ListableDish, type TakeawayList,
} from '../lib/takeaway.ts';

const squid: ListableDish = { number: 29, name: 'Salt & pepper squid', price: 17.5 };
const rice: ListableDish = { number: 24, name: 'Yeung chow fried rice', price: [{ label: 'Small', amount: 9 }, { label: 'Large', amount: 14 }] };
const potstickers: ListableDish = { number: 7, name: 'Potstickers', price: [{ label: '6 pcs', amount: 8 }, { label: '10 pcs', amount: 12.5 }] };
const laiMaiGai: ListableDish = { number: 9, name: 'Lo mai gai', price: 7.5, soldOut: true };
const dishes = new Map([squid, rice, potstickers, laiMaiGai].map(dish => [dish.number, dish]));
const lookup = (number: number) => dishes.get(number);
const usd = (amount: number) => `$${amount.toFixed(2)}`;

test('adding a dish, then the same dish again, raises the quantity', () => {
  let list: TakeawayList = [];
  list = addDish(list, squid);
  assert.deepEqual(list, [{ number: 29, quantity: 1 }]);
  list = addDish(list, squid);
  assert.deepEqual(list, [{ number: 29, quantity: 2 }]);
  assert.equal(itemCount(list), 2);
});

test('dishes with sizes or piece counts default to the first and keep sizes on separate lines', () => {
  let list = addDish([], rice);
  assert.deepEqual(list, [{ number: 24, option: 'Small', quantity: 1 }]);
  list = addDish(list, rice, 'Large');
  list = addDish(list, rice, 'Large');
  assert.deepEqual(list, [{ number: 24, option: 'Small', quantity: 1 }, { number: 24, option: 'Large', quantity: 2 }]);
  // An unknown size falls back to the first.
  assert.deepEqual(addDish([], potstickers, 'Huge'), [{ number: 7, option: '6 pcs', quantity: 1 }]);
});

test('sold-out dishes are rejected', () => {
  const list: TakeawayList = [{ number: 29, quantity: 1 }];
  assert.equal(addDish(list, laiMaiGai), list);
  assert.equal(addDish([], laiMaiGai).length, 0);
});

test('quantities can be set, are capped, and zero removes the line', () => {
  let list = addDish(addDish([], squid), rice);
  list = setQuantity(list, 29, undefined, 3);
  assert.equal(list[0].quantity, 3);
  list = setQuantity(list, 29, undefined, 999);
  assert.equal(list[0].quantity, MAX_QUANTITY);
  list = setQuantity(list, 29, undefined, 0);
  assert.deepEqual(list, [{ number: 24, option: 'Small', quantity: 1 }]);
  for (let i = 0; i < 30; i++) list = addDish(list, rice);
  assert.equal(list[0].quantity, MAX_QUANTITY);
});

test('removing a line leaves the others', () => {
  let list = addDish(addDish(addDish([], squid), rice), rice, 'Large');
  list = removeLine(list, 24, 'Small');
  assert.deepEqual(list, [{ number: 29, quantity: 1 }, { number: 24, option: 'Large', quantity: 1 }]);
});

test('changing size moves the line, merging with a line already in that size', () => {
  let list = addDish(addDish([], rice), rice, 'Large');
  list = changeOption(list, rice, 'Small', 'Large');
  assert.deepEqual(list, [{ number: 24, option: 'Large', quantity: 2 }]);
  list = changeOption(list, rice, 'Large', 'Small');
  assert.deepEqual(list, [{ number: 24, option: 'Small', quantity: 2 }]);
});

test('the estimated total adds up prices by size and quantity, to the cent', () => {
  let list = addDish([], squid);
  list = addDish(list, rice, 'Large');
  list = setQuantity(list, 24, 'Large', 2);
  list = addDish(list, potstickers, '10 pcs');
  assert.equal(estimatedTotal(list, lookup), 17.5 + 28 + 12.5);
  // Floating point never leaks into the total.
  const many = Array.from({ length: 3 }, () => ({ number: 0, quantity: 1 }));
  assert.equal(estimatedTotal(many, () => ({ number: 0, name: 'x', price: 0.1 })), 0.3);
  assert.equal(estimatedTotal([], lookup), 0);
});

test('the list reads out as numbers and names', () => {
  const list = addDish(addDish([], squid), rice, 'Large');
  assert.equal(describeLine(list[0], squid), '29 · Salt & pepper squid × 1');
  assert.equal(describeLine(list[1], rice), '24 · Yeung chow fried rice (Large) × 1');
  assert.equal(listAsText(list, lookup, usd), [
    'Takeaway list',
    '29 · Salt & pepper squid × 1',
    '24 · Yeung chow fried rice (Large) × 1',
    'Estimated total: $31.50 (confirmed by phone)',
  ].join('\n'));
});

test('a saved list is restored against today’s menu', () => {
  const saved = JSON.stringify([
    { number: 29, quantity: 2 },
    { number: 24, option: 'Large', quantity: 1 },
    { number: 9, quantity: 1 },            // sold out today
    { number: 99, quantity: 1 },           // no longer on the menu
    { number: 7, option: '12 pcs', quantity: 1 }, // size no longer offered
    { number: 29, quantity: 1 },           // duplicate merges
    { number: 24, option: 'Large', quantity: 500 }, // clamped
    { number: '24', quantity: 1 },         // malformed
    null,
  ]);
  const { list, dropped } = restoreList(saved, lookup);
  assert.deepEqual(list, [{ number: 29, quantity: 3 }, { number: 24, option: 'Large', quantity: MAX_QUANTITY }]);
  assert.deepEqual(dropped, [9, 99, 7]);
});

test('unreadable saved data gives an empty list instead of an error', () => {
  for (const value of ['not json', '{"a":1}', 42, null, undefined, '']) {
    assert.deepEqual(restoreList(value, lookup), { list: [], dropped: [] }, String(value));
  }
  // A single-price dish saved with a size (or a sized dish without one) is dropped.
  assert.deepEqual(restoreList([{ number: 29, option: 'Large', quantity: 1 }, { number: 24, quantity: 1 }], lookup).list, []);
});
