import { prisma } from '../db/db.js'

export const postsService = {
  getAllPosts: ({ page = 1, limit = 10 }) =>
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        comments: { include: { author: true } },
        likes: true,
      },
    }),

  getOwnPosts: ({ page = 1, limit = 10, authorId }) =>
    prisma.post.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        comments: { include: { author: true } },
      },
    }),

  getPostById: (id) =>
    prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        comments: { include: { author: true } },
        likes: true,
      },
    }),

  updatePost: (id, data) =>
    prisma.post.update({
      where: { id },
      data: data,
      include: { author: true, likes: true, comments: true },
    }),

  createPost: (data) =>
    prisma.post.create({
      data: data,
      include: { author: true, likes: true, comments: true },
    }),

  deletePost: (id) => prisma.post.delete({ where: { id } }),
}
