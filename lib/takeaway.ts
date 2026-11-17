// The takeaway list: a note of dish numbers a visitor builds on the menu page, to read out when they call.
// It is NOT online ordering. Nothing here sends anything anywhere; the list lives in the visitor's browser.
// Pure functions with no imports, so every rule is unit tested (tests/takeaway.test.ts).

/** One way a dish is sold, e.g. { label: 'Large', amount: 14 } or { label: '8 pcs', amount: 9.5 }. */
export interface PriceOption {
  label: string;
  amount: number;
}

/** What the list needs to know about a dish. Menu dishes satisfy this shape. */
export interface ListableDish {
  /** The menu number people say on the phone. */
  number: number;
  name: string;
  /** One price, or a choice of sizes / piece counts. */
  price: number | readonly PriceOption[];
  soldOut?: boolean;
}

export interface TakeawayLine {
  /** Menu number. */
  number: number;
  /** Size or piece-count label for dishes with options; omitted for single-price dishes. */
  option?: string;
  /** 1 – MAX_QUANTITY. */
  quantity: number;
}

export type TakeawayList = readonly TakeawayLine[];

/** Find a dish by its number, e.g. built with `new Map(dishes.map(d => [d.number, d]))`. */
export type DishLookup = (number: number) => ListableDish | undefined;

/** A phone order rarely needs more than this many of one thing; it also keeps saved data sane. */
export const MAX_QUANTITY = 20;

/** The local storage key. Bump the version if the saved shape ever changes. */
export const STORAGE_KEY = 'takeaway-list:v1';

/** Size/piece-count labels a dish offers, or [] for a single-price dish. */
export function optionLabels(dish: ListableDish): string[] {
  return typeof dish.price === 'number' ? [] : dish.price.map(option => option.label);
}

/** A valid option label for this dish: the requested one if it exists, else the first (or none). */
function resolveOption(dish: ListableDish, option?: string): string | undefined {
  const labels = optionLabels(dish);
  if (!labels.length) return undefined;
  return option && labels.includes(option) ? option : labels[0];
}

const sameLine = (line: TakeawayLine, number: number, option?: string) => line.number === number && line.option === option;

/**
 * Add one of a dish. Repeats increase the quantity of the matching line. Sold-out dishes are rejected:
 * the same list comes back unchanged.
 */
export function addDish(list: TakeawayList, dish: ListableDish, option?: string): TakeawayList {
  if (dish.soldOut) return list;
  const chosen = resolveOption(dish, option);
  const existing = list.find(line => sameLine(line, dish.number, chosen));
  if (existing) {
    return list.map(line => line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + 1) } : line);
  }
  return [...list, chosen === undefined ? { number: dish.number, quantity: 1 } : { number: dish.number, option: chosen, quantity: 1 }];
}

/** Set a line's quantity. Zero or less removes it. */
export function setQuantity(list: TakeawayList, number: number, option: string | undefined, quantity: number): TakeawayList {
  if (!Number.isFinite(quantity) || quantity <= 0) return removeLine(list, number, option);
  const capped = Math.min(MAX_QUANTITY, Math.floor(quantity));
  return list.map(line => sameLine(line, number, option) ? { ...line, quantity: capped } : line);
}

export function removeLine(list: TakeawayList, number: number, option?: string): TakeawayList {
  return list.filter(line => !sameLine(line, number, option));
}

/** Switch a line to another size. If that size is already on the list, the two lines merge. */
export function changeOption(list: TakeawayList, dish: ListableDish, from: string | undefined, to: string): TakeawayList {
  const target = resolveOption(dish, to);
  if (target === from) return list;
  const moving = list.find(line => sameLine(line, dish.number, from));
  if (!moving) return list;
  const existing = list.find(line => sameLine(line, dish.number, target));
  if (existing) {
    return list
      .filter(line => line !== moving)
      .map(line => line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + moving.quantity) } : line);
  }
  return list.map(line => line === moving ? { ...line, option: target } : line);
}

/** Price of one of this line's dish, or undefined when the dish or option is unknown. */
export function unitPrice(line: TakeawayLine, dish: ListableDish | undefined): number | undefined {
  if (!dish) return undefined;
  if (typeof dish.price === 'number') return line.option === undefined ? dish.price : undefined;
  return dish.price.find(option => option.label === line.option)?.amount;
}

/** Total number of dishes (sum of quantities). */
export function itemCount(list: TakeawayList): number {
  return list.reduce((sum, line) => sum + line.quantity, 0);
}

/** Estimated total, rounded to cents. Lines whose dish is unknown are left out. */
export function estimatedTotal(list: TakeawayList, lookup: DishLookup): number {
  const cents = list.reduce((sum, line) => sum + Math.round((unitPrice(line, lookup(line.number)) ?? 0) * 100) * line.quantity, 0);
  return cents / 100;
}

/** "27 · Salt & pepper squid (Large) × 2". */
export function describeLine(line: TakeawayLine, dish: ListableDish): string {
  return `${line.number} · ${dish.name}${line.option ? ` (${line.option})` : ''} × ${line.quantity}`;
}

/** Plain text for the clipboard or to read out on the phone. */
export function listAsText(list: TakeawayList, lookup: DishLookup, formatPrice: (amount: number) => string, heading = 'Takeaway list'): string {
  const lines = list.flatMap(line => {
    const dish = lookup(line.number);
    return dish ? [describeLine(line, dish)] : [];
  });
  return [heading, ...lines, `Estimated total: ${formatPrice(estimatedTotal(list, lookup))} (confirmed by phone)`].join('\n');
}

/**
 * Rebuild a saved list (from JSON in local storage, or anything else) against today's menu.
 * Unknown numbers, sold-out dishes, sizes the dish no longer has and malformed entries are dropped;
 * quantities are clamped; duplicate lines merge. `dropped` lists the numbers that were removed, so the
 * page can say so.
 */
export function restoreList(saved: unknown, lookup: DishLookup): { list: TakeawayList; dropped: number[] } {
  let raw = saved;
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw); } catch { return { list: [], dropped: [] }; }
  }
  if (!Array.isArray(raw)) return { list: [], dropped: [] };
  let list: TakeawayList = [];
  const dropped: number[] = [];
  for (const entry of raw.slice(0, 100)) {
    if (!entry || typeof entry !== 'object') continue;
    const { number, option, quantity } = entry as Record<string, unknown>;
    if (typeof number !== 'number' || !Number.isInteger(number)) continue;
    const dish = lookup(number);
    const labels = dish ? optionLabels(dish) : [];
    const optionOk = labels.length ? typeof option === 'string' && labels.includes(option) : option === undefined;
    const count = typeof quantity === 'number' && Number.isFinite(quantity) ? Math.floor(quantity) : 0;
    if (!dish || dish.soldOut || !optionOk || count < 1) {
      if (!dropped.includes(number)) dropped.push(number);
      continue;
    }
    const chosen = labels.length ? option as string : undefined;
    const existing = list.find(line => sameLine(line, number, chosen));
    list = existing
      ? list.map(line => line === existing ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + count) } : line)
      : [...list, chosen === undefined ? { number, quantity: Math.min(MAX_QUANTITY, count) } : { number, option: chosen, quantity: Math.min(MAX_QUANTITY, count) }];
  }
  return { list, dropped };
}
