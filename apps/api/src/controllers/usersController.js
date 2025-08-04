import { usersService } from '../services/usersService.js'

export const usersController = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await usersService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getUserById: async (req, res, next) => {
    const { userId } = req.params

    try {
      const user = await usersService.getUserById(userId)
      return res.status(200).json(user)
    } catch (err) {
      next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getUserByGoogleId: async (req, res, next) => {
    try {
      const users = await usersService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  createUserFromGoogleProfile: async (req, res, next) => {
    try {
      const users = await usersService.getAllUsers()
      return res.status(200).json(users)
    } catch (err) {
      next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },
}
