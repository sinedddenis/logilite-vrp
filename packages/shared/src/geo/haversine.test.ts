import { describe, it, expect } from 'vitest'
import { haversineKm } from './haversine'

describe('haversineKm', () => {
    it('returns ~0 km for identical points', () => {
        const point = { lat: 43.65, lng: -79.38 }
        const d = haversineKm(point, point)
        expect(d).toBeCloseTo(0, 5)
    })

    it('returns about 559 km Toronto → NYC', () => {
        const toronto = { lat: 43.6532, lng: -79.3832 }
        const nyc = { lat: 40.7128, lng: -74.0060 }
        const d = haversineKm(toronto, nyc)
        expect(d).toBeGreaterThan(500)
        expect(d).toBeLessThan(600)
    })
})