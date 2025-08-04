import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import passport from './config/passport.js'
import { routes } from './routes/index.js'
import { sessionMid } from './config/session.js'
import path from 'node:path'

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
)
app.use(sessionMid)
app.use(passport.session())

app.use(morgan('dev'))

app.use('/uploads', express.static(path.join(process.cwd(), 'src/uploads')))

app.use('/api', routes)

app.use((err, req, res, next) => {
  console.error('[ERROR]', err)

  const status = err.status || 500
  const message = err || 'Internal Server Error'

  res.status(status).json({
    error: err.message,
    fields: err.fields || {},
  })
})

export default app
