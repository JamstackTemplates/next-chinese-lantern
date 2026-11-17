// Banquet set menus for groups and celebrations. Every course is either a menu number (so its name,
// Chinese name and details come from content/menu.ts) or a short label for banquet-only courses.
// Placeholder content for a fictitious restaurant. The website takes no bookings or payments: a message
// through the Contact page is an enquiry, and nothing is booked until the restaurant replies.

/** A banquet-only course that isn't on the everyday menu, e.g. a whole steamed fish. */
export interface BanquetOnlyCourse {
  name: string;
  /** Chinese name in Traditional characters. */
  nameZh: string;
}

/** A menu number such as 22, or a banquet-only course. */
export type Course = number | BanquetOnlyCourse;

export interface Banquet {
  /** Unique, URL-safe id used for links such as /banquets/#celebration. */
  id: string;
  name: string;
  /** Chinese name in Traditional characters. */
  nameZh: string;
  /** One or two sentences: who it's for. */
  description: string;
  /** Smallest table this menu is cooked for. At least 2. */
  minGuests: number;
  /** Price per person in `menu.currency`. */
  pricePerPerson: number;
  /** Courses in serving order. */
  courses: Course[];
  /** Days' notice the kitchen needs, at least 1. */
  noticeDays: number;
}

export interface HowItWorksStep {
  title: string;
  detail: string;
}

export const banquets: Banquet[] = [
  {
    id: 'family',
    name: 'Family feast',
    nameZh: '合家歡套餐',
    description: 'Our everyday favourites for a family round the lazy Susan: dim sum to start, three mains to share and fried rice.',
    minGuests: 4,
    pricePerPerson: 34,
    courses: [13, 1, 2, 29, 31, 32, 40, 24, 46],
    noticeDays: 1,
  },
  {
    id: 'celebration',
    name: 'Celebration banquet',
    nameZh: '喜慶宴',
    description: 'Birthdays, weddings and big family nights. Ten courses including a whole steamed fish, lobster and long-life noodles, finished with longevity buns.',
    minGuests: 8,
    pricePerPerson: 68,
    courses: [
      { name: 'Roast suckling pig platter', nameZh: '乳豬拼盤' },
      1,
      2,
      44,
      45,
      43,
      { name: 'Whole steamed fish with ginger and scallion', nameZh: '清蒸全魚' },
      { name: 'Dry-braised e-fu noodles for long life', nameZh: '乾燒伊麵' },
      { name: 'Longevity peach buns', nameZh: '壽桃包' },
      46,
    ],
    noticeDays: 5,
  },
  {
    id: 'vegetarian',
    name: 'Vegetarian banquet',
    nameZh: '素食宴',
    description: 'A full banquet with no meat or fish, from steamed dumplings to mapo tofu made with mushrooms. Most of it is vegan.',
    minGuests: 4,
    pricePerPerson: 38,
    courses: [5, 8, 16, 19, 38, 39, 41, 27, 48],
    noticeDays: 2,
  },
];

export const howItWorks: HowItWorksStep[] = [
  {
    title: 'Send us a note',
    detail: 'Tell us the date, the time, how many guests and which banquet you’d like, plus any allergies.',
  },
  {
    title: 'We confirm the menu and price',
    detail: 'We’ll reply within a day or two to confirm we can host you, suggest any swaps and agree the final price.',
  },
  {
    title: 'Deposit details by email',
    detail: 'To hold the table we send deposit details by email. The website never takes a payment.',
  },
];

/** Course details for display: menu dishes are looked up by number. */
export function isMenuCourse(course: Course): course is number {
  return typeof course === 'number';
}
