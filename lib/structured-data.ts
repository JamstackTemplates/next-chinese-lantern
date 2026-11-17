import { formatAddress, restaurant } from '../content/restaurant';
import { menu } from '../content/menu';
import { mapSearchUrl } from './maps';
import { absoluteUrl } from './paths';

/** schema.org Restaurant for search engines and maps. Built from the same content as the pages. */
export function restaurantStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    alternateName: restaurant.nameZh,
    description: restaurant.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: restaurant.email,
    telephone: restaurant.takeaway.phone,
    servesCuisine: ['Chinese', 'Cantonese', 'Dim sum'],
    // Walk-ins only; banquets and large groups are arranged by enquiry.
    acceptsReservations: false,
    priceRange: '$$',
    currenciesAccepted: menu.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality,
      addressRegion: restaurant.address.region,
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.address.country,
    },
    hasMap: mapSearchUrl(formatAddress()),
    // One entry per service, so dim sum and dinner each appear with their own hours.
    openingHoursSpecification: restaurant.hours.flatMap(entry => entry.services.map(service => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${entry.day}`,
      opens: service.opens,
      closes: service.closes,
    }))),
    sameAs: restaurant.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
