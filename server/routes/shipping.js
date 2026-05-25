import { Router } from 'express'
import { portsData } from '../data/ports.js'

export const shippingRouter = Router()

shippingRouter.get('/ports', (_req, res) => {
  res.json({ code: 200, msg: 'success', data: portsData })
})
