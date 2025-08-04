import styles from './commentsWriter.module.css'
import React, { useRef, useState, ChangeEvent } from 'react'
import { Post } from '@/utils/types'
import { commentPost } from '../../../services/api'

interface CommentsWriterProps {
  setComments: React.Dispatch<React.SetStateAction<Post[]>>
  post: Post
}

export default function CommentsWriter({
  setComments,
  post,
}: CommentsWriterProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [loadingSend, setLoadingSend] = useState(false)
  const [text, setText] = useState('')

  const max = 280
  const isOverLimit = text.length > max

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      setLoadingSend(true)
      const trimmed = text.trim()
      const result = await commentPost(post.id, trimmed)

      // normalize to single Post
      const newComment: Post = Array.isArray(result) ? result[0] : result

      setComments((prev) => [newComment, ...prev])
      setText('')
    } catch (err) {
      console.error('Failed to create comment:', err)
    } finally {
      setLoadingSend(false)
    }
  }

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const value = e.target.value
    setText(value)

    // auto-resize
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  return (
    <div className={styles['form-container']}>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className={styles.form}
        aria-label="Write a comment"
      >
        <div className={styles['textarea-container']}>
          {/* visually hidden label for accessibility could be added here if needed */}
          <textarea
            ref={textareaRef}
            onChange={handleInput}
            value={text}
            className={[
              styles.textarea,
              isOverLimit ? styles.error : '',
              loadingSend ? styles.disabled : '',
            ].join(' ')}
            name="content"
            id="post-content"
            placeholder="What’s happening?"
            rows={1}
            aria-label="Comment content"
            aria-invalid={isOverLimit}
            maxLength={max + 100} // graceful allowance, but we guard manually
            disabled={loadingSend}
          ></textarea>
          <span className={styles.counter}>
            {text.length} / {max}
          </span>
        </div>

        <div className={styles.actions} aria-label="actions-container">
          <div className={styles.spacer} />

          <button
            className={`${styles.post} ${loadingSend ? styles.sending : ''}`}
            type="submit"
            disabled={loadingSend || !text.trim() || isOverLimit}
          >
            {loadingSend ? (
              <div className={styles.spinner} aria-label="loading">
                <div className={styles.dot} />
                <div className={styles.dot} />
                <div className={styles.dot} />
              </div>
            ) : (
              'Post'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
