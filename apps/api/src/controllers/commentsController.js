import { commentsService } from '../services/commentsService.js'

export const commentsController = {
  createComment: async (req, res, next) => {
    const authorId = req.user.id
    const { postId } = req.params
    const { content } = req.body

    try {
      const comment = await commentsService.createComment({
        content,
        postId: Number(postId),
        authorId,
      })
      return res.status(200).json(comment)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  updateComment: async (req, res, next) => {
    const { commentId } = req.params
    const { content } = req.body

    try {
      const comment = await commentsService.updateComment(Number(commentId), {
        content,
      })
      return res.status(200).json(comment)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  deleteComment: async (req, res, next) => {
    const { commentId } = req.params

    try {
      const comment = await commentsService.deleteComment(Number(commentId))
      return res.status(200).json(comment)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },
}
