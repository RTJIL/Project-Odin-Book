import styles from './postsList.module.css'
import { useEffect, useState } from 'react'
import type { Post, User, Like } from '../../../../utils/types'
import Image from 'next/image'
import PostContent from '../postContent/PostContent'
import UserMeta from '../userMeta/UserMeta'
import Dropdown from '../dropdown/Dropdown'
import Loading from '@/components/loading/Loading'

interface PostsListProps {
  currentUser: User
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  loading: boolean
  followingSet: Set<string>
  loadingAuthors: Record<string, boolean>
  onToggleFollow: (authorId: string) => void
}

export default function PostsList({
  currentUser,
  posts,
  setPosts,
  loading,
  followingSet,
  loadingAuthors,
  onToggleFollow,
}: PostsListProps) {
  const [isEditedId, setIsEditedId] = useState<number | null>(null)
  const [userLikes, setUserLikes] = useState<Like[]>([])

  useEffect(() => {
    setUserLikes(currentUser.likes)
  }, [currentUser.likes])

  if (loading) return <Loading />

  return (
    <div className={styles.container}>
      {posts.map((post) => (
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
              setPosts={setPosts}
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
                setPosts((prev) =>
                  prev.map((p) => (p.id === updated.id ? updated : p))
                )
              }
            />
          </div>
        </article>
      ))}
    </div>
  )
}
