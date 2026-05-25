import express from 'express'
import cors from 'cors'
import { shippingRouter } from './routes/shipping.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1/shipping', shippingRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Mock server running on :${PORT}`))

export { app }
