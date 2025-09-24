export type Id = string

export type LatLng = {
  lat: number
  lng: number
}

export type StopStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'DELIVERED' | 'FAILED'

export type Stop = LatLng & {
  id: Id
  customerId: Id
  address?: string
  status: StopStatus
  seq?: number
}

export type Driver = {
  id: Id
  name: string
  active: boolean
  vehicleId?: Id
  start?: LatLng
}

export type RoutePlan = {
  routeId?: Id
  driverId: Id
  serviceDate: string
  stops: (Stop & { seq: number })[]
  totalKm?: number
  totalMinutes?: number
}

export type DistanceMatrix = {
  n: number
  data: Float64Array
  get(i: number, j: number): number
}
