// UI enhancements: light/dark theme toggle, hero terminal typing and the custom animated cursor.
// The initial theme is applied by the inline script in <head> (before first paint)
// to avoid a flash of the wrong theme; this file only handles switching.

(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  function getSavedTheme() {
    try {
      return localStorage.getItem("theme");
    } catch (e) {
      return null;
    }
  }

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

  // Follow OS theme changes until the visitor picks a theme explicitly.
  systemDark.addEventListener("change", (e) => {
    if (!getSavedTheme()) applyTheme(e.matches ? "dark" : "light", true);
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

  const interactive = "a, button, label, select, .project, [data-bs-toggle], .social-icon";
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
