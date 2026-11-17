// Restaurant details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious restaurant. The sample address is a public
// landmark (the Chinatown Friendship Gate at N 10th St and Arch St, Philadelphia) so the map has something
// real to show; replace it with yours. Plain strings only: text is rendered as text, never as HTML.
import type { DayHours } from '../lib/hours';

export interface Amenity {
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SocialLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Takeaway {
  /** Number people call for takeaway, as written for people, e.g. "(215) 555-0188". */
  phone: string;
  /** Takeaway calls stop this many minutes before each service closes, e.g. 30. */
  lastOrdersMinutes: number;
  /** Typical wait for a pickup order, e.g. "15–20 minutes". */
  pickupWait: string;
  /** How people pay, e.g. "Pay when you collect: card, tap or cash." */
  payment: string;
  /** Says plainly that orders are by phone only. */
  note: string;
}

export interface Restaurant {
  /** English name. */
  name: string;
  /** Chinese name in Traditional characters, set vertically on the signboard, e.g. "金燈餃子館". */
  nameZh: string;
  /** One or two characters for the small seal mark (sign bar, footer, icon), e.g. "金燈". */
  sealZh: string;
  /** Short line on the signboard. */
  tagline: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Home page "Our story" paragraphs. */
  story: string[];
  /** Three short points beside the story. */
  storyPoints: { title: string; detail: string }[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people. Usually the same as `takeaway.phone`. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address. */
    note?: string;
  };
  /** How to find you: transit, parking, step-free access. */
  directions: string[];
  /**
   * Every day of the week, Monday first, with its services in local time (the time zone is `timeZone`
   * in site.config.json). `services: []` means closed all day.
   */
  hours: DayHours[];
  /** Phone takeaway. There is no online ordering or delivery. */
  takeaway: Takeaway;
  /** Weekend dim sum note on the home page. */
  dimSum: { title: string; text: string; favourites: number[] };
  /** Optional one-off notice such as Lunar New Year hours. Set to '' to hide it. */
  notice: string;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: SocialLink[];
}

const dimSum = { label: 'Dim sum', opens: '10:30', closes: '15:00' } as const;
const weekendDimSum = { label: 'Dim sum', opens: '10:00', closes: '15:00' } as const;
const dinner = { label: 'Dinner', opens: '17:00', closes: '22:00' } as const;
const lateDinner = { label: 'Dinner', opens: '17:00', closes: '23:00' } as const;

export const restaurant: Restaurant = {
  name: 'Acme Dumpling House',
  nameZh: '金燈餃子館',
  sealZh: '金燈',
  tagline: 'Cantonese kitchen · dim sum · banquets',
  introduction:
    'A family-run Cantonese restaurant under the Friendship Gate. Dumplings folded by hand every morning, wok-fired dinners every night, and a number to call for takeaway.',
  story: [
    'Grandma Lau opened the first Acme Dumpling House with four tables, one steamer stack and a menu written on the back of a calendar. The dumplings were folded at the front window so people walking past could watch.',
    'Three generations on, the window table is still where the dumplings are folded, from 7am every day. Her son runs the woks, her granddaughter runs the floor and the phones, and the menu still has the numbers the regulars know by heart.',
  ],
  storyPoints: [
    { title: 'Folded each morning', detail: 'Every har gow and siu mai is made by hand on the day it’s steamed.' },
    { title: 'Stock all day', detail: 'Pork bones, dried scallop and ginger, simmered from opening to close.' },
    { title: 'Three generations', detail: 'The same family, the same numbers, and a few new dishes each year.' },
  ],
  email: 'hello@example.com',
  phone: '(215) 555-0188',
  address: {
    street: 'Chinatown Friendship Gate',
    locality: 'Philadelphia',
    region: 'PA',
    postalCode: '19107',
    country: 'US',
    note: 'Under the Friendship Gate, at N 10th St and Arch St',
  },
  directions: [
    'Two minutes’ walk from Jefferson Station (Regional Rail) and SEPTA’s 11th St station on the Market-Frankford Line.',
    'Metered street parking around Arch St; the Convention Center garages are a short walk.',
    'Step-free entrance and an accessible restroom.',
  ],
  hours: [
    { day: 'Monday', services: [dimSum, dinner] },
    { day: 'Tuesday', services: [] },
    { day: 'Wednesday', services: [dimSum, dinner] },
    { day: 'Thursday', services: [dimSum, dinner] },
    { day: 'Friday', services: [dimSum, lateDinner] },
    { day: 'Saturday', services: [weekendDimSum, lateDinner] },
    { day: 'Sunday', services: [weekendDimSum, { label: 'Dinner', opens: '17:00', closes: '21:30' }] },
  ],
  takeaway: {
    phone: '(215) 555-0188',
    lastOrdersMinutes: 30,
    pickupWait: '15–20 minutes, a little longer on Friday and Saturday nights',
    payment: 'Pay when you collect: card, tap or cash.',
    note: 'Takeaway is by phone only. Call, tell us your dish numbers, and we’ll have it ready to collect.',
  },
  dimSum: {
    title: 'Weekend dim sum',
    text: 'Dim sum runs every lunchtime we’re open, but weekends are when the room fills with families, the teapots never empty and the steamers stack high. Come from 10am on Saturday and Sunday, and expect a short wait after 11:30.',
    favourites: [1, 2, 3, 12],
  },
  notice: 'Lunar New Year: we’re open every day of the festival week, including Tuesday. Book banquets early.',
  amenities: [
    { title: 'Walk-ins welcome', detail: 'We don’t take reservations. Large groups and banquets, send us a note.' },
    { title: 'Call for takeaway', detail: 'Ready in 15–20 minutes. Pay when you collect.' },
    { title: 'Round tables', detail: 'Lazy Susans for groups of eight to twelve.' },
    { title: 'Step-free', detail: 'Level entrance and an accessible restroom.' },
  ],
  faqs: [
    {
      question: 'Do you deliver?',
      answer: 'No. We do dine-in and takeaway only. Call us with your dish numbers and collect it from the counter, usually in 15–20 minutes.',
    },
    {
      question: 'How long does a takeaway order take?',
      answer: 'Usually 15–20 minutes from your call, a little longer on Friday and Saturday nights. The lobster needs about 30 minutes. We’ll tell you a time when you order.',
    },
    {
      question: 'Do you take reservations?',
      answer: 'We’re walk-in only for small tables, and they turn over quickly. For groups of eight or more, or a banquet, send us a message through the Contact page and we’ll reply to arrange it.',
    },
    {
      question: 'What about allergies and MSG?',
      answer: 'The menu marks peanut, tree nuts, shellfish, fish, sesame, soy, gluten and egg, but our kitchen handles all of them and shares woks and fryers, so please tell us about any allergy when you order. We don’t add MSG.',
    },
    {
      question: 'Do you have vegetarian and vegan dishes?',
      answer: 'Yes, plenty. The menu marks every vegetarian and vegan dish, our mapo tofu is made with mushrooms instead of pork, and there’s a whole vegetarian banquet. Use the filters on the menu page to see them.',
    },
    {
      question: 'Are you open over Lunar New Year?',
      answer: 'Yes, every day of the festival week, including the Tuesday we usually close. It’s our busiest week, so call takeaway orders in early and book banquets well ahead.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = restaurant.links.filter(link => link.url.trim() !== '');

/** Single-line postal address, also used for the map and directions. */
export function formatAddress(address = restaurant.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** tel: link for a number written for people, e.g. "(215) 555-0188" → "tel:2155550188". */
export function telHref(phone = restaurant.takeaway.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}
