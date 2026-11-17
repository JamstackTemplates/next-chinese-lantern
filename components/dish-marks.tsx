import type { ReactNode } from 'react';
import { ALLERGENS, BADGES, DIETS, type Allergen, type Badge, type Diet } from '../content/menu';

/** One small chilli. */
function Chilli() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" focusable="false">
      <path d="M10.6 3.2c.8-.9 1.8-1.4 2.6-1.2" fill="none" stroke="var(--jade)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M11.4 4.1c1.5 1.6.9 4.7-1.8 7.2C7.1 13.6 3.4 14.6 1.8 13.8c2.6-.7 4.6-2.6 5.8-4.8.9-1.7 1.4-3.6 2.2-4.6.5-.4 1.1-.6 1.6-.3Z" fill="var(--accent-ink)" />
    </svg>
  );
}

/** Spice marks: 0–3 chillies. Nothing is shown for 0. */
export function SpiceMarks({ level, className = '' }: { level: number; className?: string }) {
  if (!level) return null;
  const label = `Spice ${level} of 3`;
  return (
    <span className={`inline-flex items-center ${className}`} title={label} role="img" aria-label={label}>
      {Array.from({ length: level }, (_, i) => <Chilli key={i} />)}
    </span>
  );
}

/** Glyphs for each allergen, drawn in a 16×16 box with currentColor. */
const ALLERGEN_GLYPHS: Record<Allergen, ReactNode> = {
  // Peanut: a waisted shell.
  peanut: <path d="M8 1.8c2 0 3.3 1.4 3.3 3.2 0 1.2-.8 1.8-.8 3s.8 1.8.8 3c0 1.8-1.3 3.2-3.3 3.2S4.7 12.8 4.7 11c0-1.2.8-1.8.8-3s-.8-1.8-.8-3C4.7 3.2 6 1.8 8 1.8Z" fill="none" stroke="currentColor" strokeWidth="1.3" />,
  // Tree nut: an acorn.
  'tree-nut': <><path d="M3 7c0-2.4 2.2-3.8 5-3.8S13 4.6 13 7Z" fill="currentColor" /><path d="M4 7.5h8c0 3.6-1.8 6.3-4 6.8-2.2-.5-4-3.2-4-6.8Z" fill="none" stroke="currentColor" strokeWidth="1.3" /><path d="M8 3.2V1.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></>,
  // Shellfish: a curled shrimp.
  shellfish: <><path d="M12.8 6.2A5 5 0 1 0 8 13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M8 13l-2.4 1.6M8 13l.6 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><path d="M12.8 6.2l2-2.8M12.6 6l2.6-.6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" /></>,
  // Fish
  fish: <><path d="M1.8 8c2-3 5.6-4 8.6-2.2L14 3.6v8.8l-3.6-2.2C7.4 12 3.8 11 1.8 8Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="5" cy="7.4" r=".9" fill="currentColor" /></>,
  // Sesame: three seeds.
  sesame: <g fill="currentColor"><ellipse cx="5" cy="9" rx="1.5" ry="2.6" transform="rotate(-25 5 9)" /><ellipse cx="10.5" cy="5.5" rx="1.5" ry="2.6" transform="rotate(30 10.5 5.5)" /><ellipse cx="10.5" cy="11.6" rx="1.4" ry="2.4" transform="rotate(75 10.5 11.6)" /></g>,
  // Soy: a bean pod.
  soy: <><path d="M2.5 12.5C5 13.5 13 9 13.5 3.5 9 3 3 8 2.5 12.5Z" fill="none" stroke="currentColor" strokeWidth="1.3" /><g fill="currentColor"><circle cx="5.6" cy="10.2" r="1.1" /><circle cx="8.2" cy="8" r="1.1" /><circle cx="10.7" cy="5.8" r="1.1" /></g></>,
  // Gluten: an ear of wheat.
  gluten: <><path d="M8 15V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><g fill="currentColor"><ellipse cx="8" cy="3" rx="1.1" ry="1.9" /><ellipse cx="6.1" cy="6" rx="1" ry="1.8" transform="rotate(-35 6.1 6)" /><ellipse cx="9.9" cy="6" rx="1" ry="1.8" transform="rotate(35 9.9 6)" /><ellipse cx="6.1" cy="9.3" rx="1" ry="1.8" transform="rotate(-35 6.1 9.3)" /><ellipse cx="9.9" cy="9.3" rx="1" ry="1.8" transform="rotate(35 9.9 9.3)" /></g></>,
  // Egg
  egg: <path d="M8 1.8c2.6 0 4.6 4 4.6 7.2A4.6 4.6 0 0 1 3.4 9C3.4 5.8 5.4 1.8 8 1.8Z" fill="none" stroke="currentColor" strokeWidth="1.4" />,
};

