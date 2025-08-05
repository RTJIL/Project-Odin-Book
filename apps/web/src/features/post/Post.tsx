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
  loading: boolean
}

export default function Post({ currentUser, loading }: PostParams) {
  const [comments, setComments] = useState<Comment[]>([])
  const [post, setPost] = useState<Post | null>(null)
  const [isEditedId, setIsEditedId] = useState<number | null>(null)
  const [userLikes, setUserLikes] = useState<Like[]>([])

  const params = useParams()
  const postId = params?.postId

  console.log('Current user: ', currentUser)

  const [loadingAuthors, setLoadingAuthors] = useState<Record<string, boolean>>(
    {}
  )

  useEffect(() => {
    if (!params?.postId) return

    const fetchPost = async () => {
      try {
        const post = await getPostById(postId)
        setPost(post)

        const normalized: Comment[] = post.comments.map(
          (c: any, idx: number) => ({
            id: c.id ?? c._id ?? String(idx), // prefer real id, fallback to index (less ideal)
            content: c.content,
            author: c.author,
            post: post,
            createdAt: c.createdAt,
          })
        )

        setComments(normalized)
      } catch (err) {
        console.error(err)
      }
    }
    fetchPost()
  }, [postId])

  useEffect(() => {
    setUserLikes(currentUser.likes)
  }, [currentUser.likes])

  const handleToggleFollow = async (authorId: string) => {
    if (post === null) return

    const isFollowing = currentUser.following.some(
      (follow) => follow.followingId === post.authorId
    )

    setLoadingAuthors((prev) => ({ ...prev, [authorId]: true }))

    try {
      if (isFollowing) {
        await unfollow(authorId)
        // remove from currentUser.following
        currentUser.following = currentUser.following.filter(
          (follow) => follow.followingId !== post.authorId
        )
      } else {
        const res = await follow(authorId)
        // add to currentUser.following
        currentUser.following.push({
          id: res.id, // Provide a unique id if available, or leave as empty string if not
          following: post.author,
          follower: currentUser,
          followingId: post.authorId,
          followerId: currentUser.id,
        })
      }
    } catch (err) {
      console.error('Toggle follow failed:', err)
    } finally {
      setLoadingAuthors((prev) => ({ ...prev, [authorId]: false }))
    }
  }

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
            isFollow={currentUser.following.some(
              (follow) => follow.followingId === post.authorId
            )}
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

          <CommentsWritter setComments={setComments} post={post} />

          <Comments comments={comments} />
        </div>
      </article>
    )
  )
}
