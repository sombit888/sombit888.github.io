// Highlights the current section in the contents sidebar. The page works without it.
(function () {
  "use strict";
  const links = Array.from(document.querySelectorAll(".toc a"));
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
