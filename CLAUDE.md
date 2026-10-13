# CLAUDE.md

This file guides Claude Code (claude.ai/code) when it works in this repository.

## Project overview

Iqbal Ahmed's personal portfolio, live at https://iqbal-ahmed-dev.netlify.app/ (Netlify). It is one static page, hand-written in 2022 with no framework and no build tooling apart from Sass. The page has these sections in order: hero (with particles), About, Skills, Works (portfolio), Activity (live GitHub data), Contact and Footer. Contact form submissions go to Firebase Firestore and are emailed via Formspree.

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
- `index.scss` only lists `@import`s, one partial per page section: `_theme` (light/dark tokens and Bootstrap overrides), `_navbar` (including the theme toggle), `_header` (hero, mouse scroll indicator), `_about`, `_skills`, `_portfolio` (Works section and case study panel), `_activity` (GitHub activity section), `_contact` (form and validation error styles), `_footer`, `_terminal` (hero terminal), `_cursor` (custom cursor).
- Shared helpers: `_mixin.scss` (`icons-container`, `border-radius($r)`).

### Theming (light / dark)

- `_theme.scss` defines the CSS custom properties on `:root` (light) and `:root[data-theme="dark"]`. **Never hardcode colors in partials.** Use a token, or add a new one to both blocks.
- `_variable.scss` maps the old Sass names onto those tokens, so `$blackColor` = `var(--color-fg)` (main foreground), `$whiteColor` = `var(--color-bg)`, `$grayBg` and `$creamBg` are the alternate section backgrounds. This makes dark mode an inversion of the monochrome palette. Because they're CSS vars, Sass color functions (`darken()`, `rgba($x, …)`) won't work on them.
- `$heroText` (always `#fff`) is for anything on the hero image (nav, toggle, scroll indicator), which is the same in both themes. The footer has its own `--footer-*` tokens and stays dark.
- The theme is set on `<html data-theme>` by an inline script in `<head>` before first paint (saved choice in `localStorage.theme`, otherwise the OS preference). `ui.js` handles the toggle and the cross-fade.
- **Typography:** Sora (headings, `--font-display`), Manrope (body, `--font-body`) and JetBrains Mono (code and chips, `--font-mono`) load from Google Fonts through a `<link>` in `<head>`. `_base.scss` sets them and defines the section heading pattern: `.sub-title` is a small uppercase accent eyebrow with a leading rule, and `.title` is a large sentence-case display heading. Its `solid-button` mixin gives every solid button the same type. **Font Awesome 4.7** still comes in through a CSS `@import` in `_base.scss`, and all `fa fa-*` icons rely on it.
- Light mode uses navy-tinted neutrals with near-black navy ink (`#0e1424`). Both themes share one accent, `--color-accent` (light `#3a52d6`, dark `#94a9ff`), used for eyebrows, link underlines, focus rings, skill bars, the heatmap and hovers. Every text color passes WCAG AA on its background, so recheck contrast if you change a token. Dark mode is a navy palette matched to the shirt in the About photo (~`#2a2f43`): page `#252b40`, alt sections `#1e2336`, footer `#171b2a`. The hero (`--hero-bg`) and mobile menu (`--menu-bg`, `--menu-border`) also have tokens, so they turn navy in dark mode. 768px / 800px are the main breakpoints, and 801–991px tightens the nav spacing.

## External dependencies (CDN, in `index.html`)

| Library | Version | Used for |
|---|---|---|
| Bootstrap CSS + JS bundle | 5.0.2 | grid and utilities (the JS bundle is no longer used by anything) |
| AOS | `@next` (unpinned) | scroll animations through `data-aos="..."` attributes, started by an inline `AOS.init()` |
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
- **`activity.js`** (classic script, `defer`) fills the Activity section for the user in `data-github-user` (`iqbal9865`). It calls the public GitHub REST API without a token, so the limit is 60 requests per hour per visitor IP. It makes about 5 calls: profile, repos sorted by push date, and commits by that user in the 3 most recently pushed repos. The Events API no longer includes commits in push events, which is why commits are read per repo. The contribution heatmap comes from `github-contributions-api.jogruber.de`, because GitHub has no unauthenticated endpoint for it. Updates are near real time. While the section is within 600px of the viewport and the tab is visible, it polls only the repo list every 2 minutes (1 request), comparing `pushed_at` of the top repos. When that changes, or every 30 minutes, it re-fetches profile, commits and calendar, and new commits get the `.is-new` highlight. Unauthenticated 304s still count against the limit, so polling pauses when `X-RateLimit-Remaining` drops to 8 or less. The last result is kept in `localStorage` (`gh-activity:<user>`, up to 24 hours), shown instantly, then refreshed. `[data-time]` labels and the `[data-sync]` "Live · synced" line tick every 30 seconds. All text is inserted with `textContent`. If the GitHub calls fail, an error line and the profile button are shown, and if only the calendar fails, its card is hidden. The heatmap colors are the `--heat-0..4` tokens, and the live dot is `--live`.
- **`works.js`** (classic script, `defer`, after `projects.js`) renders the Works section and the case study panel. See Content editing.
- **`ui.js`** (classic script, loaded after AOS) holds UI behavior. It's kept separate from `app.js` because `app.js` throws at `new Stats()` (see Known quirks), and any code added after that line would never run.
  1. **Hero terminal typing**: types out `#terminal-body`, or shows it statically when reduced motion is on.
  2. **Theme toggle** (`#theme-toggle` in the nav): switches `data-theme`, saves the choice to `localStorage`, and follows OS changes until the visitor picks a theme.
  3. **Custom cursor**: a `.cursor-dot` plus a trailing `.cursor-ring` (eased with rAF), styled in `_cursor.scss`. It's enabled only for `(hover: hover) and (pointer: fine)` and when reduced motion isn't requested. The state classes on `<html>` are `cursor-visible`, `cursor-hover` (the `interactive` selector list in `ui.js`), `cursor-down` and `cursor-text` (over inputs, where the native I-beam is shown).

