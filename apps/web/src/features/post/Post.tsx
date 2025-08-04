'use client'

import styles from './post.module.css'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { User, Post, Like, Comment } from '@/utils/types'
import { getPostById } from '../services/api'
import Image from 'next/image'
import Dropdown from '../feed/components/dropdown/Dropdown'
import UserMeta from '../feed/components/userMeta/UserMeta'
import PostContent from '../feed/components/postContent/PostContent'
import Loading from '@/components/loading/Loading'
import { follow, unfollow } from '../services/api'
import CommentsWritter from './components/commentsWritter/commentsWritter'
import Comments from './components/comments/Comments'

interface PostParams {
  currentUser: User
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  loading: boolean
  loadingAuthors: Record<string, boolean>
  onToggleFollow: (authorId: string) => void
}

export default function Post({ currentUser, loading }: PostParams) {
  const [comments, setComments] = useState<Comment[]>([])
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

      
      const normalized: Comment[] = post.comments.map((c: any, idx: number) => ({
        id: c.id ?? c._id ?? String(idx), // prefer real id, fallback to index (less ideal)
        content: c.content,
        author: c.author,
        post: post, 
        createdAt: c.createdAt,
      }))

      setComments(normalized)
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

      let didFollow = false
      setFollowingSet((prev) => {
        const next = new Set(prev)
        if (prev.has(authorId)) {
          next.delete(authorId)
          didFollow = false // we unfollowed
        } else {
          next.add(authorId)
          didFollow = true // we followed
        }
        return next
      })

      try {
        if (didFollow) {
          await follow(authorId)
        } else {
          await unfollow(authorId)
        }
      } catch (err) {
        // rollback
        setFollowingSet((prev) => {
          const next = new Set(prev)
          if (didFollow) {
            // we tried to follow but failed → remove
            next.delete(authorId)
          } else {
            // we tried to unfollow but failed → re-add
            next.add(authorId)
          }
          return next
        })
        console.warn('Follow toggle failed', err)
      } finally {
        setLoadingAuthors((prev) => ({ ...prev, [authorId]: false }))
      }
    },
    [] // no need to depend on followingSet because we use functional updater
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
            onToggleFollow={() => handleToggleFollow(post.authorId)}
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

          <CommentsWritter setComments={setComments} post={post}/>

          <Comments comments={comments}/>
        </div>
      </article>
    )
  )
}
