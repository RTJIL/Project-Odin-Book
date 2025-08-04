import 'dotenv/config'
import session from 'express-session'
import { prisma } from '../db/db.js'
import { PrismaSessionStore } from '@quixo3/prisma-session-store'

export const sessionMid = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    // sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
})
