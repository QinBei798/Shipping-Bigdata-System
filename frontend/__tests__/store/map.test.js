import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMapStore } from '@/store/modules/map.js'

describe('map store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with empty vessels and routes', () => {
    const store = useMapStore()
    expect(store.vessels).toEqual([])
    expect(store.routes).toEqual([])
  })

  it('setVessels replaces vessel list', () => {
    const store = useMapStore()
    const vessels = [
      { mmsi: '1', vesselName: 'Test Ship', latitude: 30, longitude: 120, speed: 15 }
    ]
    store.setVessels(vessels)
    expect(store.vessels).toHaveLength(1)
    expect(store.vessels[0].vesselName).toBe('Test Ship')
  })

  it('setRoutes replaces route list', () => {
    const store = useMapStore()
    const routes = [{ id: 'R01', routeName: 'Test Route', coords: [[0, 0]] }]
    store.setRoutes(routes)
    expect(store.routes).toHaveLength(1)
  })

  it('addVessel appends a new vessel to the list', () => {
    const store = useMapStore()
    store.setVessels([{ mmsi: '1', vesselName: 'Ship A', latitude: 30, longitude: 120, speed: 15 }])
    const newVessel = { mmsi: '2', vesselName: 'Ship B', latitude: 31, longitude: 121, speed: 20 }
    store.addVessel(newVessel)
    expect(store.vessels).toHaveLength(2)
    expect(store.vessels[1].mmsi).toBe('2')
  })

  it('updateVesselPosition updates existing vessel by mmsi', () => {
    const store = useMapStore()
    store.setVessels([
      { mmsi: 'A1', vesselName: 'Ship X', latitude: 30, longitude: 120, speed: 10, heading: 90 },
      { mmsi: 'B2', vesselName: 'Ship Y', latitude: 31, longitude: 121, speed: 12, heading: 180 }
    ])
    store.updateVesselPosition('A1', { latitude: 30.5, longitude: 120.5, speed: 11, heading: 95 })
    const updated = store.vessels.find(v => v.mmsi === 'A1')
    expect(updated.latitude).toBe(30.5)
    expect(updated.longitude).toBe(120.5)
    expect(updated.speed).toBe(11)
    expect(updated.heading).toBe(95)
    // other vessel unchanged
    const other = store.vessels.find(v => v.mmsi === 'B2')
    expect(other.latitude).toBe(31)
  })
})
