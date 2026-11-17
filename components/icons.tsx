import type { SVGProps } from 'react';

const paths = {
  phone: 'M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 4.9 4.9l1.5-2.3L19 13.5V17a2 2 0 0 1-2 2A15 15 0 0 1 3 5a2 2 0 0 1 2-2Z',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  arrow: 'M5 12h13m-5-5 5 5-5 5',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  copy: 'M9 9h10v10H9zM5 15V5h10',
  clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  filter: 'M4 5h16l-6 7.5V19l-4-2v-4.5Z',
  print: 'M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z',
  check: 'M5 12.5 10 17l9-10',
} as const;

export type IconName = keyof typeof paths;

/** Simple line icons drawn with currentColor. Decorative unless given a `title`. */
export function Icon({ name, title, ...props }: SVGProps<SVGSVGElement> & { name: IconName; title?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden={title ? undefined : true} role={title ? 'img' : undefined} focusable="false" {...props}>
      {title ? <title>{title}</title> : null}
      <path d={paths[name]} />
    </svg>
  );
}
