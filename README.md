# Iqbal Ahmed — Portfolio

**Live site: [iqbal-ahmed-dev.netlify.app](https://iqbal-ahmed-dev.netlify.app/)**

Personal portfolio website of **Iqbal Ahmed**, a software engineer focused on front-end development and modern JavaScript. The site introduces my background, skills and selected work, shows my live GitHub activity, and provides a contact form that delivers messages straight to my inbox.

It is a lightweight static site written in hand-crafted HTML, Sass and vanilla JavaScript. There is no framework and no build pipeline apart from the Sass compiler.

---

## Highlights

- **Light and dark themes.** A monochrome light theme and a navy dark theme. The site follows the visitor's OS preference on first visit, remembers a manual choice, and applies it before first paint so the page never flashes the wrong theme.
- **Interactive hero.** A code-editor style backdrop with a particle field and an animated terminal that types out a short introduction.
- **Real-time GitHub activity.** The current project, contribution stats, a 12-month contribution heatmap, latest commits and recently active repositories, all pulled from the public GitHub API. The section keeps checking while it is open, so a new push shows up within about two minutes and new commits are highlighted as they arrive.
- **Project case studies.** Featured projects with filterable project cards. Each opens a full-screen case study with overview, contributions, tech stack and results, and has its own shareable link.
- **Validated contact form.** Client-side validation. Messages are stored in Firebase Firestore and forwarded by email through Formspree.
- **Responsive and accessible.** Tested from 320px phones to 2560px displays, including landscape phones. The site has touch-friendly tap targets, keyboard focus styles, and reduced-motion support for all animations.
- **Polished details.** Scroll animations, a custom cursor on pointer devices, and smooth theme cross-fades.

## Sections

| Section | Description |
|---|---|
| **Home** | Introduction with an animated terminal and particle background |
| **About** | Background, experience, education, social links and résumé download |
| **Skills** | Proficiency overview across core technologies |
| **Works** | Featured projects, a filterable project grid and a case study for each project |
| **Activity** | Real-time GitHub contributions, commits and repositories |
| **Contact** | Message form with validation and instant confirmation |

## Tech stack

| Area | Technology |
|---|---|
| Markup and styling | HTML5, Sass (SCSS) compiled with Dart Sass, CSS custom properties |
| Layout and components | Bootstrap 5 |
| Scripting | Vanilla JavaScript (ES modules) |
| Data and messaging | Firebase Firestore, Formspree |
| Integrations | GitHub REST API, GitHub contributions calendar API |
| UI libraries | AOS (scroll animations), particles.js, SweetAlert2 |
| Icons and fonts | Font Awesome 4.7, Google Fonts (Raleway, Cormorant SC) |

## Project structure

```
portfolio-web/
├── index.html          # Single-page markup for all sections
├── app.js              # Contact form (validation, Firestore, Formspree) and particles config
├── firebase-app.js     # Firebase initialisation (exports Firestore `db`)
├── projects.js       # Portfolio content (projects and case studies)
├── works.js          # Renders the Works section and case study panel
├── activity.js         # GitHub Activity section (fetching, caching, rendering)
├── ui.js               # Theme toggle, hero terminal typing, custom cursor
├── particles.js        # Vendored particles.js library
├── img/                # Images and project screenshots
└── stylesheets/
    ├── index.scss      # Entry point: imports one partial per section
    ├── _theme.scss     # Light and dark design tokens
    ├── _*.scss         # Section partials (navbar, header, about, activity, …)
    └── index.css       # Compiled stylesheet loaded by the page
```

## Getting started

### Prerequisites

- A modern web browser
- [Node.js](https://nodejs.org/) (to serve the site locally and to install Sass)
- [Dart Sass](https://sass-lang.com/install/), only needed if you change styles: `npm install -g sass`

### Run locally

The scripts are ES modules, which browsers won't load from `file://`. Serve the folder over HTTP instead:

```sh
git clone https://github.com/iqbal9865/portfolio-web.git
cd portfolio-web
npx serve .
```

Then open the URL shown in the terminal, usually `http://localhost:3000`.

### Editing styles

Edit the partials in `stylesheets/` and recompile:

```sh
sass stylesheets/index.scss stylesheets/index.css          # one-off build
sass --watch stylesheets/index.scss:stylesheets/index.css  # rebuild on save
```

The compiled `index.css` is committed, so commit it together with your SCSS changes.

## Configuration

| What | Where |
|---|---|
| GitHub account shown in Activity | `data-github-user` attribute in `index.html` |
| Firebase project | `firebase-app.js` |
| Contact email endpoint | Formspree URL in `app.js` |
| Theme colours | CSS custom properties in `stylesheets/_theme.scss` |
| Projects and case studies | `projects.js` (field guide at the top of the file) |
| Hero terminal text | `.term-line` elements in `index.html` |

The Firebase web configuration is public by design. Access to the database is protected by Firestore Security Rules, which are managed in the Firebase console.

The Activity section uses the GitHub API without authentication, which allows 60 requests per hour per visitor. Each check while the section is on screen and the tab is visible is a single request every two minutes. Only when a new push is detected does it fetch commits, stats and the calendar again (about five requests), so a visitor stays well within the limit. Polling pauses automatically if the limit runs low. The last result is stored in the browser so returning visitors see it instantly while it refreshes. The contribution count and heatmap come from a third-party service that may take a little longer to update than commits do.

## Deployment

The site is deployed on **Netlify** at [iqbal-ahmed-dev.netlify.app](https://iqbal-ahmed-dev.netlify.app/). Because it is fully static, it can also be hosted on any static host (GitHub Pages, Netlify, Vercel, Firebase Hosting and others) by publishing the repository root. No build step is needed as long as the compiled `stylesheets/index.css` is up to date.

## Contact

**Iqbal Ahmed**: Software Engineer

- Website: [iqbal-ahmed-dev.netlify.app](https://iqbal-ahmed-dev.netlify.app/)
- GitHub: [@iqbal9865](https://github.com/iqbal9865)
- Email: [iqbalahmed9865@gmail.com](mailto:iqbalahmed9865@gmail.com)

---

© Iqbal Ahmed. All rights reserved.
