/*
 * Physics Tutor — app shell: navigation, routing, rendering and search.
 */
(function () {
  "use strict";

  const data = window.PHYSICS_DATA;
  const visuals = window.PHYSICS_VISUALS || {};
  let activeCleanup = null;

  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // Flat index of every lesson for search & lookup.
  const lessonIndex = [];
  data.domains.forEach((d) =>
    d.topics.forEach((t) =>
      t.lessons.forEach((l) =>
        lessonIndex.push({ domain: d, topic: t, lesson: l })
      )
    )
  );

  function teardownViz() {
    if (activeCleanup) {
      try { activeCleanup(); } catch (e) { /* ignore */ }
      activeCleanup = null;
    }
  }

  // ---- Sidebar ------------------------------------------------------------
  function buildSidebar() {
    const nav = document.getElementById("domain-nav");
    nav.innerHTML = "";
    const home = el("button", "nav-domain nav-home", "🏠  Overview");
    home.addEventListener("click", () => (location.hash = "#/"));
    nav.appendChild(home);

    data.domains.forEach((d) => {
      const btn = el("button", "nav-domain");
      btn.innerHTML = `<span class="nav-icon">${d.icon}</span> ${d.name}`;
      btn.addEventListener("click", () => (location.hash = `#/domain/${d.id}`));
      btn.dataset.domain = d.id;
      nav.appendChild(btn);
    });
  }

  function setActiveNav(domainId) {
    document.querySelectorAll(".nav-domain").forEach((b) => {
      b.classList.toggle("active", b.dataset.domain === domainId);
    });
  }

  // ---- Views --------------------------------------------------------------
  function renderHome() {
    const main = document.getElementById("content");
    main.innerHTML = "";
    const hero = el("section", "hero");
    hero.appendChild(el("h1", null, "Physics Tutor & Compendium"));
    hero.appendChild(
      el(
        "p",
        "hero-sub",
        "Principles, models, definitions, formulas and lessons across classical and quantum physics — with interactive visual explainers."
      )
    );
    main.appendChild(hero);

    const grid = el("div", "domain-grid");
    data.domains.forEach((d) => {
      const card = el("button", "domain-card");
      const lessons = d.topics.reduce((n, t) => n + t.lessons.length, 0);
      card.innerHTML = `
        <div class="domain-card-icon">${d.icon}</div>
        <h3>${d.name}</h3>
        <p>${d.blurb}</p>
        <span class="domain-card-meta">${d.topics.length} topics · ${lessons} lessons</span>`;
      card.addEventListener("click", () => (location.hash = `#/domain/${d.id}`));
      grid.appendChild(card);
    });
    main.appendChild(grid);
  }

  function renderDomain(domainId) {
    const domain = data.domains.find((d) => d.id === domainId);
    if (!domain) return renderHome();
    const main = document.getElementById("content");
    main.innerHTML = "";

    const crumb = el("nav", "breadcrumb");
    crumb.innerHTML = `<a href="#/">Overview</a> <span>›</span> ${domain.name}`;
    main.appendChild(crumb);

    const head = el("header", "domain-head");
    head.innerHTML = `<div class="domain-head-icon">${domain.icon}</div>
      <div><h1>${domain.name}</h1><p>${domain.blurb}</p></div>`;
    main.appendChild(head);

    domain.topics.forEach((t) => {
      const sec = el("section", "topic");
      sec.appendChild(el("h2", "topic-title", t.name));
      sec.appendChild(el("p", "topic-summary", t.summary));
      const list = el("div", "lesson-list");
      t.lessons.forEach((l) => {
        const item = el("button", "lesson-chip");
        item.innerHTML = `<span class="lesson-chip-title">${l.title}</span>
          <span class="lesson-chip-level">${l.level}</span>
          ${l.viz ? '<span class="lesson-chip-viz">▶ interactive</span>' : ""}`;
        item.addEventListener("click", () => (location.hash = `#/lesson/${l.id}`));
        list.appendChild(item);
      });
      sec.appendChild(list);
      main.appendChild(sec);
    });
  }

  function renderLesson(lessonId) {
    const entry = lessonIndex.find((e) => e.lesson.id === lessonId);
    if (!entry) return renderHome();
    const { domain, topic, lesson } = entry;
    setActiveNav(domain.id);

    const main = document.getElementById("content");
    main.innerHTML = "";

    const crumb = el("nav", "breadcrumb");
    crumb.innerHTML = `<a href="#/">Overview</a> <span>›</span>
      <a href="#/domain/${domain.id}">${domain.name}</a> <span>›</span> ${topic.name}`;
    main.appendChild(crumb);

    const head = el("header", "lesson-head");
    head.innerHTML = `<span class="lesson-level">${lesson.level}</span><h1>${lesson.title}</h1>`;
    main.appendChild(head);

    // Definition
    const def = el("section", "lesson-block definition");
    def.appendChild(el("h3", null, "Definition"));
    def.appendChild(el("p", null, lesson.definition));
    main.appendChild(def);

    // Visual explainer
    if (lesson.viz && visuals[lesson.viz]) {
      const vizSec = el("section", "lesson-block viz-block");
      vizSec.appendChild(el("h3", null, "Interactive Visual Explainer"));
      const stage = el("div", "viz-stage");
      const canvas = el("canvas", "viz-canvas");
      stage.appendChild(canvas);
      vizSec.appendChild(stage);
      const controls = el("div", "viz-controls");
      vizSec.appendChild(controls);
      main.appendChild(vizSec);
      // start after layout so canvas has size
      requestAnimationFrame(() => {
        teardownViz();
        activeCleanup = visuals[lesson.viz](canvas, controls);
      });
    }

    // Explanation
    const exp = el("section", "lesson-block");
    exp.appendChild(el("h3", null, "Explanation"));
    exp.appendChild(el("p", null, lesson.explanation));
    main.appendChild(exp);

    // Formulas
    if (lesson.formulas && lesson.formulas.length) {
      const fs = el("section", "lesson-block");
      fs.appendChild(el("h3", null, "Key Formulas"));
      const fl = el("div", "formula-list");
      lesson.formulas.forEach((f) => {
        const card = el("div", "formula-card");
        card.innerHTML = `<div class="formula-eq">${f.plain}</div>
          <div class="formula-name">${f.name}</div>
          <div class="formula-desc">${f.desc}</div>`;
        fl.appendChild(card);
      });
      fs.appendChild(fl);
      main.appendChild(fs);
    }

    // Key points
    if (lesson.keyPoints && lesson.keyPoints.length) {
      const kp = el("section", "lesson-block");
      kp.appendChild(el("h3", null, "Key Takeaways"));
      const ul = el("ul", "keypoints");
      lesson.keyPoints.forEach((p) => ul.appendChild(el("li", null, p)));
      kp.appendChild(ul);
      main.appendChild(kp);
    }

    // Sibling navigation
    const sibs = topic.lessons;
    const idx = sibs.findIndex((l) => l.id === lesson.id);
    const footer = el("nav", "lesson-nav");
    if (idx > 0) {
      const prev = el("button", "lesson-nav-btn", `← ${sibs[idx - 1].title}`);
      prev.addEventListener("click", () => (location.hash = `#/lesson/${sibs[idx - 1].id}`));
      footer.appendChild(prev);
    }
    if (idx < sibs.length - 1) {
      const next = el("button", "lesson-nav-btn next", `${sibs[idx + 1].title} →`);
      next.addEventListener("click", () => (location.hash = `#/lesson/${sibs[idx + 1].id}`));
      footer.appendChild(next);
    }
    main.appendChild(footer);
  }

  // ---- Search -------------------------------------------------------------
  function setupSearch() {
    const input = document.getElementById("search");
    const results = document.getElementById("search-results");

    const close = () => { results.hidden = true; results.innerHTML = ""; };

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = "";
      if (q.length < 2) return close();
      const hits = lessonIndex
        .map((e) => {
          const hay = (
            e.lesson.title + " " + e.lesson.definition + " " +
            e.topic.name + " " + e.domain.name + " " +
            (e.lesson.keyPoints || []).join(" ")
          ).toLowerCase();
          return { e, score: hay.indexOf(q) };
        })
        .filter((r) => r.score >= 0)
        .slice(0, 8);
      if (!hits.length) {
        results.appendChild(el("div", "search-empty", "No matches"));
        results.hidden = false;
        return;
      }
      hits.forEach(({ e }) => {
        const item = el("button", "search-item");
        item.innerHTML = `<strong>${e.lesson.title}</strong>
          <span>${e.domain.icon} ${e.domain.name} · ${e.topic.name}</span>`;
        item.addEventListener("click", () => {
          location.hash = `#/lesson/${e.lesson.id}`;
          input.value = "";
          close();
        });
        results.appendChild(item);
      });
      results.hidden = false;
    });

    document.addEventListener("click", (ev) => {
      if (!results.contains(ev.target) && ev.target !== input) close();
    });
  }

  // ---- Router -------------------------------------------------------------
  function route() {
    teardownViz();
    const hash = location.hash || "#/";
    const parts = hash.replace(/^#\//, "").split("/");
    if (parts[0] === "domain" && parts[1]) {
      setActiveNav(parts[1]);
      renderDomain(parts[1]);
    } else if (parts[0] === "lesson" && parts[1]) {
      renderLesson(parts[1]);
    } else {
      setActiveNav(null);
      renderHome();
    }
    document.getElementById("content").scrollTop = 0;
    window.scrollTo(0, 0);
  }

  // ---- Init ---------------------------------------------------------------
  function init() {
    buildSidebar();
    setupSearch();
    window.addEventListener("hashchange", route);
    // mobile sidebar toggle
    const toggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if (toggle) {
      toggle.addEventListener("click", () => sidebar.classList.toggle("open"));
      document.getElementById("domain-nav").addEventListener("click", () =>
        sidebar.classList.remove("open")
      );
    }
    route();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
