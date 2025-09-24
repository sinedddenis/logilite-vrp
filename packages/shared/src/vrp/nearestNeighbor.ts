import { buildDistanceMatrix } from '../geo/matrix'
import type { LatLng } from '../types'


export function nearestNeighborOrder(points: LatLng[], startIdx = 0): number[] {
  const n = points.length
  if (n === 0) return []

  if (startIdx < 0 || startIdx >= n) startIdx = 0

  const M = buildDistanceMatrix(points)
  const visited = new Uint8Array(n)
  const order: number[] = [startIdx]
  visited[startIdx] = 1
  let current = startIdx

  for (let step = 1; step < n; step++) {
    let best = -1
    let bestD = Infinity
    for (let j = 0; j < n; j++) {
      if (visited[j]) continue
      const d = M.get(current, j)
      if (d < bestD) {
        bestD = d
        best = j
      }
    }

    order.push(best)
    visited[best] = 1
    current = best
  }
  return order
}
