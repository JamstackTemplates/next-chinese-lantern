import { formatAddress, restaurant } from '../content/restaurant';
import { mapEmbedUrl } from '../lib/maps';

/**
 * Google Maps embed for the restaurant's address. Lazy-loaded, so pages only contact Google when
 * the map scrolls into view. Dark mode softens the map with --map-filter (tailwind.input.css).
 */
export function GoogleMap({ className = '' }: { className?: string }) {
  return (
    <div className={`map ${className}`}>
      <iframe
        src={mapEmbedUrl(formatAddress())}
        title={`Map showing ${restaurant.name} at ${formatAddress()}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
