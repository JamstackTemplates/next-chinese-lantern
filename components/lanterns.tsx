import { useId } from 'react';

/**
 * One red lantern with gold caps and a tassel, drawn in a 60×110 box from its hanging point (30, 0).
 * In dark mode (--glow-opacity: 1) it lights up from inside and casts a warm halo.
 */
function Lantern({ id, x, drop, scale = 1 }: { id: string; x: number; drop: number; scale?: number }) {
  return (
    <g className="lantern" transform={`translate(${x - 30 * scale} 0) scale(${scale})`}>
      <path d={`M30 0V${drop + 14}`} stroke="var(--lantern-cord)" strokeWidth={1.4 / scale} />
      <g transform={`translate(0 ${drop})`}>
        <circle className="lantern-glow" cx="30" cy="46" r="44" fill={`url(#${id}-halo)`} />
        <rect x="21" y="13" width="18" height="7" rx="1.5" fill="var(--lantern-cap)" />
        <ellipse cx="30" cy="46" rx="25" ry="27" fill="var(--lantern)" />
        <ellipse className="lantern-light" cx="30" cy="46" rx="22" ry="24" fill={`url(#${id}-light)`} />
        <g fill="none" stroke="var(--lantern-shade)" strokeWidth="1.6" opacity=".9">
          <ellipse cx="30" cy="46" rx="16" ry="27" />
          <ellipse cx="30" cy="46" rx="7" ry="27" />
        </g>
        <path d="M14 30c-3 9-3 23 1 32" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".22" />
        <g stroke="var(--lantern-cap)" strokeWidth="1.2" opacity=".9">
          <path d="M8 46h44" />
        </g>
        <rect x="21" y="72" width="18" height="6" rx="1.5" fill="var(--lantern-cap)" />
        <circle cx="30" cy="82" r="2.6" fill="var(--lantern-cap)" />
        <g stroke="var(--lantern-cap)" strokeWidth="1.3" strokeLinecap="round">
          <path d="M30 84v22M27.5 84.5l-1.3 20M32.5 84.5l1.3 20M25.5 84l-3 17M34.5 84l3 17" />
        </g>
      </g>
    </g>
  );
}

/**
 * A short string of lanterns hanging from a sagging cord, for the top of the signboard.
 * Decorative only. They sway gently, and stop under prefers-reduced-motion.
 */
export function LanternString({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="0 0 264 176" className={`block w-full overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="var(--lantern-glow)" stopOpacity=".65" />
          <stop offset=".55" stopColor="var(--lantern-glow)" stopOpacity=".18" />
          <stop offset="1" stopColor="var(--lantern-glow)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-light`} cx=".45" cy=".45">
          <stop offset="0" stopColor="#fff2b8" stopOpacity=".95" />
          <stop offset=".5" stopColor="#ffb25a" stopOpacity=".55" />
          <stop offset="1" stopColor="var(--lantern)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M-4 4Q132 30 268 4" fill="none" stroke="var(--lantern-cord)" strokeWidth="1.5" />
      <g>
        <Lantern id={id} x={44} drop={12} scale={0.82} />
        <Lantern id={id} x={132} drop={20} scale={1} />
        <Lantern id={id} x={220} drop={8} scale={0.82} />
      </g>
    </svg>
  );
}

/** A single small lantern, e.g. for the 404 page and the mobile sign bar. */
export function SingleLantern({ size = 40, className = '' }: { size?: number; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="-14 -4 88 130" width={size} height={size * 130 / 88} className={`overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0" stopColor="var(--lantern-glow)" stopOpacity=".65" />
          <stop offset="1" stopColor="var(--lantern-glow)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-light`} cx=".45" cy=".45">
          <stop offset="0" stopColor="#fff2b8" stopOpacity=".95" />
          <stop offset="1" stopColor="var(--lantern)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g><Lantern id={id} x={30} drop={4} /></g>
    </svg>
  );
}
