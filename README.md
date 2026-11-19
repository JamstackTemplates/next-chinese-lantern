# Chinese lantern (Next.js)

An elegant red-lacquer and gold theme for Chinese restaurants and takeaways: a numbered bilingual menu with spice and allergen markers, a takeaway list that adds up dish numbers for phone orders, banquet set menus, opening hours, location and a [Jamstacks](https://jamstacks.net) contact component for banquets, group dining and takeaway questions.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend. A tall lacquered signboard runs down the left of the page with the name in vertical gold lettering and a string of lanterns; the menu is a dense numbered list on rice paper. Light mode is "lacquer and rice paper". Dark mode is "lantern-lit night": lacquer black, an oxblood signboard and lanterns that glow. Both follow the visitor's device unless they pick one with the toggle.

**Gam Dang Dumpling House (金燈餃子館)**, its family story, menu, prices, banquets and contact details are fictitious placeholders. The sample address is a public landmark, the Chinatown Friendship Gate (N 10th St and Arch St, Philadelphia, PA), so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | **Tonight**: the live open status, the phone number in large type with **Call for takeaway**, today's hours, the address and **See the menu**, beside "How takeaway works". Then **Find us** (landmark and cross streets, directions, hours by service, map), **Chef's specials** as numbered rows, **Weekend dim sum**, a **Banquets** list, **Our story** and **FAQs** |
| `/menu/` | Status and phone at the top, a section index with number ranges, the allergen key, then the full numbered menu with filters (vegetarian, no spice, no peanuts, no shellfish) and the **takeaway list**: docked on the right on desktop, a bottom sheet on phones |
| `/banquets/` | Each set menu as a printed course card (courses with numbers and Chinese names, guests, price per person, notice), how banquets work, and an enquiry call to action |
| `/contact/` | "Banquets, group dining & takeaway questions": email and phone (always shown) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "This dish isn't on our menu…" |

On desktop the signboard holds the name, lanterns, **Menu · Banquets · Contact**, the open status, the phone number, a **Call for takeaway** button and the light/dark toggle. On phones and tablets it becomes a one-line sign bar across the top. "Find us" is reached from the Tonight block and the footer.

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # content, hours, takeaway list, configuration and embed checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from three content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/menu.ts](content/menu.ts) | Sections, dish numbers, English and Chinese names, descriptions, prices and sizes, spice, diet and allergen marks, badges, featured dishes, sold-out dishes, the allergen note, currency |
| [content/restaurant.ts](content/restaurant.ts) | Name and Chinese name, seal characters, tagline, introduction, story, email, phone, address (plus a landmark/cross-streets `note`), directions, hours by service, takeaway details, the dim sum note, notice, FAQs, social links |
| [content/banquets.ts](content/banquets.ts) | Banquet set menus (guests, price per person, courses, notice) and the "How banquets work" steps |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours (including the signboard, lanterns, seals and drawings), fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon (a lantern) |
| [site.config.json](site.config.json) | Site name/description, domain, time zone and public deployment settings (see below) |

### The numbered menu

A dish in `content/menu.ts` looks like this:

```ts
{
  number: 29,                          // what people say on the phone; also the link /menu/#d29
  name: 'Salt & pepper squid',
  nameZh: '椒鹽鮮魷',                   // Traditional Chinese; leave '' rather than guess
  description: 'Tender squid in a feather-light batter with garlic, chilli and scallion.',
  price: 17.5,                         // or sizes: [{ label: 'Small', amount: 9 }, { label: 'Large', amount: 14 }]
  spice: 1,                            // 0–3 chillies
  allergens: ['shellfish', 'gluten', 'egg'], // peanut, tree-nut, shellfish, fish, sesame, soy, gluten, egg
  badge: 'house',                      // optional: 'chef' | 'house' | 'seasonal' | 'new'
  featured: true,                      // optional: show in "Chef's specials" on the home page (keep 4–6)
}
```

Add `diet: 'vegetarian'` or `diet: 'vegan'` for meat-free dishes (vegan counts as vegetarian in the filters). Piece counts work like sizes: `[{ label: '6 pcs', amount: 8 }, { label: '10 pcs', amount: 12.5 }]`.

Numbers must be unique, rise within a section, and each section must start after the one before it ends. The section's range in its heading ("Dim sum · 1–12"), the section index and every dish link are worked out from the numbers, so they can't drift.

Common tasks:

- **Sold out today?** Add `soldOut: true` to the dish. It stays listed with "Sold out today", greyed out, and can't be added to a takeaway list. Remove the line when it's back. Featured dishes and banquet courses can't be sold out (the tests remind you).
- **New price:** change `price`. Prices are numbers in `menu.currency` (`16` is $16, `16.5` is $16.50). Change `currency` and `locale` for other countries.
- **Chef's special:** add `badge: 'chef'` for the red 主廚推介 seal, and `featured: true` to show it on the home page.
- **Seasonal dish:** add it with `badge: 'seasonal'`, and delete it (or mark it `soldOut`) when the season ends.
- **New section:** add `{ id, title, titleZh, description, art, dishes: [...] }` to `sections`, numbered after the previous section. `art` is the line drawing for its featured dishes: `steamer`, `bowl`, `wok` or `teapot`.

`npm test` checks the menu after every edit: unique, rising numbers, sections that don't overlap, Chinese names in Traditional characters, valid prices and sizes, spice 0–3, known allergens and badges, 4–6 featured dishes, and banquet courses that exist and aren't sold out. A failure names the dish number, section, banquet or day to fix.

Allergen marks are guidance only. The menu says so beside the allergen key at the top and bottom: the kitchen handles every allergen, so customers should tell you about allergies when they order. Keep that note.

### The takeaway list

On the menu page, every available dish has an **Add** button. The list builds up in a panel ("29 · Salt & pepper squid × 1"), with quantities, a size choice for dishes with sizes, and a running estimated total. It offers **Call (215) 555-0188** and **Copy list**, and says plainly: *"This list stays on your device and isn't sent to us. Call to place your order; prices are confirmed by phone."*

It is not online ordering and never submits anything. The list is kept in the visitor's browser (`localStorage`), so it's still there when they come back; when the menu changes, numbers that are sold out or gone are dropped and the visitor is told which. Without JavaScript the Add buttons don't appear, but every dish still shows its number, so people can call and order by number. The list prints neatly with the menu.

### Banquets

Each banquet in `content/banquets.ts` has a name and Chinese name, a description, `minGuests` (2 or more), `pricePerPerson`, `noticeDays` (1 or more) and `courses`. A course is a menu number such as `29` (its names come from the menu) or a banquet-only course:

```ts
{ name: 'Whole steamed fish with ginger and scallion', nameZh: '清蒸全魚' }
```

The website takes no bookings or payments. A message through Contact is an enquiry; you reply to confirm the menu and price and send deposit details by email.

### Hours, services and the open status

`hours` in `content/restaurant.ts` lists every day, Monday first, with its `services` in your local time:

```ts
{ day: 'Wednesday', services: [
  { label: 'Dim sum', opens: '10:30', closes: '15:00' },
  { label: 'Dinner', opens: '17:00', closes: '22:00' },
] },
{ day: 'Tuesday', services: [] },          // closed all day
```

Labels are `Dim sum`, `Lunch`, `Dinner` or `All day`. `takeaway.lastOrdersMinutes` (30 in the sample) stops takeaway calls that long before each service closes. Use `notice` for one-off messages such as Lunar New Year hours; leave it `''` to hide it.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/New_York`. If Jamstacks created this website, it's the time zone you chose in the portal. With it, the signboard and the Tonight block work out, in the visitor's browser using *your* clock and refreshed every minute:

- "Open · taking takeaway calls until 9:30pm"
- "Dim sum until 3pm · dinner from 5pm"
- "Last orders in 15 minutes"
- "Closed today · opens tomorrow at 10:30am"

Today's hours and the "Today" mark in the hours lists are worked out the same way. The built files never contain a time. Without a time zone, or without JavaScript, the status shows a neutral "Call for takeaway" with your number and the weekly hours, and makes no claim about now. The hours say "Times shown in Eastern Time" (or your zone). An invalid name fails the build with a clear message.

### Location and map

The home page puts the landmark, cross streets, directions and hours by service directly under the Tonight block, beside a Google map in a thin gold frame. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/restaurant.ts`.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) darkens it to match the theme; set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The signboard uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint.

