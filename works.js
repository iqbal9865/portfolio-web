// Works section and case studies, rendered from window.PROJECTS (projects.js).
// Featured projects become large alternating rows, the rest a filterable card grid.
// Each project opens a full-screen case study at #work/<id>, so it can be linked directly
// and the browser's Back button closes it. The panel lives at the end of <body>, outside the
// AOS-animated sections, because a transformed ancestor would break position: fixed.

(function () {
  const projects = window.PROJECTS || [];
  const featuredEl = document.querySelector("[data-works-featured]");
  const gridEl = document.querySelector("[data-works-grid]");
  const filtersEl = document.querySelector("[data-works-filters]");
  const panel = document.getElementById("case-study");
  if (!projects.length || !featuredEl || !gridEl || !panel) return;

  const root = document.documentElement;
  const panelBody = panel.querySelector("[data-case-body]");
  const crumb = panel.querySelector("[data-case-crumb]");
  const nextTop = panel.querySelector("[data-case-next]");
  const HASH_PREFIX = "#work/";

  // Content is our own, but escape it anyway so a stray "<" in copy can't break the markup.
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const techOf = (p) => Object.values(p.stack || {}).flat();
  const chips = (list) => `<ul class="works-chips">${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const linkButtons = (p, cls) =>
    (p.links || [])
      .map((l) => `<a class="${cls}" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} <span aria-hidden="true">↗</span></a>`)
      .join("");
  const bullets = (list) => `<ul class="works-bullets">${list.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
  const eyebrow = (parts) =>
    `<div class="works-eyebrow">${parts.filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</div>`;

  function renderFeatured() {
    featuredEl.innerHTML = projects
      .filter((p) => p.featured)
      .map(
        (p) => `
      <article class="works-feature">
        <a class="works-feature-media" href="${HASH_PREFIX}${p.id}" aria-label="Read the ${esc(p.title)} case study">
          <img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy" />
        </a>
        <div class="works-feature-body">
          ${eyebrow(["Featured", p.type, p.platform])}
          <h3 class="works-feature-title">${esc(p.title)}</h3>
          <p class="works-lede">${esc(p.tagline)}</p>
          ${p.contributions ? bullets(p.contributions) : ""}
          ${chips(techOf(p))}
          <div class="works-actions">
            <a class="works-btn" href="${HASH_PREFIX}${p.id}">Read case study <span class="works-arrow" aria-hidden="true">→</span></a>
            ${linkButtons(p, "works-btn works-btn-ghost")}
          </div>
        </div>
      </article>`
      )
      .join("");
  }

  const others = projects.filter((p) => !p.featured);
  const categories = ["All", ...new Set(others.map((p) => p.category).filter(Boolean))];
  let activeFilter = "All";

  function renderFilters() {
    // A single category makes the filter pointless.
    filtersEl.hidden = categories.length < 3;
    filtersEl.innerHTML = categories
      .map(
        (c) =>
          `<button class="works-filter" type="button" data-filter="${esc(c)}" aria-pressed="${c === activeFilter}">${esc(c)}</button>`
      )
      .join("");
  }

  function renderGrid() {
    gridEl.innerHTML = others
      .filter((p) => activeFilter === "All" || p.category === activeFilter)
      .map(
        (p) => `
      <a class="works-card" href="${HASH_PREFIX}${p.id}">
        <div class="works-card-media"><img src="${esc(p.image)}" alt="" loading="lazy" /></div>
        <div class="works-card-body">
          ${eyebrow([p.category, p.type])}
          <h4 class="works-card-title">${esc(p.title)}</h4>
          <p>${esc(p.tagline)}</p>
          <div class="works-card-foot">
            ${chips(techOf(p).slice(0, 3))}
            <span class="works-card-link">Case study <span class="works-arrow" aria-hidden="true">→</span></span>
          </div>
        </div>
      </a>`
      )
      .join("");
  }

  const section = (title, body) =>
    `<section class="case-sec"><h3 class="case-sec-title">${title}</h3><div class="case-sec-body">${body}</div></section>`;

  function renderCaseStudy(p) {
    const index = projects.indexOf(p);
    const next = projects[(index + 1) % projects.length];
    const meta = [
      ["Role", p.role],
      ["Company", p.company],
      ["Timeline", p.timeline],
      ["Platform", p.platform],
    ].filter(([, v]) => v);
    const stack = Object.entries(p.stack || {});

    crumb.textContent = `Case study · ${p.title}`;
    nextTop.href = HASH_PREFIX + next.id;
    panelBody.innerHTML = `
      <header class="case-head">
        ${eyebrow([p.type, p.category])}
        <h2 class="case-title" id="case-study-title">${esc(p.title)}</h2>
        <p class="case-lede">${esc(p.tagline)}</p>
      </header>
      ${
        meta.length
          ? `<dl class="case-meta">${meta.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>`
          : ""
      }
      ${p.links && p.links.length ? `<div class="works-actions">${linkButtons(p, "works-btn")}</div>` : ""}
      <figure class="case-cover"><img src="${esc(p.image)}" alt="${esc(p.title)} cover" /></figure>
      ${p.overview ? section("Overview", `<p>${esc(p.overview)}</p>`) : ""}
      ${p.challenge ? section("The challenge", `<p>${esc(p.challenge)}</p>`) : ""}
      ${p.contributions ? section("What I built", bullets(p.contributions)) : ""}
      ${p.approach ? section("Approach", `<p>${esc(p.approach)}</p>`) : ""}
      ${
        p.gallery && p.gallery.length
          ? section(
              "Screens",
              `<div class="case-gallery">${p.gallery
                .map((g) => `<figure><img src="${esc(g.src)}" alt="${esc(g.alt || p.title)}" loading="lazy" /></figure>`)
                .join("")}</div>`
            )
          : ""
      }
      ${
        stack.length
          ? section(
              "Tech stack",
              `<div class="case-stack">${stack.map(([group, list]) => `<div><h4>${esc(group)}</h4>${chips(list)}</div>`).join("")}</div>`
            )
          : ""
      }
      ${
        p.results && p.results.length
          ? section(
              "Results",
              `<div class="case-results">${p.results
                .map((r) => `<div class="case-result"><b>${esc(r.value)}</b><span>${esc(r.label)}</span></div>`)
                .join("")}</div>`
            )
          : ""
      }
      ${p.learned ? section("What I learned", `<p>${esc(p.learned)}</p>`) : ""}
      <a class="case-next" href="${HASH_PREFIX}${next.id}">
        <span><small>Next case study</small><strong>${esc(next.title)}</strong></span>
        <span class="works-arrow" aria-hidden="true">→</span>
      </a>`;
  }

  // ---- Open / close, driven by the URL hash ----
  let openedInPage = false; // true when we pushed the hash ourselves, so Back can close it
  let returnFocus = null;

  function route() {
    const id = location.hash.startsWith(HASH_PREFIX) ? decodeURIComponent(location.hash.slice(HASH_PREFIX.length)) : "";
    const project = projects.find((p) => p.id === id);

    if (project) {
      if (!panel.classList.contains("is-open")) returnFocus = document.activeElement;
      renderCaseStudy(project);
      panel.scrollTop = 0;
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      root.classList.add("case-study-open");
      panel.focus({ preventScroll: true });
    } else if (panel.classList.contains("is-open")) {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      root.classList.remove("case-study-open");
      if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    }
  }

  function close() {
    if (openedInPage) {
      openedInPage = false;
      history.back();
    } else {
      // Arrived from a shared link: drop the hash without leaving the site.
      history.replaceState(null, "", location.pathname + location.search);
      route();
      document.getElementById("portfolio-section").scrollIntoView();
    }
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest(`a[href^="${HASH_PREFIX}"]`);
    if (link) {
      e.preventDefault();
      const hash = link.getAttribute("href");
      if (panel.classList.contains("is-open")) {
        // Moving between case studies replaces the entry, so one Back still returns to the page.
        history.replaceState(null, "", hash);
      } else {
        history.pushState(null, "", hash);
        openedInPage = true;
      }
      route();
      return;
    }
    const filter = e.target.closest("[data-filter]");
    if (filter) {
      activeFilter = filter.getAttribute("data-filter");
      renderFilters();
      renderGrid();
    }
  });

  panel.querySelector("[data-case-close]").addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("is-open")) close();
  });
  window.addEventListener("popstate", () => {
    if (!location.hash.startsWith(HASH_PREFIX)) openedInPage = false;
    route();
  });
  window.addEventListener("hashchange", route);

  renderFeatured();
  renderFilters();
  renderGrid();
  route();
})();
