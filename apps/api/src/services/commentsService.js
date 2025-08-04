import { prisma } from '../db/db.js'

export const commentsService = {
  createComment: (data) => prisma.comment.create({ data: data }),

  updateComment: (id, data) =>
    prisma.comment.update({ where: { id }, data: data }),

  deleteComment: (id) => prisma.comment.delete({ where: { id } }),
}
