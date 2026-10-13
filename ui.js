

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  function updateToggleLabel(theme) {
    const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
  }

  function applyTheme(theme, animate) {
    if (animate) {
      root.classList.add("theme-transition");
      window.setTimeout(() => root.classList.remove("theme-transition"), 450);
    }
    root.setAttribute("data-theme", theme);
    updateToggleLabel(theme);
  }

  updateToggleLabel(root.getAttribute("data-theme"));

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, true);
    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      // Storage unavailable (private mode etc.) - the theme still applies for this visit.
    }
  });
})();

// Mobile menu: close it after a link is tapped, so it isn't still open when the visitor scrolls back up.
(function () {
  const menuToggle = document.getElementById("menu-toggle");
  document.querySelectorAll(".menu a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.checked = false;
    });
  });
})();

// Hero terminal: commands are typed character by character, output lines appear
// one after another. The full transcript is in the HTML, so with reduced motion
// (or no JS) it simply shows statically.
(function () {
  const body = document.getElementById("terminal-body");
  if (!body || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const lines = Array.from(body.querySelectorAll(".term-line"));
  const caret = document.createElement("span");
  caret.className = "term-caret";
  lines.forEach((line) => line.classList.add("is-hidden"));

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function typeCommand(cmd) {
    const text = cmd.textContent;
    cmd.textContent = "";
    cmd.after(caret);
    for (const char of text) {
      cmd.textContent += char;
      await wait(45 + Math.random() * 70);
    }
    await wait(350);
    caret.remove();
  }

  async function play() {
    await wait(700);
    for (const line of lines) {
      line.classList.remove("is-hidden");
      const cmd = line.querySelector(".term-cmd");
      if (cmd) await typeCommand(cmd);
      else await wait(110);
    }
  }

  play();
})();

(function () {
  const finePointer =window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer || reducedMotion) return;

  const root = document.documentElement;
  const dot = document.createElement("div");
  const ring = document.createElement("div");
  dot.className = "cursor-dot";
  ring.className = "cursor-ring";
  dot.setAttribute("aria-hidden", "true");
  ring.setAttribute("aria-hidden", "true");
  document.body.append(dot, ring);
  root.classList.add("has-custom-cursor");

  const interactive = "a, button, label, select";
  const textField = "input, textarea";

  let mouseX = -100;
  let mouseY = -100;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    root.classList.add("cursor-visible");
  });

  root.addEventListener("mouseleave", () => root.classList.remove("cursor-visible"));

  document.addEventListener("mouseover", (e) => {
    root.classList.toggle("cursor-hover", !!e.target.closest(interactive));
    root.classList.toggle("cursor-text", !!e.target.closest(textField));
  });

  window.addEventListener("mousedown", () => root.classList.add("cursor-down"));
  window.addEventListener("mouseup", () => root.classList.remove("cursor-down"));

  // The ring eases toward the pointer each frame, giving it a smooth trailing motion.
  function followPointer() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(followPointer);
  }
  requestAnimationFrame(followPointer);
})();

// Sticky header: frosted bar once the page scrolls, highlight for the section in view,
// and the mobile menu closes after a link is chosen.
(function () {
  const header = document.getElementById("site-header");
  if (!header) return;
  const menuToggle = document.getElementById("menu-toggle");
  const links = Array.from(header.querySelectorAll('.menu a[href^="#"]'));
  const progress = header.querySelector(".scroll-progress");

  let ticking = false;
  function updateHeader() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    // Thin line under the header showing how far down the page the reader is.
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    ticking = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateHeader);
      }
    },
    { passive: true }
  );
  updateHeader();

  // The link whose section crosses the upper part of the screen is marked active.
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href").slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  function setActive(id) {
    links.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        // First section (in page order) that is inside the band wins; none means the hero.
        const current = sections.find((section) => visible.get(section.id));
        // No menu section in view: Home while still in the hero, otherwise nothing
        // (e.g. Recommendations, which has no menu link).
        const inHero = window.scrollY < window.innerHeight * 0.5;
        setActive(current ? current.id : inHero ? "" : null);
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  links.concat(Array.from(header.querySelectorAll(".logo"))).forEach((link) =>
    link.addEventListener("click", () => {
      if (menuToggle) menuToggle.checked = false;
    })
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuToggle && menuToggle.checked) menuToggle.checked = false;
  });
})();

// Hero tagline: the role after "Software Engineer —" rotates every few seconds.
// The old word slides up and out (.is-out) while the next one slides in (.is-in).
(function () {
  const words = document.querySelectorAll(".role-word");
  if (words.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let current = 0;
  setInterval(() => {
    const prev = words[current];
    current = (current + 1) % words.length;
    const next = words[current];
    prev.classList.replace("is-in", "is-out");
    next.classList.remove("is-out");
    next.classList.add("is-in");
    setTimeout(() => prev.classList.remove("is-out"), 700);
  }, 2600);
})();

// Card reveals: cards that lift on hover fade up once as they scroll into view. They use a
// keyframe on the `translate` property (see _base.scss) rather than AOS, whose transform and
// transition rules would override the hover lift. Works cards are rendered later by works.js,
// so its containers are watched for new cards.
(function () {
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.classList.add("reveal-ready");

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        io.unobserve(entry.target);
      }),
    { rootMargin: "0px 0px -60px 0px" }
  );

  function observe(scope) {
    scope.querySelectorAll("[data-reveal]:not(.is-revealed)").forEach((el) => {
      if (el.dataset.revealDelay) el.style.setProperty("--reveal-delay", el.dataset.revealDelay + "ms");
      io.observe(el);
    });
  }

  observe(document);
  document.querySelectorAll("[data-works-featured], [data-works-grid]").forEach((container) => {
    new MutationObserver(() => observe(container)).observe(container, { childList: true });
  });
})();

// Card spotlight: a soft glow follows the pointer across cards that lift on hover
// (drawn by the card-surface mixin from --mx / --my). Mouse and trackpad only.
(function () {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const cards = ".skill-group, .rec, .works-feature, .works-card";

  document.addEventListener(
    "pointermove",
    (e) => {
      const card = e.target.closest(cards);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );
})();

// Footer copyright year.
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Recommendations: "Read full recommendation" shows the whole quote in place of the highlight.
document.querySelectorAll(".rec-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".rec");
    const full = document.getElementById(button.getAttribute("aria-controls"));
    const open = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!open));
    full.hidden = open;
    card.querySelector(".rec-highlight").hidden = !open;
    button.querySelector(".rec-toggle-label").textContent = open ? "Read full recommendation" : "Show less";
    // The section's height changed; AOS caches positions of the sections below.
    if (window.AOS) window.requestAnimationFrame(() => window.AOS.refresh());
  });
});
