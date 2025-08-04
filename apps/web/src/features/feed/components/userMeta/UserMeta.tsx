import styles from './userMeta.module.css'
import type { Post, User } from '@/utils/types'

interface UserMetaProps {
  post: Post
  currentUser: User
  isFollow: boolean
  followLoading: boolean
  onToggleFollow: () => void
}

export default function UserMeta({
  post,
  currentUser,
  isFollow,
  followLoading,
  onToggleFollow,
}: UserMetaProps) {
  return (
    <div className={styles['follow-username']}>
      <span>{post.author.username}</span>
      {currentUser.id !== post.author.id && (
        <button
          className={`${styles.follow} ${isFollow ? styles.true : ''} ${followLoading ? styles.disabled : ''}`}
          onClick={onToggleFollow}
          disabled={followLoading}
          aria-busy={followLoading}
          aria-label={isFollow ? 'Unfollow user' : 'Follow user'}
        >
          {followLoading ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : isFollow ? (
            'Unfollow'
          ) : (
            'Follow'
          )}
        </button>
      )}
    </div>
  )
}
