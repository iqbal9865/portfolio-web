# CLAUDE.md

This file guides Claude Code (claude.ai/code) when it works in this repository.

## Project overview

Iqbal Ahmed's personal portfolio, live at https://iqbal-ahmed-dev.netlify.app/ (Netlify). It is one static page, hand-written in 2022 with no framework and no build tooling apart from Sass. The page has these sections in order: hero (with particles), About, Skills, Works (portfolio), Recommendations (LinkedIn quotes), Activity (live GitHub data), Contact and Footer. Contact form submissions go to Firebase Firestore and are emailed via Formspree.

There is no `package.json`, bundler, test suite or linter. All third-party libraries load from CDNs.

## Running locally

`app.js` and `firebase-app.js` are ES modules (`<script type="module">`), and browsers block modules over `file://`. Serve the folder over HTTP instead of opening `index.html` directly:

```sh
npx serve .            # or: python -m http.server 8000
```

## Styles (Sass)

- Edit **only** the `stylesheets/_*.scss` partials. `stylesheets/index.css` is compiled output, but it is committed and is the file `index.html` loads.
- After any SCSS change, recompile (Dart Sass is installed globally):
  ```sh
  sass stylesheets/index.scss stylesheets/index.css          # one-off
  sass --watch stylesheets/index.scss:stylesheets/index.css  # while editing
  ```
  Commit the regenerated `index.css` together with the SCSS change. (`index.css.map` is currently an empty file.)
- `index.scss` only lists `@import`s, one partial per page section: `_theme` (light/dark tokens and Bootstrap overrides), `_navbar` (including the theme toggle), `_header` (hero, mouse scroll indicator), `_about`, `_skills`, `_portfolio` (Works section and case study panel), `_recommendations`, `_activity` (GitHub activity section), `_contact` (form and validation error styles), `_footer`, `_terminal` (hero terminal), `_cursor` (custom cursor).
- Shared helpers: `_mixin.scss` (`icons-container`, `border-radius($r)`).

### Theming (light / dark)