/** A labelled allergen glyph. The label is in the tooltip and read by screen readers. */
export function AllergenMark({ allergen }: { allergen: Allergen }) {
  const label = `Contains ${ALLERGENS[allergen].label.toLowerCase()}`;
  return (
    <span className="allergen" title={label} role="img" aria-label={label}>
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">{ALLERGEN_GLYPHS[allergen]}</svg>
    </span>
  );
}

export function AllergenMarks({ allergens }: { allergens: readonly Allergen[] }) {
  if (!allergens.length) return null;
  return <span className="inline-flex flex-wrap items-center gap-1">{allergens.map(a => <AllergenMark key={a} allergen={a} />)}</span>;
}

export function DietMark({ diet }: { diet: Diet }) {
  return <abbr className="mark mark-diet" title={DIETS[diet].label}>{DIETS[diet].short}</abbr>;
}

/** Badge beside a dish name. "Chef's choice" is a small red seal; the others are ruled text marks. */
export function BadgeMark({ badge }: { badge: Badge }) {
  if (badge === 'chef') return <ChefSeal />;
  return <span className={`mark mark-${badge}`}>{BADGES[badge]}</span>;
}

/** The "chef's choice" seal: 主廚推介 in a red square, with the English beside it for everyone else. */
export function ChefSeal({ withLabel = true }: { withLabel?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[.72rem] font-bold tracking-[.08em] text-accent-ink uppercase">
      <svg viewBox="0 0 40 40" width="22" height="22" aria-hidden="true" focusable="false" className="flex-none">
        <rect x="1.5" y="1.5" width="37" height="37" rx="3" fill="var(--seal)" />
        <rect x="4" y="4" width="32" height="32" rx="1.5" fill="none" stroke="var(--seal-ink)" strokeWidth="1.2" opacity=".85" />
        <text x="20" y="19" textAnchor="middle" fontSize="12" fill="var(--seal-ink)" fontFamily="var(--font-zh)" fontWeight="600">主廚</text>
        <text x="20" y="32" textAnchor="middle" fontSize="12" fill="var(--seal-ink)" fontFamily="var(--font-zh)" fontWeight="600">推介</text>
      </svg>
      {withLabel ? BADGES.chef : <span className="sr-only">{BADGES.chef}</span>}
    </span>
  );
}

/** The allergen key shown at the top and bottom of the menu. */
export function AllergenKey({ note, className = '' }: { note: string; className?: string }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      <ul className="flex flex-wrap gap-x-4 gap-y-2 text-[.88rem] text-muted" aria-label="Allergen key">
        {(Object.keys(ALLERGENS) as Allergen[]).map(allergen => (
          <li key={allergen} className="inline-flex items-center gap-1.5">
            <AllergenMark allergen={allergen} />{ALLERGENS[allergen].label}
          </li>
        ))}
        <li className="inline-flex items-center gap-1.5"><DietMark diet="vegetarian" />Vegetarian</li>
        <li className="inline-flex items-center gap-1.5"><DietMark diet="vegan" />Vegan</li>
        <li className="inline-flex items-center gap-1.5"><SpiceMarks level={1} />Spice, up to three</li>
      </ul>
      <p className="max-w-(--measure) text-[.9rem] text-muted">{note}</p>
    </div>
  );
}
