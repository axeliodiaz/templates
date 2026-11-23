import { animate, stagger } from "motion";
export function mountAssayMotion(root: HTMLElement) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  let controls: ReturnType<typeof animate>[] = [];
  const stop = () => {
    controls.forEach((a) => a.cancel());
    controls = [];
  };
  const start = () => {
    stop();
    if (query.matches) return;
    const cards = [...root.querySelectorAll<HTMLElement>(".as-card,.as-rail")];
    if (cards.length)
      controls.push(
        animate(
          cards,
          { opacity: [0, 1], y: [8, 0] },
          { duration: 0.4, delay: stagger(0.06), ease: [0.22, 1, 0.36, 1] },
        ),
      );
    const cells = [...root.querySelectorAll<HTMLElement>(".as-heatmap td")];
    if (cells.length)
      controls.push(
        animate(
          cells,
          { opacity: [0, 1] },
          { duration: 0.2, delay: stagger(0.02), ease: "easeInOut" },
        ),
      );
    root.querySelectorAll<SVGGeometryElement>(".as-draw").forEach((line) => {
      const n = line.getTotalLength();
      controls.push(
        animate(
          line,
          { strokeDasharray: [`${n}`, `${n}`], strokeDashoffset: [n, 0] },
          { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
        ),
      );
    });
    root
      .querySelectorAll<HTMLElement>(".as-dot")
      .forEach((dot) =>
        controls.push(
          animate(
            dot,
            {
              boxShadow: [
                "0 0 0 0 rgba(255,88,9,.35)",
                "0 0 0 6px rgba(255,88,9,0)",
              ],
            },
            { duration: 2, repeat: Infinity, ease: "easeInOut" },
          ),
        ),
      );
  };
  start();
  query.addEventListener("change", start);
  return () => {
    stop();
    query.removeEventListener("change", start);
  };
}