- `_theme.scss` defines the CSS custom properties on `:root` (light) and `:root[data-theme="dark"]`. **Never hardcode colors in partials.** Use a token, or add a new one to both blocks.
- `_variable.scss` maps the old Sass names onto those tokens, so `$blackColor` = `var(--color-fg)` (main foreground), `$whiteColor` = `var(--color-bg)`, `$grayBg` and `$creamBg` are the alternate section backgrounds. This makes dark mode an inversion of the monochrome palette. Because they're CSS vars, Sass color functions (`darken()`, `rgba($x, …)`) won't work on them.
- `$heroText` (always `#fff`) is for anything on the hero image (nav, toggle, scroll indicator), which is the same in both themes. The footer has its own `--footer-*` tokens and stays dark.
- **Dark is the default theme**, whatever the OS preference. `<html>` ships with `data-theme="dark"` (so it's dark even without JS), and an inline script in `<head>` swaps in the visitor's saved choice (`localStorage.theme`) before first paint. `ui.js` handles the toggle and the cross-fade.
- **Typography:** Sora (headings, `--font-display`), Manrope (body, `--font-body`) and JetBrains Mono (code and chips, `--font-mono`) load from Google Fonts through a `<link>` in `<head>`. `_base.scss` sets them and defines the section heading pattern: `.sub-title` is a small uppercase accent eyebrow with a leading rule, and `.title` is a large sentence-case display heading. Its `solid-button` mixin gives every solid button the same type. **Font Awesome 4.7** still comes in through a CSS `@import` in `_base.scss`, and all `fa fa-*` icons rely on it.
- Light mode uses navy-tinted neutrals with near-black navy ink (`#0e1424`). Both themes share one accent, `--color-accent` (light `#3a52d6`, dark `#94a9ff`), used for eyebrows, link underlines, focus rings, skill bars, the heatmap and hovers. Every text color passes WCAG AA on its background, so recheck contrast if you change a token. Dark mode matches the hero: deep navy page `#0e1426`, alt sections `#0b1020`, footer `#070b17`, and translucent "glass" cards (`--color-surface` is `rgba`, blurred via `--card-blur`) like the hero terminal. The hero (`--hero-bg`) and mobile menu (`--menu-bg`, `--menu-border`) also have tokens.
- **Section backdrop:** every `.section` except the footer repeats the hero's look in both themes (`_base.scss`): a 44px grid (`--grid-line`), three soft glows (`--glow-a/b/c`) on a `::before` that drifts slowly (mirrored on even sections, stopped under reduced motion), and a `::after` vignette (`--section-vignette`, transparent in light mode). Sections are `position: relative; isolation: isolate; overflow: hidden`, so their content needs no z-index.
- **Cards** use the `card-surface($lift: true)` mixin in `_mixin.scss` (border, surface, blur, `--card-shadow`; with `$lift`, a hover lift with `--card-hover-border` / `--card-hover-shadow`). Use it for new cards. Skill tags use `--tag-bg/border/fg` (terminal code blue in dark mode). 768px / 800px are the main breakpoints, and 801–991px tightens the nav spacing.

## External dependencies (CDN, in `index.html`)

| Library | Version | Used for |
|---|---|---|
| Bootstrap CSS + JS bundle | 5.0.2 | grid and utilities (the JS bundle is no longer used by anything) |
| AOS | `@next` (unpinned) | scroll animations through `data-aos="..."` attributes, started by an inline `AOS.init({...})` (700ms ease-out-cubic, `once`, disabled under reduced motion) |
| SweetAlert2 | `@11` | success/error popups after the contact form is submitted (`Swal.fire`) |
| Firebase JS SDK | 12.6.0 (gstatic ESM URLs) | Firestore |
| particles.js | 2.0.0, **vendored** as `particles.js` | hero background |

`particles.js` is the unmodified upstream library. Don't edit it. Particle settings live in `app.js`.

Load order matters: `stylesheets/index.css` is linked **before** Bootstrap, so a Bootstrap rule wins over a custom rule of equal specificity. That's why some custom rules use `!important` or nest their selectors.

## JavaScript

- **`firebase-app.js`**: initializes the Firebase app (project `portfolio-4a38e`) and exports `db` (Firestore). The web config/API key is public by design. Firestore Security Rules provide the real protection, and they're managed in the Firebase console, not in this repo.
- **`app.js`** (a module) does two separate jobs:
  1. **Contact form** (`#contactForm`): validation on the client, then `addDoc` into the Firestore `messages` collection (`firstName, lastName, email, phone, message, createdAt: serverTimestamp()`), then a POST of the same fields to Formspree (`https://formspree.io/f/xqkjeldo`), then a SweetAlert. Validation rules: first and last name required, valid email, phone of 7–15 digits only, message of at least 10 chars. Errors are written to the `<small class="error">` that is the input's **next sibling** (`element.nextElementSibling`), and the input gets the `.error-input` class. Keep that markup shape if you change the form. Field ids are `first-name`, `last-name`, `email`, `phone`, `text`.
  2. **Particles**: `particlesJS("particles-js", {...})` config (white circles drifting down, click to repulse).
- **AOS and changing heights**: AOS caches section positions at init. Anything that changes a section's height after load (Activity data or errors, Works filters) calls `AOS.refresh()`, otherwise later sections can stay hidden until the reader scrolls past them.
- **Motion (keep it subtle, and only where it suits).**
  - Sections themselves don't animate. Headings and content blocks fade up with AOS (`data-aos="fade-up"`, with small `data-aos-delay` staggers), and the `.sub-title` rule draws in when its heading is revealed.
  - Cards that lift on hover (skills, recommendations, project rows and cards) use `data-reveal` (`data-reveal-delay` in ms) instead of AOS. AOS's transform and transition rules would override their hover lift, so `ui.js` reveals them with a keyframe on the separate `translate` property. Don't put `data-aos` on those cards.
  - Everything is skipped under `prefers-reduced-motion`.
- **`activity.js`** (classic script, `defer`) fills the Activity section for the user in `data-github-user` (`iqbal9865`). It calls the public GitHub REST API without a token, so the limit is 60 requests per hour per visitor IP. It makes about 5 calls: profile, repos sorted by push date, and commits by that user in the 3 most recently pushed repos. The Events API no longer includes commits in push events, which is why commits are read per repo. The contribution heatmap comes from `github-contributions-api.jogruber.de`, because GitHub has no unauthenticated endpoint for it. Updates are near real time. While the section is within 600px of the viewport and the tab is visible, it polls only the repo list every 2 minutes (1 request), comparing `pushed_at` of the top repos. When that changes, or every 30 minutes, it re-fetches profile, commits and calendar, and new commits get the `.is-new` highlight. Unauthenticated 304s still count against the limit, so polling pauses when `X-RateLimit-Remaining` drops to 8 or less. The last result is kept in `localStorage` (`gh-activity:<user>`, up to 7 days), shown instantly, then refreshed. Old data is better than an error while GitHub is unreachable. If some requests fail part-way through a load (usually the rate limit), the last good commits, repo count and calendar are kept, and the data is marked incomplete so the next check retries. Failed commits never get cached as an empty list. Don't rename the cache key: visitors would lose the saved copy that covers rate-limit periods. Older entries with an empty commit list are treated as "not loaded" in `readCache`. When rate-limited with nothing saved, the section says when it will load and retries automatically at the reset time. `[data-time]` labels and the `[data-sync]` "Live · synced" line tick every 30 seconds. All text is inserted with `textContent`. If the GitHub calls fail, an error line and the profile button are shown, and if only the calendar fails, its card is hidden. The heatmap colors are the `--heat-0..4` tokens, and the live dot is `--live`.
- **`works.js`** (classic script, `defer`, after `projects.js`) renders the Works section and the case study panel. See Content editing.
- **`ui.js`** (classic script, loaded after AOS) holds UI behavior. It also fills the footer year (`[data-year]`).
  1. **Hero terminal typing**: types out `#terminal-body`, or shows it statically when reduced motion is on.
  2. **Hero tagline rotator**: cycles the `.role-word` spans (skipped with reduced motion).
  3. **Theme toggle** (`#theme-toggle` in the nav): switches `data-theme`, and saves the choice to `localStorage`. OS theme changes are ignored.
  4. **Card reveals** (`[data-reveal]`, IntersectionObserver; watches the Works containers for cards that `works.js` renders later).
  5. **Card spotlight**: sets `--mx` / `--my` on hovered cards, and the `card-surface` mixin's `::after` draws a soft glow there (`--card-spot`). Fine pointers only.
  6. **Scroll progress**: the sticky-header code scales `.scroll-progress` (a gradient line under the frosted header) with the scroll position.
  7. **Custom cursor**: a `.cursor-dot` plus a trailing `.cursor-ring` (eased with rAF), styled in `_cursor.scss`. It's enabled only for `(hover: hover) and (pointer: fine)` and when reduced motion isn't requested. The state classes on `<html>` are `cursor-visible`, `cursor-hover` (the `interactive` selector list in `ui.js`), `cursor-down` and `cursor-text` (over inputs, where the native I-beam is shown).

## Responsive layout

- The hero uses `min-height: 100svh` (falling back to `100vh`) and normal flow, not a fixed height, so it fills the visible screen on phones and grows when content needs more room (landscape phones, short laptops). Don't reintroduce fixed `100vh` heights or absolute positioning there.
- Tap targets are at least 40px (theme toggle, social icons) or 44px (buttons). Section padding drops from 6rem to 4rem below 768px.
- The layout was audited for horizontal overflow, off-screen elements, distorted images and small tap targets at 320–2560px, including landscape phones and short laptops. Re-check those cases after layout changes.

## Content editing

Nearly all copy is hardcoded in `index.html`:
- **About**: photo, then five `.about-text` paragraphs (intro, mobile performance and offline-first work, state and component architecture, teamwork with a word-for-word quote from a LinkedIn recommendation, and the MSc/AI work), the Syftet Ltd. / University College Birmingham `.company` lines, social links and the résumé buttons. `<strong>` marks key contributions. The facts come from `resume/Iqbal-Ahmed-Resume.pdf`, so keep the two in sync and don't add claims that aren't in it.
- **Skills**: four `.skill-group` cards in `.skills-grid` (Front-end, Mobile, Back-end & data, AI & automation), each with a Font Awesome icon, a one-line description and a `.skill-tags` list. Edit the `<li>` tags in `index.html`. `.skill-group-new` with a `.skill-badge` ("Exploring") marks the AI card.
- **Recommendations**: two `.rec` cards in `index.html`, quoted word for word from LinkedIn (don't edit the wording, including the typos, so it matches the source). Each card shows one sentence from the text as `.rec-highlight`, and `.rec-toggle` in `ui.js` swaps it for the full `.rec-full` text and calls `AOS.refresh()`. The section has no menu link, so no nav item is active while it's in view. It uses the alternate background, and Activity uses the plain one.
- **Header / navbar**: `<header class="site-header">` is fixed at the top, outside `.main`. The hero's `.overlay` has `padding-top: var(--header-height)` to make room for it. `ui.js` adds `.is-scrolled` after 24px of scrolling (frosted `--header-bg` bar, dark in both themes), marks the link for the section in view with `.is-active` and `aria-current`, and unchecks `#menu-toggle` when a link is tapped or Esc is pressed. `scroll-padding-top` on `html` keeps anchor jumps clear of the header.
- **Portfolio (Works)**: content lives in `projects.js` (`window.PROJECTS`), and `works.js` renders it. A featured project (`featured: true`) gets a large row with alternating sides. The others become cards in a 2-column grid, filtered by `category`. Clicking any project opens a full-screen case study panel (`#case-study`) at `#work/<id>`. Back and Esc close it, and moving between case studies with Next replaces the history entry. The panel sits at the **end of `<body>`** because AOS gives animated sections a `transform`, which would break `position: fixed`. Every field after `tagline` is optional, and a missing field hides its part of the case study (see the comment at the top of `projects.js`). Images come from `img/`. Each project's cover is a hand-written 1600×900 SVG (`img/<id>.svg`) that illustrates the project's features in the hero's navy style. Featured rows crop covers to a near-portrait shape, so keep the key content in the middle third and put the extras toward the sides. The SVGs load through `<img>`, so web fonts don't apply: use system font stacks.
- **Hero tagline** (`.tagline` under the name): "Software Engineer —" followed by a `.role-rotator` whose `.role-word` spans `ui.js` cycles every 2.6s (`.is-in` / `.is-out`, gradient text from `--hero-grad`). To change the roles, edit those spans and keep `is-in` on the first. The sentence below is split into `.w` spans that fade in one after another (delays from an `@for` in `_header.scss`, so add a step there if you add words). Screen readers get the `.visually-hidden` line instead, and the animated parts are `aria-hidden`. With reduced motion, nothing rotates or fades.
- **Hero**: there's no photo. The backdrop is CSS (glows plus a grid in `.main`, `_header.scss`), and the right side holds a decorative terminal (`.terminal` in `index.html`, styled in `_terminal.scss`, beside the intro from 992px up and stacked under it below that; under 576px it goes full width with text sized by `vw`, and lines wrap on the narrowest phones). To change what it types, edit its `<p class="term-line">` elements. A line with a `.term-cmd` span gets typed character by character, and any other line appears whole. The lines use `white-space: pre`, so the spaces inside them are what's displayed.
- **Images** live in `img/`.
- **Résumé**: `resume/Iqbal-Ahmed-Resume.pdf` is served from the site (Download button with `download`, plus a "View online" link). Replace that file to update the résumé, and update the size shown on the button.
- **Contact details**: the About section links to LinkedIn, GitHub and Email (`mailto:`). The Contact section shows an availability badge (`.availability`) and a direct email line. The footer shows name, email and location (no phone number) plus LinkedIn and GitHub icons.

## Known quirks (found during analysis; not fixed)

Leave these as they are unless asked to fix them:
- `firebase-app.js` imports `collection, addDoc, serverTimestamp` but doesn't use them.
- In the Firestore + Formspree flow, a Formspree failure isn't checked (`response.ok` is never read), so the user still sees "Message Sent!". If Firestore fails, the email is never sent.
- SweetAlert2 popups aren't themed and stay light in dark mode.
- `img/` holds unused assets (`banner-bg.jpg`, `about-img.jpg`, `img-1/2/3/4/5/6.jpg`, `mosque.jpg`, `iNwe.jpg`, `Admission.gif` (~3.4 MB), `Iqbal_Formal_Pic1.jpg`, `iqbal_formal_pic3.jpg`). `img-6.jpg` and `Admission.gif` belonged to the removed Doctors Portal and Admission Funnel projects, and `img-3.jpg` to OZ BANGLA. `mosque.jpg`, `iNwe.jpg` and `img-4.jpg` were the old Daily Islam, iNwe and Silvrback covers. Some images are large (the profile JPGs are ~1.1 MB each).
- `.gitignore` and `.readme` are empty files.
