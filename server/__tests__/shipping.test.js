import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../index.js'

describe('GET /api/v1/shipping/ports', () => {
  it('returns 200 with code/msg/data envelope', async () => {
    const res = await request(app).get('/api/v1/shipping/ports')
    expect(res.status).toBe(200)
    expect(res.body.code).toBe(200)
    expect(res.body.msg).toBe('success')
    expect(res.body.data).toBeDefined()
  })

  it('data.list contains exactly 10 items sorted by rank ascending', async () => {
    const res = await request(app).get('/api/v1/shipping/ports')
    const list = res.body.data.list
    expect(list).toHaveLength(10)
    expect(list[0].rank).toBe(1)
    expect(list[9].rank).toBe(10)
  })

  it('each port item has required fields', async () => {
    const res = await request(app).get('/api/v1/shipping/ports')
    const port = res.body.data.list[0]
    expect(port).toHaveProperty('rank')
    expect(port).toHaveProperty('portName')
    expect(port).toHaveProperty('englishName')
    expect(port).toHaveProperty('country')
    expect(port).toHaveProperty('throughput')
    expect(port).toHaveProperty('growthRate')
  })
})

describe('GET /api/v1/shipping/indices', () => {
  it('returns 200 with code/msg/data envelope', async () => {
    const res = await request(app).get('/api/v1/shipping/indices')
    expect(res.status).toBe(200)
    expect(res.body.code).toBe(200)
    expect(res.body.data.indexName).toBe('Baltic Dry Index (BDI)')
  })

  it('timeline array contains at least 5 entries with bdi/bci/bpi/bsi', async () => {
    const res = await request(app).get('/api/v1/shipping/indices')
    const timeline = res.body.data.timeline
    expect(timeline.length).toBeGreaterThanOrEqual(5)
    const point = timeline[0]
    expect(point).toHaveProperty('date')
    expect(point).toHaveProperty('bdi')
    expect(point).toHaveProperty('bci')
    expect(point).toHaveProperty('bpi')
    expect(point).toHaveProperty('bsi')
    expect(point.bdi).toBeGreaterThan(0)
  })
})

describe('GET /api/v1/shipping/routes', () => {
  it('returns 200 with code/msg/data envelope', async () => {
    const res = await request(app).get('/api/v1/shipping/routes')
    expect(res.status).toBe(200)
    expect(res.body.code).toBe(200)
    expect(res.body.data.category).toBe('Global Main Routes Matrix')
  })

  it('each route has id, routeName, coords array with [lng, lat] pairs', async () => {
    const res = await request(app).get('/api/v1/shipping/routes')
    const routes = res.body.data.routes
    expect(routes.length).toBeGreaterThanOrEqual(3)
    const route = routes[0]
    expect(route).toHaveProperty('id')
    expect(route).toHaveProperty('routeName')
    expect(route).toHaveProperty('vesselDensityValue')
    expect(route).toHaveProperty('activeVessels')
    expect(route).toHaveProperty('capacityTEU')
    expect(Array.isArray(route.coords)).toBe(true)
    expect(route.coords[0]).toHaveLength(2) // [lng, lat]
  })
})

describe('GET /api/v1/shipping/vessels', () => {
  it('returns 200 with code/msg/data envelope', async () => {
    const res = await request(app).get('/api/v1/shipping/vessels')
    expect(res.status).toBe(200)
    expect(res.body.code).toBe(200)
    expect(res.body.data.list).toBeDefined()
    expect(res.body.data.total).toBeGreaterThan(0)
  })

  it('each vessel has required AIS fields', async () => {
    const res = await request(app).get('/api/v1/shipping/vessels')
    const vessel = res.body.data.list[0]
    expect(vessel).toHaveProperty('mmsi')
    expect(vessel).toHaveProperty('vesselName')
    expect(vessel).toHaveProperty('vesselType')
    expect(vessel).toHaveProperty('latitude')
    expect(vessel.latitude).toBeGreaterThan(-90)
    expect(vessel.latitude).toBeLessThan(90)
    expect(vessel).toHaveProperty('longitude')
    expect(vessel.longitude).toBeGreaterThan(-180)
    expect(vessel.longitude).toBeLessThan(180)
    expect(vessel).toHaveProperty('speed')
    expect(vessel).toHaveProperty('status')
    expect(vessel).toHaveProperty('heading')
  })

  it('consecutive calls return slightly different positions (simulated movement)', async () => {
    const res1 = await request(app).get('/api/v1/shipping/vessels')
    const res2 = await request(app).get('/api/v1/shipping/vessels')
    // With randomization, positions should differ between calls
    const allSame = res1.body.data.list.every((v, i) =>
      v.latitude === res2.body.data.list[i].latitude &&
      v.longitude === res2.body.data.list[i].longitude
    )
    expect(allSame).toBe(false)
  })
})
