'use client'

import styles from './Profile.module.css'
import { User, Like, Post } from '@/utils/types'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { getUserById } from '../services/api'
import Dropdown from '../feed/components/dropdown/Dropdown'
import UserMeta from '../feed/components/userMeta/UserMeta'
import PostContent from '../feed/components/postContent/PostContent'
import { follow, unfollow } from '../services/api'

interface ProfileProps {
  currentUser: User
}

export default function Profile({ currentUser }: ProfileProps) {
  const [isEditedId, setIsEditedId] = useState<number | null>(null)
  const [userLikes, setUserLikes] = useState<Like[]>([])
  const [posts, setPosts] = useState<Post[]>([])

  const [user, setUser] = useState<User | null>(null)
  const params = useParams()
  const userId = params?.userId

  useEffect(() => {
    if (!userId) return
    const fetch = async () => {
      try {
        const user = await getUserById(userId)
        console.log(user)
        if (user) {
          setUser(user)
          setPosts(user.posts)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetch()
  }, [userId])

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

  if (!user) return null

  return (
    <div className={styles.card}>
      <div className={styles.avatarWrapper}>
        <Image
          src={user.avatarUrl || '/default-avatar.png'}
          alt={`${user.username}'s avatar`}
          width={100}
          height={100}
          className={styles.avatar}
        />
      </div>

      <h2 className={styles.username}>@{user.username}</h2>
      {/* <p className={styles.bio}>{user.bio || 'No bio yet...'}</p> */}

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{user.posts?.length ?? 0}</span>
          <span className={styles.statLabel}>Posts</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>
            {user.followers?.length ?? 0}
          </span>
          <span className={styles.statLabel}>Followers</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>
            {user.following?.length ?? 0}
          </span>
          <span className={styles.statLabel}>Following</span>
        </div>
      </div>

      <div className={styles.posts}>
        {user?.posts.map((post) => (
          <article key={post.id} className={styles.article}>
            <Image
              src={post.author.avatarUrl ?? '/default-avatar.png'}
              alt="avatar"
              width={40}
              height={40}
              style={{ borderRadius: '50%', userSelect: 'none' }}
            />
            <div className={styles.info}>

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
                  setPosts((prev) =>
                    prev.map((p) => (p.id === updated.id ? updated : p))
                  )
                }
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
