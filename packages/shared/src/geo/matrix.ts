import type { LatLng } from '../types'

import { haversineKm } from './haversine'

export function buildDistanceMatrix(points: LatLng[]): {
  n: number
  data: Float64Array
  get(i: number, j: number): number
} {
  const n = points.length
  const data = new Float64Array(n * n)

  for (let i = 0; i < n; i++) {
    data[i * n + i] = 0

    for (let j = i + 1; j < n; j++) {
      const d = haversineKm(points[i], points[j])
      data[i * n + j] = d
      data[j * n + i] = d
    }
  }

  return {
    n,
    data,
    get(i, j) {
      return data[i * n + j]
    },
  }
}
