import { prisma } from '../db/db.js'

export const followsService = {
  getFollowers: (followingId) =>
    prisma.follow.findMany({
      where: { followingId },
      orderBy: { createdAt: 'desc' },
      include: { follower: true },
    }),

  getFollowing: (followerId) =>
    prisma.follow.findMany({
      where: { followerId },
      orderBy: { createdAt: 'desc' },
      include: { following: true },
    }),

  createFollow: (data) => prisma.follow.create({ data: data }),

  deleteFollow: ({ followerId, followingId }) =>
    prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    }),
}