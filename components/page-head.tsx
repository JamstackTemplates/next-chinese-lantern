import type { ReactNode } from 'react';

/**
 * Heading block for inner pages: eyebrow, a large serif title (use <em> for the accent words) over a faint
 * Chinese watermark, and a lede.
 */
export function PageHead({ eyebrow, zh, title, children, id, before, after }: {
  eyebrow: string;
  /** Chinese watermark behind the title, e.g. "菜單". */
  zh?: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
  /** Optional content under the lede, e.g. the status and phone row. */
  after?: ReactNode;
}) {
  return (
    <header className="wrap pt-[clamp(2.25rem,5vw,4rem)] pb-[clamp(1.25rem,3vw,2.25rem)]">
      {before}
      <p className="eyebrow">{eyebrow}</p>
      <div className={zh ? 'watermark' : undefined} data-zh={zh}>
        <h1 id={id} className="mt-3 mb-4 max-w-[18ch] text-[clamp(2.5rem,6vw,4.4rem)] leading-[1]">{title}</h1>
      </div>
      {children ? <div className="max-w-(--measure) text-[clamp(1.05rem,1.5vw,1.2rem)] text-muted">{children}</div> : null}
      {after}
    </header>
  );
}

/** Section heading used across the home page: eyebrow, serif title and a faint Chinese watermark. */
export function SectionHeading({ eyebrow, zh, title, id, className = '', children }: {
  eyebrow: string;
  zh: string;
  title: ReactNode;
  id: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="watermark" data-zh={zh}>
        <h2 id={id} className="mt-2.5 text-[clamp(2rem,4.2vw,3.1rem)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}
