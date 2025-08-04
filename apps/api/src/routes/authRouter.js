import { Router } from 'express'
import passport from '../config/passport.js'
import { isAuth } from '../middlewares/isAuth.js'
import { authController } from '../controllers/authController.js'

export const authRouter = Router()

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/api/auth/google',
  }),
  (req, res) => {
    console.log('✅ Logged in via google:', req.user)
    res.redirect('/api/auth/') //⚠️
  }
)

authRouter.get('/me', isAuth)

authRouter.post('/local/register', authController.register)
authRouter.post('/local/login', authController.login)

authRouter.post('/logout', authController.logout)
