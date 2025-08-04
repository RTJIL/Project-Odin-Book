'use client'

import styles from './post.module.css'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { User, Post, Like } from '@/utils/types'
import { getPostById } from '../services/api'
import Image from 'next/image'
import Dropdown from '../feed/components/dropdown/Dropdown'
import UserMeta from '../feed/components/userMeta/UserMeta'
import PostContent from '../feed/components/postContent/PostContent'
import Loading from '@/components/loading/Loading'
import { follow, unfollow } from '../services/api'
import CommentsWritter from './components/commentsWritter/commentsWritter'

interface PostParams {
  currentUser: User
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  loading: boolean
  loadingAuthors: Record<string, boolean>
  onToggleFollow: (authorId: string) => void
}

export default function Post({
  currentUser,
  loading,
  onToggleFollow,
}: PostParams) {
  const [post, setPost] = useState<Post | null>(null)
  const [isEditedId, setIsEditedId] = useState<number | null>(null)
  const [userLikes, setUserLikes] = useState<Like[]>([])

  const params = useParams<{ postId: string }>()

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

  console.log(params.postId)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(params.postId)
        setPost(post)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPost()
  }, [params.postId])

  useEffect(() => {
    setUserLikes(currentUser.likes)
  }, [currentUser.likes])

  const handleToggleFollow = useCallback(
    async (authorId: string) => {
      setLoadingAuthors((prev) => ({ ...prev, [authorId]: true }))

      // optimistic toggle
      setFollowingSet((prev) => {
        const next = new Set(prev)
        prev.has(authorId) ? next.delete(authorId) : next.add(authorId)
        return next
      })

      try {
        // derive current state from previous (not outer stale)
        const isNowFollowing = followingSet.has(authorId) // still stale here
        // instead, fetch current from the updater:
        const shouldUnfollow = (() => {
          // if previous had it, we just removed it -> we should unfollow
          return followingSet.has(authorId)
        })()

        if (shouldUnfollow) await unfollow(authorId)
        else await follow(authorId)
      } catch (err) {
        // rollback: flip again
        setFollowingSet((prev) => {
          const next = new Set(prev)
          prev.has(authorId) ? next.delete(authorId) : next.add(authorId)
          return next
        })
        console.warn('Follow toggle failed', err)
      } finally {
        setLoadingAuthors((prev) => ({ ...prev, [authorId]: false }))
      }
    },
    [followingSet]
  )

  if (loading) return <Loading />

  return (
    post && (
      <article key={post.id} className={styles.article}>
        <Image
          src={post.author.avatarUrl ?? '/default-avatar.png'}
          alt="avatar"
          width={40}
          height={40}
          style={{ borderRadius: '50%', userSelect: 'none' }}
        />
        <div className={styles.info}>
          <Dropdown
            post={post}
            currentUser={currentUser}
            setIsEditedId={setIsEditedId}
            setPosts={(updater) => {
              setPost((prev) => {
                if (!prev) return prev
                const updatedArray =
                  typeof updater === 'function' ? updater([prev]) : updater
                return updatedArray[0] ?? prev
              })
            }}
          />

          <UserMeta
            post={post}
            currentUser={currentUser}
            isFollow={followingSet.has(post.authorId)}
            followLoading={!!loadingAuthors[post.authorId]}
            onToggleFollow={() => onToggleFollow(post.authorId)}
          />

          <PostContent
            post={post}
            isEdited={isEditedId === post.id}
            setIsEditedId={setIsEditedId}
            userLikes={userLikes}
            onUpdate={(updated) =>
              setPost((prev) =>
                prev && prev.id === updated.id ? updated : prev
              )
            }
            isComment={true}
          />

          <CommentsWritter />
        </div>
      </article>
    )
  )
}
