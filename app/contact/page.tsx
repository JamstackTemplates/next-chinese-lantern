import type { Metadata } from 'next';
import { CopyEmail } from '../../components/copy-email';
import { DishArt } from '../../components/dish-art';
import { Icon } from '../../components/icons';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { restaurant, telHref } from '../../content/restaurant';
import { absoluteUrl } from '../../lib/paths';
import { site } from '../../lib/site';

export const metadata: Metadata = {
  title: 'Banquets, group dining & takeaway questions',
  description: `Enquiries about banquets, group dining and takeaway at ${restaurant.name}. Tonight’s takeaway orders are by phone.`,
  alternates: { canonical: absoluteUrl('/contact/') },
};

const subhead = 'mb-1 text-[1.3rem]';
const tips = ['The date and time', 'How many guests', 'Which banquet, if any', 'Any allergies'];

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  const { phone } = restaurant.takeaway;
  return (
    <>
      <PageHead eyebrow="Contact" zh="聯絡" title={<>Banquets, group dining <em>&amp; takeaway questions</em></>}>
        <p>
          Planning a birthday banquet, bringing a big group for dim sum, or have a question about takeaway? Send us a
          message and someone from the family will reply, usually within a day. It’s an enquiry: nothing is booked until
          we’ve replied to confirm.
        </p>
      </PageHead>

      <div className="wrap">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y border-gold/70 bg-surface/70 px-4 py-3.5 text-[1rem]">
          <Icon name="phone" width={18} height={18} className="flex-none text-accent-ink" />
          <span><strong>Ordering takeaway for tonight?</strong> Takeaway orders are by phone only: call{' '}
            <a className="text-link whitespace-nowrap" href={telHref(phone)}>{phone}</a>.</span>
        </p>
      </div>

      <div className="wrap grid items-start gap-[clamp(1.5rem,5vw,4rem)] pt-[clamp(2rem,4vw,3rem)] xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="print:hidden" aria-label="Enquiry form">
          {hosted ? (
            <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={restaurant.email} />
          ) : (
            <div className="menu-card grid justify-items-start gap-4 p-[clamp(1.5rem,4vw,2.75rem)]">
              <DishArt art="teapot" size={84} />
              <h2 className="text-[clamp(1.8rem,3vw,2.3rem)]">Write to us directly</h2>
              <p className="max-w-[34rem] text-muted">
                Email is the best way to reach us about banquets and large groups. Tell us what you’re planning and we’ll
                reply with what we can do. It’s an enquiry, not a booking, until we confirm.
              </p>
              <p><a className="button" href={`mailto:${restaurant.email}?subject=${encodeURIComponent('Banquet or group enquiry')}`}>Email {restaurant.name}</a></p>
            </div>
          )}
        </section>

        <aside className="grid gap-1.5 pt-1" aria-labelledby="direct-title">
          <h2 id="direct-title" className={subhead}>Email</h2>
          <p className="font-display text-[1.35rem] wrap-anywhere"><a className="text-link" href={`mailto:${restaurant.email}`}>{restaurant.email}</a></p>
          <p className="flex min-h-px flex-wrap items-center gap-x-4 gap-y-2"><CopyEmail email={restaurant.email} /></p>

          <h2 className={`mt-5 ${subhead}`}>Phone</h2>
          <p><a className="font-display text-[1.35rem] no-underline hover:text-accent-ink" href={telHref(phone)}>{phone}</a></p>
          <p className="text-[.92rem] text-muted">For tonight’s takeaway orders and quick questions during opening hours.</p>

          <h2 className={`mt-5 ${subhead}`}>Useful to include</h2>
          <ul className="grid gap-2 text-muted">
            {tips.map(tip => (
              <li key={tip} className="relative pl-5 before:absolute before:top-[.6em] before:left-0.5 before:size-1.5 before:rotate-45 before:bg-gold">{tip}</li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
}
