import { DarkModeToggle } from 'jamstacks';
import { restaurant, telHref } from '../content/restaurant';
import { Icon } from './icons';
import { LanternString } from './lanterns';
import { OpenStatus } from './open-status';
import { SiteLink } from './site-link';
import { SiteSeal } from './site-seal';

/** Three destinations at most. "Find us" is reached from the Tonight block and the footer. */
const navigation = [
  { href: '/menu/', label: 'Menu', zh: '菜單' },
  { href: '/banquets/', label: 'Banquets', zh: '宴會' },
  { href: '/contact/', label: 'Contact', zh: '聯絡' },
];

/**
 * The lacquered signboard: a tall red rail down the left of the page on desktop, carrying the name in
 * vertical gold lettering, a string of lanterns, the open-now status, the phone number, the navigation and
 * the theme toggle. It replaces the usual header and hero.
 */
export function SignRail() {
  const { phone } = restaurant.takeaway;
  return (
    <aside className="sign-rail lacquer leaf-edge-r on-lacquer scrollbar-none sticky top-0 z-40 hidden h-dvh w-(--rail-w) flex-col overflow-y-auto pr-[5px] lg:flex"
      aria-label="Signboard">
      <LanternString className="pointer-events-none -mb-3 px-2" />

      <SiteLink href="/" className="group mx-auto grid justify-items-center gap-3 px-5 text-center no-underline">
        <span className="sign-board rounded-[3px] px-3.5 py-4 transition-transform group-hover:-translate-y-0.5">
          <span lang="zh-Hant" className="vertical gold-lettering block text-[clamp(1.7rem,4.4vh,2.7rem)] leading-[1.15] tracking-[.14em]">
            {restaurant.nameZh}
          </span>
        </span>
        <span className="font-display text-[1.3rem] leading-[1.1] font-semibold text-rail-ink">{restaurant.name}</span>
      </SiteLink>
      <p className="mx-auto mt-1.5 max-w-[13rem] px-4 text-center text-[.74rem] font-semibold tracking-[.16em] text-rail-gold uppercase">
        {restaurant.tagline}
      </p>

      <nav aria-label="Main" className="mt-5 px-6 print:hidden">
        <ul className="grid border-t border-rail-line">
          {navigation.map(item => (
            <li key={item.href} className="border-b border-rail-line">
              <SiteLink href={item.href} markCurrent="section"
                className="group/nav flex items-baseline justify-between gap-3 py-2 text-[1.05rem] font-semibold text-rail-ink no-underline transition-colors hover:text-rail-gold aria-[current]:text-rail-gold">
                <span className="inline-flex items-center gap-2 before:size-1.5 before:rotate-45 before:bg-current before:opacity-0 group-aria-[current]/nav:before:opacity-100">
                  {item.label}
                </span>
                <span lang="zh-Hant" className="text-[.85rem] text-rail-gold opacity-80">{item.zh}</span>
              </SiteLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto grid gap-2.5 px-6 pt-6 pb-5">
        <OpenStatus className="text-[.9rem] leading-snug font-semibold text-rail-ink" />
        <a href={telHref(phone)} className="font-display text-[1.65rem] leading-none font-semibold whitespace-nowrap text-rail-ink no-underline hover:text-rail-gold">
          {phone}
        </a>
        <a href={telHref(phone)} className="button button-leaf button-sm w-full"><Icon name="phone" width={17} height={17} />Call for takeaway</a>
        <div className="mt-1 flex items-center justify-between text-[.8rem] text-rail-gold print:hidden">
          <SiteLink href="/#find-us" className="no-underline hover:underline">Find us</SiteLink>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </aside>
  );
}

/** On phones and tablets the signboard becomes a compact horizontal sign bar across the top, on one line. */
export function SignBar() {
  const { phone } = restaurant.takeaway;
  return (
    <header className="sign-bar lacquer leaf-edge-b sticky top-0 z-50 lg:hidden">
      <div className="flex h-(--bar-h) items-center justify-between gap-1.5 px-3 pb-[3px] sm:gap-3 sm:px-5">
        <SiteLink href="/" className="inline-flex min-w-0 items-center gap-2 text-rail-ink no-underline">
          <SiteSeal size={34} className="max-[26rem]:hidden" />
          <span className="max-w-[7.4rem] font-display text-[.84rem] leading-[1.1] font-semibold max-[22.5rem]:sr-only sm:max-w-none sm:text-[1.15rem]">
            {restaurant.name}
          </span>
        </SiteLink>
        <div className="flex items-center gap-0.5 sm:gap-2 print:hidden">
          <nav aria-label="Main">
            <ul className="flex">
              {navigation.map(item => (
                <li key={item.href}>
                  <SiteLink href={item.href} markCurrent="section"
                    className="inline-block rounded-ui px-[5px] py-1.5 text-[.92rem] font-semibold text-rail-ink no-underline hover:text-rail-gold aria-[current]:text-rail-gold aria-[current]:underline aria-[current]:decoration-rail-gold aria-[current]:underline-offset-[.35em] sm:px-2.5">
                    {item.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </nav>
          <a className="button button-leaf grid size-9 min-h-0 place-items-center p-0 sm:size-auto sm:min-h-10 sm:px-3" href={telHref(phone)} aria-label={`Call for takeaway: ${phone}`}>
            <Icon name="phone" width={17} height={17} />
            <span className="max-sm:sr-only">{phone}</span>
          </a>
          <DarkModeToggle className="flex-none" />
        </div>
      </div>
    </header>
  );
}
