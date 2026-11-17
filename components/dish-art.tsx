import type { ReactNode } from 'react';
import type { Art } from '../content/menu';

/**
 * Line drawings in gold (light) or pale gold (dark), drawn with currentColor in a 64×64 box.
 * Steam rises from the steamer, bowl and teapot; it stops under prefers-reduced-motion.
 */
const DRAWINGS: Record<Art, ReactNode> = {
  // A two-tier bamboo steamer with its lid.
  steamer: (
    <>
      <path className="steam" d="M24 14c-3-3 3-5 0-8M32 13c-3-3 3-5 0-8M40 14c-3-3 3-5 0-8" />
      <path d="M12 24c0-4 9-6 20-6s20 2 20 6" />
      <path d="M12 24h40M30 18.3v-1.8M34 18.3v-1.8" />
      <path d="M10 27h44v9H10zM10 36h44v11H10z" />
      <path d="M14 27v20M50 27v20M18 30.5h28M18 40.5h28" opacity=".55" />
      <path d="M8 47h48" />
    </>
  ),
  // A noodle bowl with chopsticks resting across it.
  bowl: (
    <>
      <path className="steam" d="M26 18c-3-3 3-5 0-8M34 17c-3-3 3-5 0-8" />
      <path d="M38 6 22 30M46 8 28 30" />
      <path d="M8 30h48c0 11-10 19-24 19S8 41 8 30Z" />
      <path d="M14 30c3 3 6-2 9 1s6-2 9 1 6-2 9 1 6-2 9-1" opacity=".55" />
      <path d="M24 49l-2 6h20l-2-6" />
      <path d="M16 38c4 1 9 1.5 16 1.5S44 39 48 38" opacity=".45" />
    </>
  ),
  // A wok with its long handle and a few pieces tossed above it.
  wok: (
    <>
      <path d="M6 32h40c0 9-8 15-20 15S6 41 6 32Z" />
      <path d="M46 34l14-5" />
      <path d="M2 31c3 0 3 3 0 3" />
      <path d="M14 22c2-2 4-2 5 0M28 16c2-1.5 4-1 5 1M38 22c1.5-2 3.5-2 5-.5" />
      <path d="M22 26l1.5-2.5M33 24.5l-1-2.6" opacity=".6" />
      <path d="M12 38c4 2 10 3 14 3s9-.6 12-2" opacity=".45" />
    </>
  ),
  // A round clay teapot with a cup beside it.
  teapot: (
    <>
      <path className="steam" d="M16 18c-3-3 3-5 0-8M21 15c-3-3 3-5 0-8" />
      <path d="M22 24c-6 1-10 7-10 13 0 7 6 12 15 12s15-5 15-12c0-6-4-12-10-13" />
      <path d="M21 24h12M24 24c0-3 1.5-4.5 3-4.5s3 1.5 3 4.5M27 19.5v-2" />
      <path d="M12 33c-4-1-6-4-7-8M42 31c4-2 7 0 7 4s-3 7-7 7" />
      <path d="M48 46h10l-1.5 5h-7Z" />
      <path d="M12 52h34" opacity=".55" />
    </>
  ),
};

export function DishArt({ art, size = 64, className = '' }: { art: Art; size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={`dish-art ${className}`} fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {DRAWINGS[art]}
    </svg>
  );
}

/** A quiet cloud-scroll ornament for rule ends and section breaks. */
export function CloudScroll({ className = '', width = 72 }: { className?: string; width?: number }) {
  return (
    <svg viewBox="0 0 72 20" width={width} height={width * 20 / 72} className={className} fill="none" stroke="currentColor"
      strokeWidth="1.3" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M2 14h18c4 0 6-3 5-6s-5-4-7-1c-1.5 2 0 4 2 4M70 14H52c-4 0-6-3-5-6s5-4 7-1c1.5 2 0 4-2 4" />
      <path d="M30 14c0-4 2.5-7 6-7s6 3 6 7M33 14c0-2 1.3-3.5 3-3.5s3 1.5 3 3.5" />
      <path d="M26 17h20" opacity=".6" />
    </svg>
  );
}
