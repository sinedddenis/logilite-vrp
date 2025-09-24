import type { Driver, Stop, LatLng } from '../types'
import { assignGreedy } from '../vrp/assignGreedy'
import { nearestNeighborOrder } from '../vrp/nearestNeighbor'
import { tourLengthKm } from '../vrp/twoOpt'


const depot: LatLng = { lat: 43.6532, lng: -79.3832 }

const drivers: Driver[] = [
    { id: 'd1', name: 'Alice', active: true, start: undefined },
    { id: 'd2', name: 'Bob', active: true, start: undefined },
]

const stops: Stop[] = [
    { id: 's1', customerId: 'c1', lat: 43.651, lng: -79.381, status: 'PENDING' },
    { id: 's2', customerId: 'c2', lat: 43.66, lng: -79.39, status: 'PENDING' },
    { id: 's3', customerId: 'c3', lat: 43.657, lng: -79.37, status: 'PENDING' },
    { id: 's4', customerId: 'c4', lat: 43.645, lng: -79.375, status: 'PENDING' },
    { id: 's5', customerId: 'c5', lat: 43.668, lng: -79.385, status: 'PENDING' },
    { id: 's6', customerId: 'c6', lat: 43.649, lng: -79.395, status: 'PENDING' },
]

const plansSingle = assignGreedy({
    dateISO: '2025-09-23',
    drivers,
    stops,
    singleDepot: true,
    depot,
})

console.log('\n=== Single-Depot Plans ===')
console.log(
    'single-depot: drivers=',
    drivers.length,
    'stops=',
    stops.length,
    'plans=',
    plansSingle.length,
)
for (const p of plansSingle) {
    console.log(`Driver ${p.driverId}:`)
    for (const s of p.stops) {
        console.log(`  seq ${s.seq}: ${s.id} (${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`)
    }
}

const driversWithStarts: Driver[] = [
    { id: 'd1', name: 'Alice', active: true, start: { lat: 43.66, lng: -79.4 } },
    { id: 'd2', name: 'Bob', active: true, start: { lat: 43.64, lng: -79.36 } },
]

const plansPerDriver = assignGreedy({
    dateISO: '2025-09-23',
    drivers: driversWithStarts,
    stops,
    singleDepot: false,
    fallbackDepot: depot,
})

console.log('\n=== Per-Driver Starts Plans ===')
console.log(
    'per-driver: drivers=',
    driversWithStarts.length,
    'stops=',
    stops.length,
    'plans=',
    plansPerDriver.length,
)
for (const p of plansPerDriver) {
    console.log(`Driver ${p.driverId}:`)
    for (const s of p.stops) {
        console.log(`  seq ${s.seq}: ${s.id} (${s.lat.toFixed(4)}, ${s.lng.toFixed(4)})`)
    }
}

if (plansSingle[0]?.stops?.length) {
    const pts = plansSingle[0].stops.map((s) => ({ lat: s.lat, lng: s.lng }))
    const nnOrder = nearestNeighborOrder(pts, 0)
    const nnLenKm = tourLengthKm(pts, nnOrder)
    console.log(`\nNN tour length for first single-depot route: ~${nnLenKm.toFixed(2)} km`)
}
