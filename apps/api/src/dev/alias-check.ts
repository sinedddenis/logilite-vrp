import { haversineKm } from '@logilite/shared'

export const __aliasCheck = () =>
    haversineKm({ lat: 0, lng: 0 }, { lat: 1, lng: 1 })