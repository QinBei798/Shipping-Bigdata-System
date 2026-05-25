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
