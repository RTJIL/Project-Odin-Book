import { prisma } from '../db/db.js'

export const likesService = {
  createLike: (data) => prisma.like.create({ data: data }),

  getLikesByUserId: (userId) =>
    prisma.like.findMany({ where: { userId }, include: { post: true } }),

  deleteLike: (postId, userId) =>
    prisma.like.delete({ where: { postId_userId: { postId, userId } } }),
}
