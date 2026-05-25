import { Router } from 'express'
import { portsData } from '../data/ports.js'
import { indicesData } from '../data/indices.js'
import { routesData } from '../data/routes.js'
import { getVesselsResponse } from '../data/vessels.js'

export const shippingRouter = Router()

shippingRouter.get('/ports', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: portsData })
})

shippingRouter.get('/indices', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: indicesData })
})

shippingRouter.get('/routes', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: routesData })
})

shippingRouter.get('/vessels', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: getVesselsResponse() })
})
