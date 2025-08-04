import 'dotenv/config'
import passport from 'passport'
import { usersService } from '../services/usersService.js'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await usersService.getUserByGoogleId(profile.id)
        if (!user) {
          const email = profile.emails?.[0]?.value
          if (email) {
            const existingUser = await usersService.getUserByEmail(email)
            if (existingUser) {
              existingUser.googleId = profile.id
              user = await usersService.saveUser(existingUser)
              return done(null, user)
            }
          }
          user = await usersService.createUserFromGoogleProfile(profile)
        }
        done(null, user)
      } catch (err) {
        done(err)
      }
    }
  )
)

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersService.getUserByName(username)
      if (!user) return done(null, false, { message: '⚠️User not found' })

      const passMatch = await bcrypt.compare(password, user.password)
      if (!passMatch)
        return done(null, false, { message: '⚠️Incorrect password.' })

      return done(null, user)
    } catch (err) {
      done(err)
    }
  })
)

passport.serializeUser((user, done) => {
  console.log('serializeUser got:', user)
  if (!user || !user.id) return done(new Error('Invalid user in serializeUser'))
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  console.log('deserializeUser id:', id)
  try {
    const user = await usersService.getUserById(id)
    if (!user) return done(null, false, { message: '⚠️User not found' })
    done(null, user)
  } catch (err) {
    done(err)
  }
})

export default passport

// http://localhost:3000/api/auth/google
