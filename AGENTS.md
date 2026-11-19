# Working on this website

This is a customer-owned Next.js website for a Chinese restaurant and takeaway. Read [README.md](README.md) for
setup, content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample restaurant (Gam Dang Dumpling
  House, 金燈餃子館), menu, prices, banquets, address, hours and contact details with the owner's real details; the
  fictional examples are starting content.

## Structure and content

- `content/menu.ts` owns the numbered menu: `sections` (id, `title`, `titleZh`, description, line drawing `art`)
  and their `dishes` (`number`, `name`, `nameZh`, description, `price` as one number or size/piece-count options,
  `spice` 0–3, `diet`, `allergens`, `badge`, `featured`, `soldOut`), plus the allergen note and small print. Most
  owner requests ("27 is sold out today", "raise the har gow to $8", "make the roast pork a chef's special") are
  one-line edits here only.
- Menu numbers are what people say on the phone. Keep them unique, rising within a section, and with each section
  starting after the previous one ends. Section ranges ("Dim sum · 1–12") and anchors (`d27` → `/menu/#d27`) are
  derived from the numbers; never type them by hand. Renumbering changes links and saved takeaway lists (a saved
  list silently drops numbers that no longer exist).
- Chinese names are Traditional characters. Write real, correctly spelt names only; if unsure, leave `nameZh: ''`
  rather than guess, and never machine-translate a menu. Avoid novelty "chopstick" fonts, "Oriental", cartoon
  dragons and pandas, fortune-cookie jokes and mock-Chinese copy.
- `content/restaurant.ts` owns the name, `nameZh`, `sealZh` (1–4 characters for the seal mark), tagline,
  introduction, story and three story points, email, phone, address (with a landmark/cross-streets `note`),
  directions, `hours` (each day's `services`, e.g. Dim sum and Dinner), `takeaway` (phone, `lastOrdersMinutes`,
  pickup wait, payment, note), the weekend dim sum note, `notice`, amenities, FAQs and links.
- `content/banquets.ts` owns the banquet set menus (courses are menu numbers or short banquet-only courses) and
  the three "How banquets work" steps.
- There is no online ordering, delivery or payment. The takeaway list on the menu page is a note kept in the
  visitor's browser to read out on the phone; it never submits anything. Don't add copy suggesting otherwise, or
  delivery app names.
- `lib/hours.ts` holds the pure hours logic (grouping by service and the "Open · taking takeaway calls until
  9:30pm / Dim sum until 3pm · dinner from 5pm / Last orders in N minutes / Closed today · opens …" status).
  `lib/takeaway.ts` holds the pure takeaway list logic (add, quantities, sizes, totals, sold-out rejection,
  restoring a saved list). Keep both pure and covered by `tests/hours.test.ts` and `tests/takeaway.test.ts`.
- The address drives the home page "Find us" section, Google map, directions links and structured data. Maps use
  keyless Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there). Change it
  there, not in content; without it the open status stays neutral.
- Keep ids unique, lowercase and hyphenated; they are page anchors. Use the existing line drawings (steamer, bowl,
  wok, teapot), lanterns, seals and theme colours rather than adding image files.
- Keep content out of `site.config.json`: Jamstacks may rewrite it with deployment fields only.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds everything utilities can't express: the colour tokens (`:root` for light, plus two
  dark blocks that must stay identical), the `@theme` built from them, base element styles, shared building blocks
  (`.button`, `.button-ghost`, `.button-leaf`, `.button-quiet`, `.text-link`, `.eyebrow`, `.rule-gold`,
  `.menu-card`, `.seal`, `.mark`, `.allergen`, `.chip`, `.watermark`), the lacquer signboard, lanterns, line
  drawings and their animation, and styles driven by data attributes.
- Only this template's palette exists (`bg`, `surface`, `ink`, `muted`, `line`, `accent`, `accent-ink`, `gold`,
  `gold-ink`, `jade`, `rail`, `seal`, `art` and their variants). Tailwind's default colours are switched off. To add
  a colour, add a variable to `:root` and both dark blocks, then map it in `@theme inline` as
  `--color-name: var(--variable)` to get `bg-name`, `text-name` and so on. Never hard-code hex values in components.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
  Don't put two utilities for the same property on one element.
- Fonts: `font-display` (Noto Serif Display) for headings and numbers, `font-sans` (Source Sans 3) for text, and
  Noto Serif TC for anything marked `lang="zh-Hant"` (one weight, 600, in unicode-range slices).
- Reuse the existing components (`PageHead`, `SectionHeading`, `CallForTakeaway`, `OpenStatus`, `HoursList`,
  `DishArt`, `SpiceMarks`, `AllergenMarks`, `BadgeMark`, `SiteSeal`, `LanternString`) instead of restyling each
  instance. Add a reusable layout helper with `@utility`.
- Keep the `--jamstacks-*` component variables mapped to the tokens, with a dark-mode primary dark enough for white
  button text. Preserve readable contrast in both themes, responsive layouts from 360px (the phone sign bar must
  stay on one line at 390px), visible keyboard focus, semantic headings, the skip link, text alternatives for
  spice and allergen marks, and reduced-motion support (every animation stops under `prefers-reduced-motion`).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering, Route
  Handlers, Server Actions, middleware, database or production Next.js server.
- Use local content for pages and ordinary client code only for browser-only interactions (the open status, today's
  hours mark, menu filters, takeaway list, copy buttons). Time-dependent text is computed in the browser, never at
  build time. The full menu is always in the static HTML.
- Client components must not import `lib/site.ts`: it would ship the Jamstacks embed URL to every page. Read the
  single `process.env.NEXT_PUBLIC_*` value you need instead (see `lib/paths.ts` and `components/open-status.tsx`).
- Wrap every `localStorage` access in try/catch; the site must work when storage is unavailable.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path helpers and
  `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework behavior. Keep
  dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at `/sites/{publicSiteId}/embed.js`, on
  the Contact page only; no ID means no script request and a useful email fallback.
- The shared runtime owns form rendering, validation, spam protection and submission. Do not copy it, register a
  replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is available. Keep
  the email visible beside the form and usable during outages.
- The form supports name, email and message. Contact copy ("Banquets, group dining & takeaway questions") says a
  message is an enquiry: nothing is booked until the restaurant replies, and tonight's takeaway orders are by
  phone. Don't promise bookings, ordering, attachments or extra fields.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or private
  notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name when changing
  the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # content, hours, takeaway list, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/chinese-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the dish number, section, banquet or day
to fix. `npm start` previews the export on port 3000; stop the dev server first, or use `npm start -- --port 3200`.
Browser-check affected routes in light and dark, at desktop and phone widths, and root/project-path assets when
changing layout, navigation or deployment behavior. Report local checks separately from any actual GitHub deployment
or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import or read it.
- Keep `site.config.json`, the embed integration and the Pages workflow outside the optional folder.