The lanterns, seal stamps, spice and allergen marks, cloud-scroll ornaments and the steamer, bowl, wok and teapot line drawings are inline SVG coloured by tokens in `app/tailwind.input.css`, so a new dish needs no image file. Gentle motion (lanterns swaying, steam rising, seal stamps pressing in as menu rows scroll into view) stops for visitors who prefer reduced motion.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on).

Fonts, all self-hosted through `@fontsource` packages under the SIL Open Font License:

- [Noto Serif Display](https://fonts.google.com/noto/specimen/Noto+Serif+Display), a high-contrast serif, for headings, prices and the phone number;
- [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), compact and clear, for text and the menu;
- [Noto Serif TC](https://fonts.google.com/noto/specimen/Noto+Serif+TC) (weight 600 only) for Chinese names. Fontsource splits it into about a hundred small files by `unicode-range`, and a browser downloads only the files holding characters on the page. With the sample content that's roughly 330 KB on Contact (the signboard name and navigation), 670 KB on the home page and 1.1 MB on the menu, shared and cached between pages. The `out/` folder holds every slice (plus `.woff` fallbacks old browsers use), about 9 MB in all, but visitors never download most of it. If you need lighter pages, the usual next step is a build-time subset of just the characters in `content/`.

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Gam Dang Dumpling House",
  "description": "A family-run Cantonese restaurant by Chinatown's Friendship Gate: the numbered menu, weekend dim sum, banquets, opening hours and the number to call for takeaway.",
  "domain": "next-chinese-lantern.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo. **Replace it with your own domain** (hostname only, e.g. `www.yourrestaurant.com`), or set it to `""` if you don't know it yet; it drives canonical URLs, the sitemap and social images. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-restaurant` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts it and emits HTTPS canonical, social and sitemap URLs. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `Restaurant` structured data (`servesCuisine: ["Chinese", "Cantonese", "Dim sum"]`, address, opening hours per service, telephone, menu link, `acceptsReservations: false` for walk-ins) built from `content/restaurant.ts`.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number, a reminder that tonight's takeaway orders are by phone, and a "useful to include" list (date and time, number of guests, which banquet, any allergies). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Banquets, group dining & takeaway questions", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the menu, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy calls a message an *enquiry*: nothing is booked until you reply to confirm. Don't promise bookings, takeaway ordering, attachments or extra fields.
- Only the Contact page loads the Jamstacks script or contains its URL.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation). This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). In dark mode the form's primary colour stays lacquer red so its white button text is readable. A theme you publish in the portal overrides these. Don't style the component's internals.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Fonts are self-hosted (`font-src 'self'`). Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets; they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/chinese-preview npm run build
node scripts/serve.mjs --base /chinese-preview   # http://localhost:3000/chinese-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, and put the same hostname in `site.config.json`'s `domain`. A `public/CNAME` file isn't needed: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal.

