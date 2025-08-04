// src/features/feed/types.ts
export interface Post {
  id: string | number
  authorId: string
  author: {
    id: string | number
    name: string
    avatarUrl?: string
    username?: string
  }
  likes: Array<{ post: Post; user: User }>
  comments: Array<{
    content: string
    post: Post
    author: User
    createdAt: string
  }>
  content: string
  imgUrl: string
  createdAt: string
  updatedAt?: string
  media?: Array<{
    type: 'image' | 'video' | 'gif'
    url: string
    alt?: string
  }>
}

export interface Like {
  postId_userId: string
  user: User
  userId: number
  post: Post
  postId: number
}

export type User = {
  id: string
  username: string
  email: string
  avatarUrl?: string
  createdAt: string
  comments: Comment[]
  following: Follow[]
  likes: Like[]
}

export interface Follow {
  followingId: string
  following: User
  followerId: string
  follower: User
}
