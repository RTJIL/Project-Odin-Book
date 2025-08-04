'use client'

import styles from './home.module.css'
import PostWriter from './components/postWritter/PostWriter'
import PostsList from './components/postsList/PostsList'
import { useState, useEffect, useCallback } from 'react'
import { getPosts, follow, unfollow } from '../services/api' // adjust path
import type { User, Post } from '@/utils/types'

interface FeedProps {
  currentUser: User
}

export default function Feed({ currentUser }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  // follow state lifted here
  const [followingSet, setFollowingSet] = useState<Set<string>>(
    () => new Set(currentUser.following.map((f: any) => f.followingId))
  )
  const [loadingAuthors, setLoadingAuthors] = useState<Record<string, boolean>>(
    {}
  )

  useEffect(() => {
    setFollowingSet(
      new Set(currentUser.following.map((f: any) => f.followingId))
    )
  }, [currentUser.following])

  useEffect(() => {
    const fetch = async () => {
      try {
        const posts = await getPosts()
        setPosts(posts)
      } catch (e) {
        console.error(e)
      } finally {
        setLoadingPosts(false)
      }
    }
    fetch()
  }, [])

  const handleToggleFollow = useCallback(
    async (authorId: string) => {
      setLoadingAuthors((prev) => ({ ...prev, [authorId]: true }))

      setFollowingSet((prev) => {
        const next = new Set(prev)
        const isFollow = prev.has(authorId)
        isFollow ? next.delete(authorId) : next.add(authorId)
        return next
      })

      try {
        const isFollow = followingSet.has(authorId)
        if (isFollow) await unfollow(authorId)
        else await follow(authorId)
      } catch (err) {
        setFollowingSet((prev) => {
          const next = new Set(prev)
          const isFollow = prev.has(authorId)
          isFollow ? next.delete(authorId) : next.add(authorId)
          return next
        })
        console.warn('Follow toggle failed', err)
      } finally {
        setLoadingAuthors((prev) => ({ ...prev, [authorId]: false }))
      }
    },
    [followingSet]
  )

  return (
    <main className={styles.container}>
      <PostWriter setPosts={setPosts} />
      <PostsList
        currentUser={currentUser}
        posts={posts}
        setPosts={setPosts}
        loading={loadingPosts}
        followingSet={followingSet}
        loadingAuthors={loadingAuthors}
        onToggleFollow={handleToggleFollow}
      />
    </main>
  )
}
