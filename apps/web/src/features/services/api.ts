import formatUrl from '@/utils/formatUrl'
import type { Post, Like } from '../../utils/types' // adjust path if needed

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE

const postUrl = `${formatUrl(BASE_URL as string)}api/posts`
const likeUrl = `${formatUrl(BASE_URL as string)}api/likes`
const commentUrl = `${formatUrl(BASE_URL as string)}api/comments`
const followUrl = `${formatUrl(BASE_URL as string)}api/follows`
const authUrl = `${formatUrl(BASE_URL as string)}api/auth`

if (!BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_BASE is not defined')
}

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(postUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }
  return res.json() as Promise<Post[]>
}

export async function getPostById(postId: string): Promise<Post> {
  const res = await fetch(`${postUrl}/${postId}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }
  return res.json() as Promise<Post>
}

export async function getLikes(): Promise<Like[]> {
  const res = await fetch(likeUrl, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }
  return res.json() as Promise<Like[]>
}

export async function createPost(
  content: string | null,
  previewUrlOrFile: string | File | null
): Promise<Post> {
  let res: Response

  if (previewUrlOrFile instanceof File) {
    const form = new FormData()
    form.append('content', content ?? '')
    form.append('image', previewUrlOrFile) // field name must match multer

    res = await fetch(postUrl, {
      method: 'POST',
      credentials: 'include',
      body: form, // DO NOT set Content-Type here
    })
  } else {
    res = await fetch(postUrl, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        imgUrl: previewUrlOrFile ?? null,
      }),
    })
  }

  if (!res.ok) {
    throw new Error(`Failed to create post: ${res.status} ${await res.text()}`)
  }
  return res.json()
}

export async function deletePost(postId: number): Promise<Post> {
  const res = await fetch(`${postUrl}/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post>
}

export async function editPost(postId: number, content: string): Promise<Post> {
  const res = await fetch(`${postUrl}/${postId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post>
}

export async function likePost(postId: string | number): Promise<Post[]> {
  const res = await fetch(`${likeUrl}/${postId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function unlikePost(postId: string | number): Promise<Post[]> {
  const res = await fetch(`${likeUrl}/${postId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function commentPost(
  postId: number,
  content: string
): Promise<Post[]> {
  const res = await fetch(`${commentUrl}/${postId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function editComment(
  commentId: number,
  content: string
): Promise<Post[]> {
  const res = await fetch(`${commentUrl}/${commentId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function deleteComment(commentId: number): Promise<Post[]> {
  const res = await fetch(`${commentUrl}/${commentId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function follow(followingId: string): Promise<Post[]> {
  const res = await fetch(`${followUrl}/${followingId}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function unfollow(followingId: string): Promise<Post[]> {
  const res = await fetch(`${followUrl}/${followingId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json() as Promise<Post[]>
}

export async function logout() {
  const res = await fetch(`${authUrl}/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Failed to fetch posts: ${res.status} ${text}`)
  }

  return res.json()
}