## Responsive layout

- The hero uses `min-height: 100svh` (falling back to `100vh`) and normal flow, not a fixed height, so it fills the visible screen on phones and grows when content needs more room (landscape phones, short laptops). Don't reintroduce fixed `100vh` heights or absolute positioning there.
- Tap targets are at least 40px (theme toggle, social icons) or 44px (buttons). Section padding drops from 6rem to 4rem below 768px.
- The layout was audited for horizontal overflow, off-screen elements, distorted images and small tap targets at 320–2560px, including landscape phones and short laptops. Re-check those cases after layout changes.

## Content editing

Nearly all copy is hardcoded in `index.html`:
- **Skills**: four `.skill-group` cards in `.skills-grid` (Front-end, Mobile, Back-end & data, AI & automation), each with a Font Awesome icon, a one-line description and a `.skill-tags` list. Edit the `<li>` tags in `index.html`. `.skill-group-new` with a `.skill-badge` ("Exploring") marks the AI card.
- **Header / navbar**: `<header class="site-header">` is fixed at the top, outside `.main`. The hero's `.overlay` has `padding-top: var(--header-height)` to make room for it. `ui.js` adds `.is-scrolled` after 24px of scrolling (frosted `--header-bg` bar, dark in both themes), marks the link for the section in view with `.is-active` and `aria-current`, and unchecks `#menu-toggle` when a link is tapped or Esc is pressed. `scroll-padding-top` on `html` keeps anchor jumps clear of the header.
- **Portfolio (Works)**: content lives in `projects.js` (`window.PROJECTS`), and `works.js` renders it. A featured project (`featured: true`) gets a large row with alternating sides. The others become cards in a 2-column grid, filtered by `category`. Clicking any project opens a full-screen case study panel (`#case-study`) at `#work/<id>`. Back and Esc close it, and moving between case studies with Next replaces the history entry. The panel sits at the **end of `<body>`** because AOS gives animated sections a `transform`, which would break `position: fixed`. Every field after `tagline` is optional, and a missing field hides its part of the case study (see the comment at the top of `projects.js`). Images come from `img/`.
- **Hero**: there's no photo. The backdrop is CSS (glows plus a grid in `.main`, `_header.scss`), and the right side holds a decorative terminal (`.terminal` in `index.html`, styled in `_terminal.scss`, hidden below 992px, but stacked under the intro on tall tablets: 768–991px wide and at least 820px tall). To change what it types, edit its `<p class="term-line">` elements. A line with a `.term-cmd` span gets typed character by character, and any other line appears whole. The lines use `white-space: pre`, so the spaces inside them are what's displayed.
- **Images** live in `img/`.
- The resume button links to Google Drive. `img/Resume_Iqbal_Ahmed.pdf` is not linked anywhere.

## Known quirks (found during analysis; not fixed)

Leave these as they are unless asked to fix them:
- The end of `app.js` calls `new Stats()` (the particles.js demo FPS counter), but Stats.js is never loaded and `.js-count-particles` doesn't exist. This throws a `ReferenceError` on every page load. The form listener and particles are set up before that line, so they still work.
- `firebase-app.js` imports `collection, addDoc, serverTimestamp` but doesn't use them.
- In the Firestore + Formspree flow, a Formspree failure isn't checked (`response.ok` is never read), so the user still sees "Message Sent!". If Firestore fails, the email is never sent.
- `index.html`: the Twitter icon has no link.
- SweetAlert2 popups aren't themed and stay light in dark mode.
- `img/` holds unused assets (`banner-bg.jpg`, `about-img.jpg`, `img-1/2/5.jpg`, `Iqbal_Formal_Pic1.jpg`, `iqbal_formal_pic3.jpg`). Some images are large (the profile JPGs are ~1.1 MB each, `Admission.gif` is ~3.4 MB).
- `.gitignore` and `.readme` are empty files.
