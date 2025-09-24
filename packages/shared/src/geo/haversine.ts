export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371

  const dLatDeg = b.lat - a.lat
  const dLonDeg = b.lng - a.lng

  const dLat = toRad(dLatDeg)
  const dLon = toRad(dLonDeg)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))

  return R * c
}

const toRad = (deg: number) => (deg * Math.PI) / 180
