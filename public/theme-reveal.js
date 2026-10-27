/* Feathered theme reveal for the standalone template demos. The new theme
   sweeps outward from the toggle with a soft, blurred edge (View Transitions
   API). Falls back to an instant switch when unsupported or when the user
   prefers reduced motion. Keep in sync with .vitepress/theme/theme-reveal.ts. */
(function () {
  "use strict";
  function reveal(el, apply) {
    var reduce =
      typeof matchMedia === "function" &&
      matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof document.startViewTransition !== "function") {
      apply();
      return;
    }
    var rect = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    var y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
    var root = document.documentElement;
    root.style.setProperty("--theme-reveal-x", Math.round(x) + "px");
    root.style.setProperty("--theme-reveal-y", Math.round(y) + "px");
    var radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    root.style.setProperty("--theme-reveal-r", Math.ceil(radius) + 140 + "px");
    document.startViewTransition(apply);
  }
  window.ThemeReveal = { reveal: reveal };
})();
