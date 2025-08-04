// Comments.tsx
import styles from './comments.module.css'
import Image from 'next/image'
import { Comment } from '@/utils/types'

interface CommentsProps {
  comments: Comment[]
}

function formatTime(iso: string) {
  const dt = new Date(iso)
  return dt.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}

export default function Comments({ comments }: CommentsProps) {
  if (!comments || comments.length === 0) {
    return <div className={styles.empty}>No comments yet</div>
  }

  return (
    <div className={styles.container}>
      {comments.map((comment) => (
        <div key={comment.id} className={styles.comment}>
          <div className={styles.avatar}>
            <Image
              src={comment.author.avatarUrl || '/default-avatar.png'}
              alt={`${comment.author.username} avatar`}
              width={32}
              height={32}
              style={{ borderRadius: '50%' }}
              priority={false}
            />
          </div>
          <div className={styles.body}>
            <div className={styles.header}>
              <span className={styles.username}>{comment.author.username}</span>
              <span className={styles.time}>{formatTime(comment.createdAt)}</span>
            </div>
            <div className={styles.text}>{comment.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
