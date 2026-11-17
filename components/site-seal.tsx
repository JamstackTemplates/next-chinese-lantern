import { restaurant } from '../content/restaurant';

/**
 * The restaurant's small seal mark: its `sealZh` characters in a lacquer-red square with a gold frame.
 * Used in the phone sign bar and to close the footer. Decorative; the name is always written beside it.
 */
export function SiteSeal({ size = 40, className = '' }: { size?: number; className?: string }) {
  const chars = [...restaurant.sealZh];
  // Two characters stack vertically; four make a 2×2 block, read right column first.
  const positions = chars.length === 1 ? [[20, 27]] : chars.length === 2 ? [[20, 18], [20, 34]]
    : chars.length === 3 ? [[20, 14], [20, 25], [20, 36]] : [[28, 18], [28, 34], [12, 18], [12, 34]];
  const fontSize = chars.length === 1 ? 20 : chars.length === 2 ? 13 : chars.length === 3 ? 9.5 : 12;
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className={`flex-none ${className}`} aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="38" height="38" rx="3" fill="var(--seal)" stroke="var(--rail-gold)" strokeWidth="1.2" />
      <rect x="4" y="4" width="32" height="32" rx="1.5" fill="none" stroke="var(--seal-ink)" strokeWidth="1" opacity=".75" />
      {chars.slice(0, 4).map((char, i) => (
        <text key={i} x={positions[i][0]} y={positions[i][1]} textAnchor="middle" fontSize={fontSize} fill="var(--seal-ink)"
          fontFamily="var(--font-zh)" fontWeight="600">{char}</text>
      ))}
    </svg>
  );
}
