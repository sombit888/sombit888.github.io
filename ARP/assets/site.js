// Video selectors. No framework; everything degrades to plain <video controls>.
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const json = (id) => JSON.parse($("#" + id).textContent);

  function seg(group, onChange) {
    const el = $(`[data-group="${group}"]`);
    if (!el) return;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      $$("button", el).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      onChange(b.dataset.v);
    });
  }

  function setVideo(v, src) {
    if (v.getAttribute("src") !== src) {
      v.setAttribute("src", src);
      v.load();
    }
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  }

  // ------------------------------------------------------------ real robot: all 60 trials
  const R = json("real-data");
  const st = { task: "vegetables", view: "external", sel: { arp: 1, pi05: 1 } };
  const fmtScore = (t, max) => `${Number.isInteger(t.score) ? t.score : t.score.toFixed(1)} / ${max}`;

  function renderCol(m) {
    const col = $(`#real-browser .col[data-m="${m}"]`);
    const task = R[st.task], trials = task[m];
    const mean = trials.reduce((a, t) => a + t.progress, 0) / trials.length;
    $(".mean", col).textContent = `mean progress ${Math.round(mean * 100)}%`;
    const box = $(".thumbs", col);
    box.innerHTML = "";
    trials.forEach((t) => {
      const b = document.createElement("button");
      b.setAttribute("aria-pressed", String(t.i === st.sel[m]));
      b.title = `Trial ${t.i}: ${fmtScore(t, task.max)}`;
      b.innerHTML = `<img src="assets/img/real/${t.stem}.jpg" alt="Final frame of trial ${t.i}" loading="lazy"><span>#${t.i} · ${fmtScore(t, task.max)}</span>`;
      b.addEventListener("click", () => { st.sel[m] = t.i; renderCol(m); });
      box.appendChild(b);
    });
    const t = trials[st.sel[m] - 1];
    const view = st.view === "wrist" && !t.wrist ? "external" : st.view;
    $(".meta", col).textContent =
      `Trial ${t.i}: score ${fmtScore(t, task.max)} (${Math.round(t.progress * 100)}%) · episode length ${t.duration.toFixed(0)} s` +
      (st.view === "wrist" && !t.wrist ? " · wrist not recorded, showing external" : "");
    setVideo($("video", col), `assets/video/real/${t.stem}__${view}.mp4`);
  }
  const renderReal = () => { renderCol("arp"); renderCol("pi05"); };
  seg("task", (v) => { st.task = v; st.sel = { arp: 1, pi05: 1 }; renderReal(); });
  seg("view", (v) => { st.view = v; renderReal(); });
  renderReal();
  // the browser starts paused until scrolled into view
  $$("#real-browser video").forEach((v) => v.pause());

  // ------------------------------------------------------------ RoboLab gallery
  const RL = json("rl-data");
  function renderRL() {
    const g = RL[Number($("#rl-task").value)];
    $$("#rl-gallery .res").forEach((el) => {
      const r = g[el.dataset.k];
      el.className = "res " + (r.success ? "ok" : "fail");
      el.textContent = `${r.success ? "success" : "failure"} · ${r.duration.toFixed(0)} s`;
    });
    $$("#rl-gallery video").forEach((v) => setVideo(v, `assets/video/robolab/${g.task}_${v.dataset.k}.mp4`));
  }
  $("#rl-task").addEventListener("change", renderRL);
  renderRL();

  // ------------------------------------------------------------ LIBERO-Perturb gallery
  const LP = json("lp-data");
  function renderLP() {
    const t = LP[Number($("#lp-task").value)];
    $$("#lp-gallery .res").forEach((el) => {
      const [k10, t0] = t[el.dataset.k];
      el.className = "res " + (t0.success ? "ok" : "fail");
      el.textContent = `${t0.success ? "success" : "failure"} (${k10}/10)`;
    });
    $$("#lp-gallery video").forEach((v) => setVideo(v, `assets/video/lp/${t.name}__${v.dataset.k}.mp4`));
  }
  $("#lp-task").addEventListener("change", renderLP);
  renderLP();

  // ------------------------------------------------------------ Dyn-Bump gallery
  const BU = json("bump-data");
  let bumpTask = "dyn_bump_red_ball";
  function renderBump() {
    const t = BU[bumpTask];
    $$("#bump-gallery .res").forEach((el) => {
      const r = t[el.dataset.k];
      el.className = "res " + (r.success ? "ok" : "fail");
      el.textContent = r.success ? "success" : "failure";
    });
    $$("#bump-gallery video").forEach((v) => setVideo(v, `assets/video/bump/${bumpTask}__${v.dataset.k}.mp4`));
  }
  seg("bump-task", (v) => { bumpTask = v; renderBump(); });
  renderBump();

  // ------------------------------------------------------------ play only what is on screen
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
      else v.pause();
    });
  }, { threshold: 0.35 });
  $$("video").forEach((v) => io.observe(v));

  // ------------------------------------------------------------ contents sidebar: mark the section being read
  const links = $$(".toc a");
  const targets = links.map((a) => document.getElementById(a.getAttribute("href").slice(1)));
  let ticking = false;
  function markActive() {
    ticking = false;
    const line = window.innerHeight * 0.3;
    let k = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= line) k = i; });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) k = targets.length - 1;
    links.forEach((a, i) => a.classList.toggle("active", i === k));
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(markActive); } }, { passive: true });
  window.addEventListener("resize", markActive);
  markActive();
})();
