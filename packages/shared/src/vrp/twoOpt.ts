import { buildDistanceMatrix } from '../geo/matrix'
import type { LatLng } from '../types'


export function twoOptImprove(points: LatLng[], order: number[], maxIters = 1000): number[] {
  const n = order.length
  if (n < 4) return order

  const M = buildDistanceMatrix(points)

  let improved = true
  let iter = 0

  while (improved && iter++ < maxIters) {
    improved = false

    for (let i = 1; i < n - 2; i++) {
      const a = order[i - 1]
      const b = order[i]

      for (let k = i + 1; k < n - 1; k++) {
        const c = order[k]
        const d = order[k + 1]

        const before = M.get(a, b) + M.get(c, d)

        const after = M.get(a, c) + M.get(b, d)

        if (after + 1e-9 < before) {
          reverseSegment(order, i, k)
          improved = true
        }
      }
    }
  }

  return order
}

function reverseSegment(arr: number[], i: number, k: number) {
  while (i < k) {
    const tmp = arr[i]
    arr[i] = arr[k]
    arr[k] = tmp
    i++
    k--
  }
}

export function tourLengthKm(points: LatLng[], order: number[]): number {
  const n = order.length
  if (n < 2) return 0
  const M = buildDistanceMatrix(points)
  let sum = 0
  for (let t = 0; t < n - 1; t++) {
    sum += M.get(order[t], order[t + 1])
  }
  return sum
}
