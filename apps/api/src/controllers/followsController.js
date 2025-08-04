import { followsService } from '../services/followsService.js'

export const followsController = {
  getFollowers: async (req, res, next) => {
    const { followingId } = req.body

    try {
      const followers = await followsService.getFollowers(followingId)
      res.status(200).json(followers)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getFollowing: async (req, res, next) => {
    const followerId = req.user.id

    try {
      const following = await followsService.getFollowing(followerId)
      res.status(200).json(following)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  createFollow: async (req, res, next) => {
    const followerId = req.user.id
    const { followingId } = req.params

    try {
      const follow = await followsService.createFollow({
        followerId,
        followingId,
      })
      res.status(200).json(follow)
    } catch (err) {
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Already following this user' })
      }
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  deleteFollow: async (req, res, next) => {
    const followerId = req.user.id
    const { followingId } = req.params

    try {
      const follow = await followsService.deleteFollow({
        followerId,
        followingId,
      })
      res.status(200).json(follow)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },
}
