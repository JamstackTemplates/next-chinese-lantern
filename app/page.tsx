import type { Metadata } from 'next';
import { CallForTakeaway } from '../components/call-for-takeaway';
import { BadgeMark, DietMark, SpiceMarks } from '../components/dish-marks';
import { CloudScroll, DishArt } from '../components/dish-art';
import { GoogleMap } from '../components/google-map';
import { HoursList, TodayHours } from '../components/hours-list';
import { Icon } from '../components/icons';
import { OpenStatus } from '../components/open-status';
import { SectionHeading } from '../components/page-head';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { banquets } from '../content/banquets';
import { allDishes, dishByNumber, dishId, featuredDishes, formatPrice, type Dish } from '../content/menu';
import { formatAddress, restaurant, telHref } from '../content/restaurant';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl } from '../lib/paths';
import { jsonLd, restaurantStructuredData } from '../lib/structured-data';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

const lede = 'max-w-(--measure) text-[clamp(1.03rem,1.4vw,1.15rem)] text-muted';
const ZH_NUMERALS = ['一', '二', '三', '四', '五', '六'];

/** "$7.50" or "Small $9 · Large $14". */
function priceText(dish: Dish) {
  return typeof dish.price === 'number' ? formatPrice(dish.price) : dish.price.map(o => `${o.label} ${formatPrice(o.amount)}`).join(' · ');
}

