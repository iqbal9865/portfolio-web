

(function () {
  const container = document.querySelector("[data-github-user]");
  if (!container) return;

  const user = container.getAttribute("data-github-user");
  const API = "https://api.github.com";
  const CALENDAR_API = `https://github-contributions-api.jogruber.de/v4/${user}?y=last`;
  const CACHE_KEY = `gh-activity:${user}`;
  const CACHE_MS = 30 * 60 * 1000;
  const COMMIT_REPOS = 3; // how many recently pushed repos to pull commits from
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const $ = (sel) => container.querySelector(sel);

  // Build DOM nodes without innerHTML so repo/commit text can never inject markup.
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    (children || []).forEach((c) => c && node.appendChild(c));
    return node;
  }

  function timeAgo(iso) {
    const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
    const units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];
    for (const [name, size] of units) {
      const n = Math.floor(seconds / size);
      if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
    }
    return "just now";
  }

  async function getJSON(url) {
    const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!res.ok) throw new Error(`${res.status} ${url}`);
    return res.json();
  }

  function readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.savedAt < CACHE_MS) return cached.data;
    } catch (e) {}
    return null;
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    } catch (e) {}
  }

  async function load() {
    const [profile, repos, calendar] = await Promise.allSettled([
      getJSON(`${API}/users/${user}`),
      getJSON(`${API}/users/${user}/repos?sort=pushed&per_page=100&type=owner`),
      getJSON(CALENDAR_API),
    ]);
    if (repos.status !== "fulfilled") throw repos.reason;

    // Skip forks and the profile README repo (named after the user).
    const ownRepos = repos.value.filter((r) => !r.fork && r.name.toLowerCase() !== user.toLowerCase());

    // The Events API no longer lists commits in push events, so read them per repo.
    const commitLists = await Promise.allSettled(
      ownRepos.slice(0, COMMIT_REPOS).map((r) =>
        getJSON(`${API}/repos/${user}/${r.name}/commits?author=${user}&per_page=5`).then((list) =>
          list.map((c) => ({
            repo: r.name,
            sha: c.sha.slice(0, 7),
            message: c.commit.message.split("\n")[0],
            date: c.commit.author.date,
            url: c.html_url,
          }))
        )
      )
    );

    const commits = commitLists
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    const languageCounts = {};
    ownRepos.forEach((r) => {
      if (r.language) languageCounts[r.language] = (languageCounts[r.language] || 0) + 1;
    });

    return {
      publicRepos: profile.status === "fulfilled" ? profile.value.public_repos : ownRepos.length,
      languages: Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name),
      repos: ownRepos.slice(0, 5).map((r) => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        pushedAt: r.pushed_at,
        url: r.html_url,
      })),
      commits,
      calendar:
        calendar.status === "fulfilled"
          ? { total: calendar.value.total.lastYear, days: calendar.value.contributions }
          : null,
    };
  }

  function renderStats(data) {
    const now = data.repos[0];
    const nowLink = $("[data-now]");
    if (now) {
      nowLink.textContent = now.name;
      nowLink.href = now.url;
    } else {
      $(".activity-now").hidden = true;
    }

    $('[data-stat="repos"]').textContent = data.publicRepos;
    $('[data-stat="contributions"]').textContent = data.calendar ? data.calendar.total : "–";
    $('[data-stat="languages"]').textContent = data.languages.join(" · ") || "–";
    $('[data-stat="last-push"]').textContent = now ? timeAgo(now.pushedAt) : "–";
  }

  function renderCalendar(calendar) {
    const card = $(".activity-calendar-card");
    if (!calendar) {
      card.hidden = true;
      return;
    }
    const grid = $("[data-calendar]");
    grid.textContent = "";
    grid.setAttribute("role", "img");
    grid.setAttribute("aria-label", `${calendar.total} contributions in the last year`);

    // Cells are placed explicitly: row = weekday (Sunday first), column = week.
    const firstDay = new Date(`${calendar.days[0].date}T00:00:00Z`).getUTCDay();

    let lastMonth = -1;
    calendar.days.forEach((day, index) => {
      const date = new Date(`${day.date}T00:00:00Z`);
      const column = Math.floor((index + firstDay) / 7) + 1;
      // Month label above the first full week of each month.
      if (date.getUTCMonth() !== lastMonth && date.getUTCDate() <= 7) {
        lastMonth = date.getUTCMonth();
        const label = el("span", { class: "activity-month", text: MONTHS[lastMonth] });
        label.style.gridColumn = `${column} / span 3`;
        grid.appendChild(label);
      }
      const cell = el("i", {
        class: `lvl-${day.level}`,
        title: `${day.count} contribution${day.count === 1 ? "" : "s"} on ${day.date}`,
      });
      cell.style.gridColumn = column;
      cell.style.gridRow = date.getUTCDay() + 2;
      grid.appendChild(cell);
    });

    // Show the most recent weeks first on narrow screens.
    const scroller = $(".activity-calendar-scroll");
    scroller.scrollLeft = scroller.scrollWidth;
  }

  function renderList(target, items, emptyText, build) {
    target.textContent = "";
    if (!items.length) {
      target.appendChild(el("li", { class: "activity-empty", text: emptyText }));
      return;
    }
    items.forEach((item) => target.appendChild(el("li", {}, [build(item)])));
  }

  function render(data) {
    renderStats(data);
    renderCalendar(data.calendar);

    renderList($("[data-commits]"), data.commits, "No recent public commits.", (c) =>
      el("a", { class: "activity-item", href: c.url, target: "_blank", rel: "noopener" }, [
        el("span", { class: "activity-item-title", text: c.message }),
        el("span", { class: "activity-meta" }, [
          el("span", { text: c.repo }),
          el("code", { text: c.sha }),
          el("span", { text: timeAgo(c.date) }),
        ]),
      ])
    );

    renderList($("[data-repos]"), data.repos, "No public repositories yet.", (r) =>
      el("a", { class: "activity-item", href: r.url, target: "_blank", rel: "noopener" }, [
        el("span", { class: "activity-item-title", text: r.name }),
        r.description ? el("span", { class: "activity-item-desc", text: r.description }) : null,
        el("span", { class: "activity-meta" }, [
          r.language ? el("span", { text: r.language }) : null,
          el("span", { text: `★ ${r.stars}` }),
          el("span", { text: `Updated ${timeAgo(r.pushedAt)}` }),
        ]),
      ])
    );

    container.setAttribute("aria-busy", "false");
  }

  function showError() {
    container.setAttribute("aria-busy", "false");
    $("[data-error]").hidden = false;
    container.querySelectorAll(".activity-skeleton").forEach((s) => s.remove());
    $(".activity-now").hidden = true;
    $(".activity-calendar-card").hidden = true;
    container.querySelectorAll(".activity-card").forEach((c) => {
      if (!c.querySelector(".activity-list li")) c.closest(".row").hidden = true;
    });
  }

  async function start() {
    const cached = readCache();
    if (cached) return render(cached);
    try {
      const data = await load();
      writeCache(data);
      render(data);
    } catch (e) {
      showError();
    }
  }

  // Wait until the section is near the viewport before spending API requests.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(container);
  } else {
    start();
  }
})();
