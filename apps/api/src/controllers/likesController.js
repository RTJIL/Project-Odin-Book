import { likesService } from '../services/likesService.js'

export const likesController = {
  createLike: async (req, res, next) => {
    const userId = req.user.id
    const { postId } = req.params

    try {
      const like = await likesService.createLike({
        postId: Number(postId),
        userId,
      })
      res.status(200).json(like)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getLikesByUserId: async (req, res, next) => {
    const userId = req.user.id

    try {
      const likes = await likesService.getLikesByUserId(userId)
      res.status(200).json(likes)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  deleteLike: async (req, res, next) => {
    const userId = req.user.id // edited⚠️
    const { postId } = req.params

    try {
      const like = await likesService.deleteLike(Number(postId), userId)
      res.status(200).json(like)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },
}
