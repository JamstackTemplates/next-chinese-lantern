import { formatAddress, publicLinks, restaurant, telHref } from '../content/restaurant';
import { CloudScroll } from './dish-art';
import { HoursList } from './hours-list';
import { SiteLink } from './site-link';
import { SiteSeal } from './site-seal';
import { TimeZoneNote } from './time-zone-note';

const heading = 'mb-3 text-[.76rem] font-bold tracking-[.2em] text-gold-ink uppercase';

/** The footer sits on the paper: a gold double rule, hours by service, address, phone, links, and a closing seal. */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { phone } = restaurant.takeaway;
  return (
    <footer className="site-footer wrap mt-[clamp(3.5rem,7vw,6rem)] pb-10">
      <hr className="rule-gold" />
      <div className="grid gap-x-12 gap-y-9 pt-10 pb-8 md:grid-cols-2 xl:grid-cols-[1.1fr_1.3fr_.8fr]">
        <div>
          <p className="font-display text-[1.7rem] leading-tight font-semibold">{restaurant.name}</p>
          <p lang="zh-Hant" className="mt-0.5 text-[1.05rem] tracking-[.3em] text-gold-ink">{restaurant.nameZh}</p>
          <p className="mt-5 text-[.8rem] font-bold tracking-[.16em] text-muted uppercase">Call for takeaway</p>
          <p><a className="font-display text-[1.6rem] font-semibold whitespace-nowrap no-underline hover:text-accent-ink" href={telHref(phone)}>{phone}</a></p>
          <address className="mt-4 leading-[1.75] not-italic">
            {formatAddress()}
            {restaurant.address.note ? <><br /><span className="text-muted">{restaurant.address.note}</span></> : null}
            <br /><a className="text-link" href={`mailto:${restaurant.email}`}>{restaurant.email}</a>
          </address>
        </div>
        <div>
          <h2 className={heading}>Hours</h2>
          <HoursList compact />
          <p className="mt-2.5 text-[.85rem] text-muted">Last takeaway calls {restaurant.takeaway.lastOrdersMinutes} minutes before each service ends.</p>
          <TimeZoneNote />
        </div>
        <div>
          <h2 className={heading}>Around here</h2>
          <ul className="grid gap-1.5 font-semibold [&_a]:no-underline [&_a:hover]:text-accent-ink [&_a:hover]:underline">
            <li><SiteLink href="/menu/">The menu</SiteLink></li>
            <li><SiteLink href="/banquets/">Banquets</SiteLink></li>
            <li><SiteLink href="/#find-us">Find us</SiteLink></li>
            <li><SiteLink href="/#faq">FAQs</SiteLink></li>
            <li><SiteLink href="/contact/">Contact</SiteLink></li>
            {publicLinks.map(link => <li key={link.url}><a href={link.url} rel="me noopener">{link.label}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-dotted border-line pt-5 text-[.88rem] text-muted">
        <span>© {year} {restaurant.name}</span>
        <span className="flex items-center gap-3 text-gold">
          <CloudScroll width={56} />
          <SiteSeal size={44} />
          <CloudScroll width={56} className="-scale-x-100" />
        </span>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="no-underline hover:text-accent-ink hover:underline" href="https://jamstacks.net">jamstacks.net</a></span>
      </div>
    </footer>
  );
}
