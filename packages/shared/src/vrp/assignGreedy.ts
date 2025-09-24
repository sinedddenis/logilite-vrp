import { buildDistanceMatrix } from '../geo/matrix'
import type { Driver, Stop, RoutePlan, LatLng } from '../types'

import { nearestNeighborOrder } from './nearestNeighbor'
import { twoOptImprove } from './twoOpt'

export type PlanInput = {
  dateISO: string
  drivers: Driver[]
  stops: Stop[]
  singleDepot?: boolean
  depot?: LatLng
  fallbackDepot?: LatLng
}

export function assignGreedy(input: PlanInput): RoutePlan[] {
  const { dateISO, drivers, stops, singleDepot, depot, fallbackDepot } = input

  const active = drivers.filter((d) => d.active)

  if (active.length === 0 || stops.length === 0) return []

  const buckets: Stop[][] = active.map(() => [])

  if (singleDepot) {
    const hub: LatLng = depot ?? fallbackDepot ?? { lat: 0, lng: 0 }
    const withAngle = stops.map((s) => {
      const dy = s.lat - hub.lat
      const dx = s.lng - hub.lng
      const angle = Math.atan2(dy, dx)
      return { stop: s, angle }
    })
    withAngle.sort((a, b) => a.angle - b.angle)
    for (let idx = 0; idx < withAngle.length; idx++) {
      const driverIdx = idx % active.length
      buckets[driverIdx].push(withAngle[idx].stop)
    }
  } else {
    const depots: LatLng[] = active.map((d) => d.start ?? fallbackDepot ?? { lat: 0, lng: 0 })
    const stopPoints: LatLng[] = stops.map((s) => ({ lat: s.lat, lng: s.lng }))

    const nDep = depots.length
    const mixedPoints: LatLng[] = [...depots, ...stopPoints]
    const M = buildDistanceMatrix(mixedPoints)

    for (let si = 0; si < stops.length; si++) {
      let bestDepot = 0
      let bestD = Infinity
      const stopIdxInMixed = nDep + si
      for (let di = 0; di < nDep; di++) {
        const d = M.get(di, stopIdxInMixed)
        if (d < bestD) {
          bestD = d
          bestDepot = di
        }
      }
      buckets[bestDepot].push(stops[si])
    }
  }

  const plans: RoutePlan[] = []
  for (let i = 0; i < active.length; i++) {
    if (buckets[i].length === 0) continue
    const depotForThisDriver = input.singleDepot
      ? (input.depot ?? input.fallbackDepot)
      : (active[i].start ?? input.fallbackDepot)

    const sequenced = sequenceBucket(buckets[i], depotForThisDriver)

    plans.push({
      driverId: active[i].id,
      serviceDate: dateISO,
      stops: sequenced,
    })
  }
  return plans
}
function sequenceBucket(stops: Stop[], depot?: LatLng) {
  if (stops.length === 0) return [] as (Stop & { seq: number })[]

  const stopPoints = stops.map((s) => ({ lat: s.lat, lng: s.lng }))
  const points = depot ? [depot, ...stopPoints] : stopPoints

  let order = nearestNeighborOrder(points, 0)

  order = twoOptImprove(points, order)

  const withoutDepot = depot ? order.filter((idx) => idx !== 0).map((idx) => idx - 1) : order

  return withoutDepot.map((stopIdx, seqPos) => ({
    ...stops[stopIdx],
    seq: seqPos + 1,
  }))
}
