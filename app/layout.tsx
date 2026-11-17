import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
import '@fontsource-variable/noto-serif-display/wght.css';
import '@fontsource-variable/noto-serif-display/wght-italic.css';
import '@fontsource-variable/source-sans-3';
// One weight of Noto Serif TC, split by Fontsource into small unicode-range files: a page downloads only
// the files holding the characters it actually uses.
import '@fontsource/noto-serif-tc/600.css';
import { SignBar, SignRail } from '../components/signboard';
import { SiteFooter } from '../components/site-footer';
import { restaurant } from '../content/restaurant';
import { site } from '../lib/site';
import './tailwind.input.css';

// Absolute URLs only when the deployed URL is known at build time. Never fall back to localhost.
const socialImage = site.url ? [{ url: `${site.url}/og.png`, width: 1200, height: 630, alt: `${restaurant.name}: ${restaurant.tagline}` }] : undefined;
const description = site.description || restaurant.introduction;
const title = `${restaurant.name} · Cantonese restaurant & takeaway`;

export const metadata: Metadata = {
  title: { default: title, template: `%s · ${restaurant.name}` },
  description,
  applicationName: site.name,
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
  openGraph: {
    type: 'website',
    siteName: site.name,
    title,
    description,
    ...(site.url ? { url: `${site.url}/` } : {}),
    images: socialImage,
  },
  twitter: { card: socialImage ? 'summary_large_image' : 'summary' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#a3161a' },
    { media: '(prefers-color-scheme: dark)', color: '#3b0a0d' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><ThemeScript /></head>
      <body>
        <ThemeProvider>
          <a className="absolute -top-16 left-4 z-[200] rounded-ui bg-ink px-4 py-2.5 font-semibold text-bg no-underline focus:top-4" href="#main">Skip to content</a>
          <div className="lantern-spill max-lg:hidden" aria-hidden="true" />
          <div className="page-shell lg:grid lg:grid-cols-[var(--rail-w)_minmax(0,1fr)]">
            <SignRail />
            <div className="min-w-0">
              <SignBar />
              <main id="main" tabIndex={-1} className="relative">{children}</main>
              <SiteFooter />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
