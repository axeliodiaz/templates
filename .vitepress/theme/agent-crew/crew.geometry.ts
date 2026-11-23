import type { CrewAgent } from './crew.model'

export const CARD_W = 300
export const CARD_H = 148
export const ROW_GAP = 54
export const RAIL = 12

export interface CrewRect { id: string; left: number; top: number; width: number; height: number; level: number }
export type LayoutMode = 'tree' | 'list'

function walk(root: CrewAgent, level = 0, out: Array<{ agent: CrewAgent; level: number }> = []) {
  out.push({ agent: root, level })
  for (const child of root.children ?? []) walk(child, level + 1, out)
  return out
}

export function layoutTree(root: CrewAgent, mode: LayoutMode, width = 960): { rects: CrewRect[]; height: number } {
  const rects: CrewRect[] = []
  if (mode === 'list') {
    let y = 16
    for (const { agent, level } of walk(root)) {
      rects.push({ id: agent.id, left: 16 + level * 24, top: y, width: Math.min(CARD_W, width - 32 - level * 24), height: CARD_H, level })
      y += CARD_H + 14
    }
    return { rects, height: y + 16 }
  }
  const leadTop = 0
  const leadLeft = Math.max(16, (width - CARD_W) / 2)
  rects.push({ id: root.id, left: leadLeft, top: leadTop, width: CARD_W, height: CARD_H, level: 0 })
  const children = root.children ?? []
  const childTop = CARD_H + ROW_GAP
  const totalChildWidth = children.length * CARD_W + Math.max(0, children.length - 1) * 30
  let childLeft = Math.max(16, (width - totalChildWidth) / 2)
  for (const child of children) {
    rects.push({ id: child.id, left: childLeft, top: childTop, width: CARD_W, height: CARD_H, level: 1 })
    const tools = child.children ?? []
    if (tools.length) {
      const toolTop = childTop + CARD_H + ROW_GAP
      const toolSpan = tools.length * CARD_W + Math.max(0, tools.length - 1) * 20
      let toolLeft = childLeft + (CARD_W - toolSpan) / 2
      for (const tool of tools) {
        rects.push({ id: tool.id, left: toolLeft, top: toolTop, width: CARD_W, height: CARD_H, level: 2 })
        toolLeft += CARD_W + 20
      }
    }
    childLeft += CARD_W + 30
  }
  const height = Math.max(...rects.map(r => r.top + r.height), CARD_H) + 48
  return { rects, height }
}

export function anchorParent(rect: CrewRect) {
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height }
}

export function anchorChild(rect: CrewRect) {
  return { x: rect.left + rect.width / 2, y: rect.top }
}

/** Rounded vertical elbow between parent and child card anchors. */
export function wirePath(parent: CrewRect, child: CrewRect, level: number): string {
  const p = anchorParent(parent)
  const c = anchorChild(child)
  const bend = Math.max(RAIL, 12 + level * 2)
  const midY = p.y + Math.max(16, (c.y - p.y) / 2)
  const f = (n: number) => n.toFixed(1)
  if (Math.abs(p.x - c.x) < 1) return `M ${f(p.x)} ${f(p.y)} V ${f(c.y)}`
  const dir = c.x > p.x ? 1 : -1
  const elbowX = p.x + dir * bend
  const elbowX2 = c.x - dir * bend
  return `M ${f(p.x)} ${f(p.y)} V ${f(midY - bend)} Q ${f(p.x)} ${f(midY)} ${f(elbowX)} ${f(midY)} H ${f(elbowX2)} Q ${f(c.x)} ${f(midY)} ${f(c.x)} ${f(midY + bend)} V ${f(c.y)}`
}

export function childWires(root: CrewAgent, rects: CrewRect[]): Array<{ parent: string; child: string; d: string; level: number }> {
  const map = new Map(rects.map(r => [r.id, r]))
  const edges: Array<{ parent: string; child: string; d: string; level: number }> = []
  const visit = (node: CrewAgent, level: number) => {
    const parent = map.get(node.id)
    if (!parent) return
    for (const child of node.children ?? []) {
      const childRect = map.get(child.id)
      if (childRect) edges.push({ parent: node.id, child: child.id, d: wirePath(parent, childRect, level), level })
      visit(child, level + 1)
    }
  }
  visit(root, 0)
  return edges
}