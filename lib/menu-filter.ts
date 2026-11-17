import type { Allergen, Diet } from '../content/menu';

/** Filters offered on the menu page. Each one narrows the menu; several together must all match. */
export type MenuFilter = 'vegetarian' | 'no-spice' | 'no-peanut' | 'no-shellfish';

export const MENU_FILTERS: { id: MenuFilter; label: string }[] = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'no-spice', label: 'No spice' },
  { id: 'no-peanut', label: 'No peanuts' },
  { id: 'no-shellfish', label: 'No shellfish' },
];

/** What a filter needs to know about a dish. */
export interface FilterFacts {
  diet?: Diet;
  spice: number;
  allergens: readonly Allergen[];
}

/** Vegan dishes count as vegetarian. Allergen filters are a guide only (see the allergen note). */
export function matchesFilter(dish: FilterFacts, filter: MenuFilter): boolean {
  switch (filter) {
    case 'vegetarian': return dish.diet === 'vegetarian' || dish.diet === 'vegan';
    case 'no-spice': return !dish.spice;
    case 'no-peanut': return !dish.allergens.includes('peanut');
    case 'no-shellfish': return !dish.allergens.includes('shellfish');
  }
}

export function matchesAll(dish: FilterFacts, filters: readonly MenuFilter[]): boolean {
  return filters.every(filter => matchesFilter(dish, filter));
}
