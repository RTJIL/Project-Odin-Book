import { prisma } from '../db/db.js'

export const usersService = {
  getAllUsers: () => prisma.user.findMany(),

  createUser: (data) => prisma.user.create({ data: data }),

  saveUser: (user) =>
    prisma.user.update({ where: { id: user.id }, data: user }),

  getUserById: (id) =>
    prisma.user.findUnique({
      where: { id },
      include: {
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        comments: { select: { id: true, content: true, createdAt: true } },
        likes: { select: { postId: true, userId: true } },
      },
    }),

  getUserByName: (username) =>
    prisma.user.findUnique({
      where: { username },
      include: {
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        comments: { select: { id: true, content: true, createdAt: true } },
        likes: { select: { postId: true, userId: true } },
      },
    }),

  getUserByEmail: (email) => prisma.user.findUnique({ where: { email } }),

  getUserByGoogleId: (googleId) =>
    prisma.user.findUnique({
      where: { googleId },
      include: {
        following: {
          include: {
            following: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
              },
            },
          },
        },
        comments: { select: { id: true, content: true, createdAt: true } },
        likes: { select: { postId: true, userId: true } },
      },
    }),

  createUserFromGoogleProfile: (profile) =>
    prisma.user.create({
      data: {
        googleId: profile.id,
        username: profile.displayName || `user_${Date.now()}`,
        email: profile.emails?.[0]?.value || null,
        avatarUrl: profile.photos?.[0]?.value || undefined,
      },
    }),
}
