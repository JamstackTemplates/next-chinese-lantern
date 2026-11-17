import type { Metadata } from 'next';
import { CallForTakeaway } from '../../components/call-for-takeaway';
import { AllergenKey } from '../../components/dish-marks';
import { MenuBook } from '../../components/menu-book';
import { OpenStatus } from '../../components/open-status';
import { PageHead } from '../../components/page-head';
import { allDishes, menu, sectionRange } from '../../content/menu';
import { restaurant } from '../../content/restaurant';
import { absoluteUrl } from '../../lib/paths';

export const metadata: Metadata = {
  title: 'Menu',
  description: `The numbered menu at ${restaurant.name}: dim sum, soups, noodles, mains, vegetables and tofu, chef’s specials, desserts and tea, with spice and allergen marks. Call for takeaway.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

export default function MenuPage() {
  const { takeaway } = restaurant;
  return (
    <>
      <PageHead eyebrow="Menu" zh="菜單" title={<>The numbered <em>menu</em></>}
        after={(
          <div className="mt-6 grid justify-items-start gap-3">
            <OpenStatus withPhone className="rounded-full border border-line bg-surface px-3.5 py-1 text-[.95rem] font-semibold shadow-card" />
            <CallForTakeaway />
            <p className="text-[.93rem] text-muted">Takeaway by phone only, ready in {takeaway.pickupWait}. {takeaway.payment}</p>
          </div>
        )}>
        <p>
          {allDishes.length} dishes, each with the number our regulars order by. Add dishes to a takeaway list as you go,
          then call and read out the numbers.
        </p>
      </PageHead>

      <nav className="wrap pb-6" aria-labelledby="sections-title">
        <h2 id="sections-title" className="sr-only">Sections</h2>
        <ol className="grid gap-x-8 border-y border-gold/70 py-3 sm:grid-cols-2 xl:grid-cols-3">
          {menu.sections.map(section => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="group flex items-baseline gap-2 py-1.5 no-underline">
                <span lang="zh-Hant" className="w-[4.6em] flex-none text-[.85rem] tracking-[.1em] text-gold-ink">{section.titleZh}</span>
                <span className="font-semibold group-hover:text-accent-ink">{section.title}</span>
                <span className="min-w-4 flex-1 border-b border-dotted border-line" aria-hidden="true" />
                <span className="text-[.92rem] text-muted">{sectionRange(section)}</span>
              </a>
            </li>
          ))}
        </ol>
        <AllergenKey note={menu.allergenNote} className="mt-5" />
      </nav>

      <MenuBook />
    </>
  );
}