## Project structure

```
app/                    routes, metadata, sitemap/robots, global styles and tokens
components/             signboard (rail and sign bar), lanterns, seal, footer, menu book and takeaway list,
                        dish marks and line drawings, open status, hours, Jamstacks host/loader
content/                restaurant.ts, menu.ts and banquets.ts: your content
lib/hours.ts            hours by service and the open/takeaway status (pure, unit tested)
lib/takeaway.ts         the takeaway list: add, quantities, sizes, totals, restore (pure, unit tested)
lib/menu-filter.ts      vegetarian / no spice / no peanuts / no shellfish filter rules
lib/config.mjs          build-time public config resolution and validation
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org Restaurant data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/jamstacks.d.ts    typed JSX for <jamstacks-support-form>
public/                 the social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Gam Dang Dumpling House, its Chinese name and seal characters, the address (and its `note`), directions, email, phone, menu, prices, banquets, story, FAQs and social links with your own details. Have a fluent reader check every Chinese name.
- Set your real services and `lastOrdersMinutes`, and `timeZone` in `site.config.json`. Check the open status at a few times of day.
- Choose your 4–6 featured dishes and the weekend dim sum favourites.
- Replace `domain` in `site.config.json` with your own domain (or `""`). Update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation, the menu filters, the takeaway list and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed: Jamstacks provisioning removes it after verifying it.
Normal `npm test`, type checking, builds and the Pages workflow do not import or read it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
