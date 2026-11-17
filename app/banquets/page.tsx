import type { Metadata } from 'next';
import { CloudScroll } from '../../components/dish-art';
import { Icon } from '../../components/icons';
import { PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { banquets, howItWorks, isMenuCourse } from '../../content/banquets';
import { dishByNumber, dishId, formatPrice } from '../../content/menu';
import { restaurant, telHref } from '../../content/restaurant';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Banquets',
  description: `Banquet set menus at ${restaurant.name} for birthdays, celebrations and family dinners: courses, guests, price per person and notice needed.`,
  alternates: { canonical: absoluteUrl('/banquets/') },
};

const ZH_NUMERALS = ['一', '二', '三', '四', '五'];

export default function BanquetsPage() {
  return (
    <>
      <PageHead eyebrow="Banquets" zh="宴會" title={<>Set menus for <em>the big table</em></>}>
        <p>
          Round tables, a lazy Susan and course after course. Choose a set menu below, then send us a note with your
          date and numbers. It’s an enquiry: nothing is booked until we reply to confirm.
        </p>
      </PageHead>

      <div className="wrap grid gap-8">
        {banquets.map(banquet => (
          <article key={banquet.id} id={banquet.id} aria-labelledby={`${banquet.id}-title`}
            className="menu-card grid overflow-hidden md:grid-cols-[8.5rem_minmax(0,1fr)]">
            <div className="lacquer on-lacquer flex items-center justify-center gap-4 px-5 py-4 md:flex-col md:py-8">
              <span lang="zh-Hant" className="gold-lettering text-[1.7rem] leading-[1.2] tracking-[.18em] md:vertical md:text-[2.1rem]">{banquet.nameZh}</span>
            </div>
            <div className="p-[clamp(1.25rem,3.5vw,2.5rem)]">
              <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-3">
                <div className="max-w-[36rem]">
                  <h2 id={`${banquet.id}-title`} className="text-[clamp(1.8rem,3.4vw,2.4rem)]">{banquet.name}</h2>
                  <p className="mt-2 text-muted">{banquet.description}</p>
                </div>
                <p className="sm:text-right">
                  <span className="block font-display text-[2.2rem] leading-none font-semibold">{formatPrice(banquet.pricePerPerson)}</span>
                  <span className="text-[.88rem] text-muted">per person</span>
                </p>
              </div>
              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-y border-dotted border-line py-3 text-[.95rem]">
                <div className="flex gap-2"><dt className="text-muted">Guests</dt><dd className="font-semibold">{banquet.minGuests} or more</dd></div>
                <div className="flex gap-2"><dt className="text-muted">Courses</dt><dd className="font-semibold">{banquet.courses.length}</dd></div>
                <div className="flex gap-2"><dt className="text-muted">Notice</dt><dd className="font-semibold">{banquet.noticeDays} {banquet.noticeDays === 1 ? 'day' : 'days'}</dd></div>
              </dl>
              <ol className="mt-4 gap-x-10 md:columns-2">
                {banquet.courses.map((course, i) => {
                  const dish = isMenuCourse(course) ? dishByNumber(course) : undefined;
                  const name = dish?.name ?? (isMenuCourse(course) ? `Dish ${course}` : course.name);
                  const nameZh = dish?.nameZh ?? (isMenuCourse(course) ? '' : course.nameZh);
                  return (
                    <li key={i} className="flex break-inside-avoid items-start gap-3 py-2">
                      {isMenuCourse(course)
                        ? <span className="seal seal-sm mt-0.5" title={`Menu number ${course}`}>{course}</span>
                        : <span className="mt-0.5 grid size-7 flex-none place-items-center text-gold" title="Banquet only" aria-hidden="true"><span className="size-2.5 rotate-45 border border-current" /></span>}
                      <span className="min-w-0">
                        {nameZh ? <span lang="zh-Hant" className="block text-[.88rem] tracking-[.12em] text-gold-ink">{nameZh}</span> : null}
                        {isMenuCourse(course)
                          ? <SiteLink href={`/menu/#${dishId(course)}`} className="font-semibold no-underline hover:text-accent-ink hover:underline">{name}</SiteLink>
                          : <span className="font-semibold">{name} <span className="text-[.8rem] font-normal text-muted">· banquet only</span></span>}
                      </span>
                    </li>
                  );
                })}
              </ol>
              <p className="mt-5">
                <SiteLink href="/contact/" className="button button-ghost">Enquire about the {banquet.name.toLowerCase()} <Icon name="arrow" width={18} height={18} /></SiteLink>
              </p>
            </div>
          </article>
        ))}
      </div>

      <section className="wrap pt-[clamp(3.5rem,7vw,5rem)]" aria-labelledby="how-title">
        <div className="flex justify-center text-gold"><CloudScroll width={120} /></div>
        <p className="eyebrow mt-8">How banquets work</p>
        <h2 id="how-title" className="mt-2.5 text-[clamp(2rem,4.2vw,3rem)]">Three steps to a full table</h2>
        <ol className="mt-7 grid gap-6 md:grid-cols-3">
          {howItWorks.map((step, i) => (
            <li key={step.title} className="border-t border-gold/70 pt-4">
              <span lang="zh-Hant" aria-hidden="true" className="grid size-[2.6rem] place-items-center rounded-full border border-gold text-[1.2rem] text-gold-ink">{ZH_NUMERALS[i]}</span>
              <h3 className="mt-3 text-[1.35rem]">{step.title}</h3>
              <p className="mt-1.5 text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>
        <div className="menu-card mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 p-[clamp(1.25rem,3.5vw,2.25rem)]">
          <div className="max-w-[38rem]">
            <h2 className="text-[clamp(1.6rem,3vw,2.1rem)]">Planning a banquet?</h2>
            <p className="mt-2 text-muted">
              Send us an enquiry with the date, time, number of guests and the banquet you like. Nothing is booked until we
              reply to confirm. In a hurry? Call <a className="text-link whitespace-nowrap" href={telHref()}>{restaurant.phone}</a> during opening hours.
            </p>
          </div>
          <SiteLink href="/contact/" className="button">Send an enquiry <Icon name="arrow" width={18} height={18} /></SiteLink>
        </div>
      </section>
    </>
  );
}