export default function HomePage() {
  const { takeaway, address } = restaurant;
  const steps = [
    { title: 'Choose by number', detail: 'Every dish on the menu has a number. Note yours down, or add them to the takeaway list.' },
    { title: `Call ${takeaway.phone}`, detail: 'Read out your numbers. We’ll confirm the price and a time.' },
    { title: 'Collect and pay', detail: `Ready in ${takeaway.pickupWait}. ${takeaway.payment}` },
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(restaurantStructuredData()) }} />

      {/* Tonight: the visitor's first question, answered first. */}
      <section id="tonight" className="wrap pt-[clamp(1.75rem,4vw,3.5rem)]" aria-labelledby="tonight-title">
        <div className="grid items-start gap-[clamp(1.75rem,4vw,3.5rem)] xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          {/* A size container, so the phone number scales with its column and never runs into the card. */}
          <div className="@container">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <p className="eyebrow">Tonight</p>
              <OpenStatus className="rounded-full border border-line bg-surface px-3.5 py-1 text-[.95rem] font-semibold shadow-card" />
            </div>
            <h1 id="tonight-title" className="mt-4 font-display text-[clamp(1.6rem,3vw,2rem)] leading-tight lg:sr-only">
              {restaurant.name} <span lang="zh-Hant" className="ml-1 text-[.8em] tracking-[.2em] text-gold-ink">{restaurant.nameZh}</span>
            </h1>
            <div className="watermark mt-5 lg:mt-7" data-zh="今晚">
              <p className="text-[.8rem] font-bold tracking-[.22em] text-accent-ink uppercase">Call for takeaway</p>
              <p className="mt-1">
                <a href={telHref()} className="font-display text-[clamp(2.5rem,13.5cqi,5.4rem)] leading-[1] font-semibold tracking-[-.02em] whitespace-nowrap no-underline hover:text-accent-ink">
                  {takeaway.phone}
                </a>
              </p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a className="button" href={telHref()}><Icon name="phone" width={18} height={18} />Call for takeaway</a>
              <SiteLink href="/menu/" className="button button-ghost">See the menu <Icon name="arrow" width={18} height={18} /></SiteLink>
            </div>
            <TodayHours className="mt-6 text-[1.02rem]"
              fallback={<a href="#find-us" className="text-link">Opening hours by service</a>} />
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[1rem] text-muted">
              <Icon name="pin" width={18} height={18} className="flex-none text-accent-ink" />
              <span>{address.street}, {address.locality}</span>
              <a className="text-link" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions</a>
            </p>
          </div>

          <aside className="menu-card p-[clamp(1.25rem,3vw,2rem)]" aria-labelledby="how-title">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Takeaway</p>
                <h2 id="how-title" className="mt-2 text-[1.6rem]">How it works</h2>
              </div>
              <DishArt art="steamer" size={76} className="-mt-2 -mr-1 flex-none" />
            </div>
            <ol className="mt-4 grid gap-4">
              {steps.map((step, i) => (
                <li key={step.title} className="grid grid-cols-[2.1rem_1fr] gap-3">
                  <span lang="zh-Hant" aria-hidden="true" className="grid size-[2.1rem] place-items-center rounded-full border border-gold text-[1.05rem] text-gold-ink">{ZH_NUMERALS[i]}</span>
                  <span>
                    <strong className="block font-semibold">{step.title}</strong>
                    <span className="block text-[.95rem] leading-snug text-muted">{step.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-dotted border-line pt-4 text-[.92rem] text-muted">
              No delivery and no online ordering: just a phone call and a short walk. Last calls {takeaway.lastOrdersMinutes} minutes before each service ends.
            </p>
          </aside>
        </div>
        {restaurant.notice ? (
          <p className="mt-7 flex items-start gap-3 border-y border-gold/60 bg-surface/60 px-4 py-3 text-[.98rem] font-semibold">
            <Icon name="clock" width={20} height={20} className="mt-0.5 flex-none text-accent-ink" />{restaurant.notice}
          </p>
        ) : null}
      </section>

      {/* Find us, directly under the answer to "are you open?" */}
      <section id="find-us" className="wrap grid gap-[clamp(1.5rem,4vw,3rem)] pt-[clamp(3rem,6vw,4.5rem)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]" aria-labelledby="find-us-title">
        <div>
          <SectionHeading eyebrow="Find us" zh="地址" id="find-us-title" title={address.street}>
            <p className="mt-2 text-[1.05rem]">{address.locality}, {address.region} {address.postalCode}</p>
            {address.note ? <p className="text-[.98rem] text-muted">{address.note}</p> : null}
          </SectionHeading>
          <p className="mt-5 flex flex-wrap gap-3">
            <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions <Icon name="arrow" width={18} height={18} /></a>
            <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
          </p>
          {restaurant.directions.length ? (
            <ul className="mt-5 grid gap-1.5 text-[.97rem] text-muted">
              {restaurant.directions.map(line => (
                <li key={line} className="relative pl-5 before:absolute before:top-[.6em] before:left-0.5 before:size-1.5 before:rotate-45 before:bg-gold">{line}</li>
              ))}
            </ul>
          ) : null}
          <h3 className="mt-8 flex items-center gap-2 text-[1.4rem]"><Icon name="clock" width={20} height={20} className="text-gold-ink" />Opening hours</h3>
          <HoursList className="mt-2" />
          <TimeZoneNote />
        </div>
        <GoogleMap className="min-h-[24rem] xl:min-h-full" />
      </section>

      {/* Chef's specials as numbered rows, not cards. */}
      <section id="specials" className="wrap grid gap-[clamp(1.5rem,4vw,3rem)] pt-[clamp(3.5rem,7vw,5.5rem)] xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.6fr)]" aria-labelledby="specials-title">
        <SectionHeading eyebrow="Chef’s specials" zh="推介" id="specials-title" title={<>Worth ordering <em>by number</em></>}>
          <p className={`mt-4 ${lede}`}>The dishes our regulars ask for by number. Tap one to find it on the menu, with everything else we cook.</p>
          <p className="mt-5"><SiteLink href="/menu/" className="text-link">The full menu · {allDishes.length} dishes</SiteLink></p>
        </SectionHeading>
        <ol className="border-t border-gold/60">
          {featuredDishes.map(({ dish, section }) => (
            <li key={dish.number} className="border-b border-dotted border-line">
              <SiteLink href={`/menu/#${dishId(dish.number)}`} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 px-1 py-4 no-underline hover:bg-surface/70 sm:grid-cols-[3.5rem_auto_minmax(0,1fr)_auto]">
                <DishArt art={section.art} size={56} className="max-sm:hidden" />
                <span className="seal seal-lg mt-0.5">{dish.number}</span>
                <span className="min-w-0">
                  <span lang="zh-Hant" className="block text-[.95rem] tracking-[.12em] text-gold-ink">{dish.nameZh}</span>
                  <span className="block font-display text-[1.35rem] leading-tight font-semibold group-hover:text-accent-ink">{dish.name}</span>
                  <span className="mt-1 block text-[.95rem] leading-snug text-muted">{dish.description}</span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-2">
                    {dish.badge ? <BadgeMark badge={dish.badge} /> : null}
                    {dish.diet ? <DietMark diet={dish.diet} /> : null}
                    <SpiceMarks level={dish.spice} />
                  </span>
                </span>
                <span className="pt-5 text-right font-semibold whitespace-nowrap">{priceText(dish)}</span>
              </SiteLink>
            </li>
          ))}
        </ol>
      </section>

      {/* Weekend dim sum */}
      <section id="dim-sum" className="wrap pt-[clamp(3.5rem,7vw,5.5rem)]" aria-labelledby="dim-sum-title">
        <div className="menu-card grid items-center gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-5 p-[clamp(1.4rem,4vw,3rem)] md:grid-cols-[auto_minmax(0,1fr)]">
          <DishArt art="steamer" size={170} className="mx-auto max-md:size-28" />
          <div>
            <SectionHeading eyebrow="Saturday & Sunday" zh="點心" id="dim-sum-title" title={restaurant.dimSum.title} />
            <p className={`mt-4 ${lede}`}>{restaurant.dimSum.text}</p>
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-3" aria-label="Dim sum favourites">
              {restaurant.dimSum.favourites.map(number => {
                const dish = dishByNumber(number);
                return dish ? (
                  <li key={number}>
                    <SiteLink href={`/menu/#${dishId(number)}`} className="inline-flex items-center gap-2 font-semibold no-underline hover:text-accent-ink">
                      <span className="seal seal-sm">{number}</span>{dish.name}
                    </SiteLink>
                  </li>
                ) : null;
              })}
            </ul>
            <p className="mt-5"><SiteLink href="/menu/#dim-sum" className="text-link">All dim sum</SiteLink></p>
          </div>
        </div>
      </section>

      {/* Banquets teaser: a compact printed list, not cards. */}
      <section id="banquets" className="wrap grid gap-[clamp(1.5rem,4vw,3rem)] pt-[clamp(3.5rem,7vw,5.5rem)] xl:grid-cols-[minmax(0,.8fr)_minmax(0,1.6fr)]" aria-labelledby="banquets-title">
        <SectionHeading eyebrow="Banquets" zh="宴會" id="banquets-title" title={<>Set menus for <em>celebrations</em></>}>
          <p className={`mt-4 ${lede}`}>Birthdays, weddings and family nights round a big table. Send us a note and we’ll work out the menu together.</p>
          <p className="mt-5 flex flex-wrap gap-3">
            <SiteLink href="/banquets/" className="button button-ghost">The banquet menus <Icon name="arrow" width={18} height={18} /></SiteLink>
          </p>
        </SectionHeading>
        <ul className="border-t border-gold/60">
          {banquets.map(banquet => (
            <li key={banquet.id} className="border-b border-dotted border-line">
              <SiteLink href={`/banquets/#${banquet.id}`} className="group grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 px-1 py-4 no-underline hover:bg-surface/70">
                <span>
                  <span lang="zh-Hant" className="mr-3 text-[1.05rem] tracking-[.14em] text-gold-ink">{banquet.nameZh}</span>
                  <span className="font-display text-[1.35rem] font-semibold group-hover:text-accent-ink">{banquet.name}</span>
                  <span className="block text-[.95rem] text-muted">
                    From {banquet.minGuests} guests · {banquet.courses.length} courses · {banquet.noticeDays} {banquet.noticeDays === 1 ? 'day’s' : 'days’'} notice
                  </span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-[1.4rem] font-semibold">{formatPrice(banquet.pricePerPerson)}</span>
                  <span className="block text-[.82rem] text-muted">per person</span>
                </span>
              </SiteLink>
            </li>
          ))}
        </ul>
      </section>

      {/* Our story */}
      <section id="story" className="wrap pt-[clamp(3.5rem,7vw,5.5rem)]" aria-labelledby="story-title">
        <div className="flex justify-center text-gold"><CloudScroll width={120} /></div>
        <div className="mt-8 grid gap-[clamp(1.5rem,4vw,3.5rem)] xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div>
            <SectionHeading eyebrow="Our story" zh="家" id="story-title" title={<>Three generations, <em>one window table</em></>} />
            {restaurant.story.map(paragraph => <p key={paragraph} className={`mt-4 ${lede}`}>{paragraph}</p>)}
          </div>
          <ol className="grid content-start gap-5 xl:pt-10">
            {restaurant.storyPoints.map((point, i) => (
              <li key={point.title} className="grid grid-cols-[2.6rem_1fr] gap-4">
                <span lang="zh-Hant" aria-hidden="true" className="grid size-[2.6rem] place-items-center rounded-full border border-gold text-[1.2rem] text-gold-ink">{ZH_NUMERALS[i]}</span>
                <span>
                  <strong className="block font-display text-[1.25rem] font-semibold">{point.title}</strong>
                  <span className="block text-[.97rem] leading-snug text-muted">{point.detail}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {restaurant.faqs.length ? (
        <section id="faq" className="wrap pt-[clamp(3.5rem,7vw,5.5rem)]" aria-labelledby="faq-title">
          <SectionHeading eyebrow="FAQs" zh="問答" id="faq-title" title="Good to know" />
          <div className="mt-6 grid max-w-[54rem] border-t border-gold/60">
            {restaurant.faqs.map(faq => (
              <details key={faq.question} className="faq border-b border-dotted border-line">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-1 py-4 font-display text-[1.2rem] font-semibold">{faq.question}</summary>
                <p className="max-w-(--measure) px-1 pb-5 text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="mt-6 text-muted">
            Something else? Call <a className="text-link" href={telHref()}>{takeaway.phone}</a> or{' '}
            <SiteLink href="/contact/" className="text-link">send us a message</SiteLink>.
          </p>
          <CallForTakeaway className="mt-6 lg:hidden" />
        </section>
      ) : null}
    </>
  );
}
