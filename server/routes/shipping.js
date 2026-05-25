import { Router } from 'express'
import { portsData } from '../data/ports.js'
import { indicesData } from '../data/indices.js'

export const shippingRouter = Router()

shippingRouter.get('/ports', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: portsData })
})

shippingRouter.get('/indices', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: indicesData })
})
