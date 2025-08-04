import { usersService } from '../services/usersService.js'
import passport from '../config/passport.js'
import bcrypt from 'bcrypt'

export const authController = {
  register: async (req, res, next) => {
    const { username, password } = req.body

    if (!username?.trim() || !password) {
      return res.status(400).json({ error: '⚠️Username and password required' })
    }

    const existing = await usersService.getUserByName(username)
    if (existing) {
      return res.status(409).json({ error: '⚠️Username already taken' })
    }

    try {
      const encryptedPass = await bcrypt.hash(password, 10)

      const user = await usersService.createUser({
        username: username.trim(),
        password: encryptedPass,
      })
      res.status(200).json(user)
    } catch (err) {
      next(new Error(`⛔ DB Error: ${err.message}`))
    }
  },

  login: async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(new Error(`⚠️ Authenticate Error: ${err.message}`))

      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || '⚠️Incorrect username or password' })
      }

      try {
        req.logIn(user, (err) => {
          if (err) return next(new Error(`⚠️ Login Error: ${err.message}`))
          return res.json({ message: '✅Logged in via local: ', user }) //⚠️
        })
      } catch (err) {
        return next(new Error(`⛔ DB Error: ${err.message}`))
      }
    })(req, res, next)
  },

  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(new Error(`⛔ Logout Error: ${err.message}`))
      req.session?.destroy(() => {
        res.clearCookie('connect.sid')
        res.status(200).json({ message: '✅Logged out' })
      })
    })
  },
}
