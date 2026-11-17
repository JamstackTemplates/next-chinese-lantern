import type { Metadata } from 'next';
import { SingleLantern } from '../components/lanterns';
import { PageHead } from '../components/page-head';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section aria-labelledby="not-found-title">
      <PageHead id="not-found-title" eyebrow="404" zh="找不到" title={<>This dish isn’t <em>on our menu…</em></>}
        before={<SingleLantern size={46} className="lantern mb-4" />}>
        <p>The link may be out of date, or the page may have moved. Here’s what we do serve:</p>
      </PageHead>
      <ul className="wrap flex flex-wrap gap-x-6 gap-y-3 text-[1.1rem]">
        <li><SiteLink href="/" className="text-link">Home</SiteLink></li>
        <li><SiteLink href="/menu/" className="text-link">The menu</SiteLink></li>
        <li><SiteLink href="/banquets/" className="text-link">Banquets</SiteLink></li>
        <li><SiteLink href="/#find-us" className="text-link">Hours &amp; directions</SiteLink></li>
        <li><SiteLink href="/contact/" className="text-link">Contact</SiteLink></li>
      </ul>
    </section>
  );
}
