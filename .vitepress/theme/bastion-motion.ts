/** Terminal motion helpers for Bastion. Callers must skip animation when reduced. */

export function reducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function watchReduced(onChange: (reduced: boolean) => void): () => void {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fn = () => onChange(mq.matches)
  mq.addEventListener('change', fn)
  return () => mq.removeEventListener('change', fn)
}

type Pt = [number, number]

function inside(x: number, y: number, poly: Pt[]): boolean {
  let hit = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i]
    const [xj, yj] = poly[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
  }
  return hit
}

/** Dotted world silhouette in a 640×300 viewBox. Sample geography, not a projection. */
export function worldDots(step = 7): Pt[] {
  const continents: Pt[][] = [
    [[46, 108], [72, 70], [104, 50], [146, 44], [190, 50], [230, 64], [258, 90], [250, 118], [228, 140], [200, 164], [176, 176], [160, 158], [150, 166], [122, 156], [92, 162], [66, 140], [48, 120]],
    [[178, 184], [214, 176], [238, 198], [234, 240], [214, 274], [186, 278], [166, 246], [164, 208]],
    [[292, 54], [318, 44], [354, 52], [370, 72], [354, 92], [324, 98], [300, 84], [286, 66]],
    [[302, 108], [340, 100], [372, 118], [378, 162], [366, 210], [338, 238], [308, 226], [294, 180], [296, 136]],
    [[374, 50], [424, 38], [486, 42], [544, 56], [592, 80], [580, 112], [540, 130], [488, 140], [436, 128], [396, 110], [372, 84]],
    [[500, 180], [546, 170], [584, 188], [576, 218], [534, 226], [500, 208]],
    [[214, 28], [246, 22], [262, 38], [240, 50], [212, 44]],
    [[558, 92], [574, 86], [580, 110], [564, 116]],
  ]
  const dots: Pt[] = []
  for (let y = 16; y <= 286; y += step) {
    for (let x = 24; x <= 616; x += step) {
      if (continents.some((poly) => inside(x, y, poly))) dots.push([x, y])
    }
  }
  return dots
}
