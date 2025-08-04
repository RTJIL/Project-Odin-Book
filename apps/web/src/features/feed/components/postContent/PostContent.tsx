import { useState, useEffect, useRef } from 'react'
import styles from './postContent.module.css'
import { Like, Post } from '@/utils/types'
import { FaHeart, FaComment } from 'react-icons/fa'
import Image from 'next/image'
import { editPost, likePost, unlikePost } from '../../../services/api'
import { useRouter } from 'next/navigation'

type Props = {
  post: Post
  userLikes: Like[]
  isEdited: boolean
  setIsEditedId: React.Dispatch<React.SetStateAction<number | null>>
  onUpdate: (updated: Post) => void
  isComment: boolean
}

export default function PostContent({
  post,
  userLikes,
  isEdited,
  setIsEditedId,
  onUpdate,
  isComment
}: Props) {
  const [draftContent, setDraftContent] = useState(post.content)
  const [isLiked, setIsLiked] = useState(
    userLikes.some((like) => like.postId === post.id)
  )
  const [likes, setLikes] = useState(post.likes.length)
  const [likeLoading, setLikeLoading] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const prevContentRef = useRef(post.content)

  const router = useRouter()

  const comments = post.comments.length

  console.log(post)

  useEffect(() => {
    setDraftContent(post.content)
  }, [post.content])

  useEffect(() => {
    if (isEdited) {
      prevContentRef.current = post.content
      setDraftContent(post.content)
    }
  }, [isEdited, post.content])

  useEffect(() => {
    setDraftContent(post.content)
  }, [post.content])

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (editLoading) return

    e.preventDefault()

    if (draftContent === prevContentRef.current) {
      setIsEditedId(null)
      return
    }

    setEditLoading(true)
    try {
      const updated = await editPost(Number(post.id), draftContent)
      onUpdate(updated)
      setIsEditedId(null)
    } catch (err) {
      console.error('Edit failed', err)
    } finally {
      setEditLoading(false)
    }
  }

  const handleLike = async () => {
    if (likeLoading) return
    setLikeLoading(true)

    setIsLiked((prev) => !prev)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))

    try {
      if (isLiked) {
        await unlikePost(post.id)
      } else {
        await likePost(post.id)
      }
    } catch (err) {
      console.error('Like/unlike failed', err)
      setIsLiked((prev) => !prev)
      setLikes((prev) => (isLiked ? prev + 1 : prev - 1))
    } finally {
      setLikeLoading(false)
    }
  }

  const handleCancel = () => {
    setDraftContent(prevContentRef.current)
    setIsEditedId(null)
  }

  const handleComment = () => {
    router.push(`/post/${post.id}`)
  }

  return (
    <div className={styles['content-container']}>
      {isEdited ? (
        <form
          onSubmit={handleEdit}
          className={styles.form}
          aria-label="Edit post content"
        >
          <label htmlFor="content" className="sr-only"></label>
          <div className={styles['input-wrapper']}>
            <input
              type="text"
              name="content"
              id="content"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              aria-label="Post content"
              placeholder="Update your post..."
            />
          </div>
          <div className={styles['form-actions']}>
            <button type="submit" className={styles.primary}>
              Save
            </button>
            <button
              type="button"
              className={styles.secondary}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <span className={styles.text}>{draftContent}</span>
      )}

      {post.imgUrl && (
        <div className={styles.imageWrapper}>
          <Image
            src={`${post.imgUrl}`}
            alt="very nice picture"
            fill
            style={{ objectFit: 'cover' }}
            unoptimized
          />
        </div>
      )}
      <div className={styles['content-actions']}>
        <button
          className={`${styles.iconBtn} ${isLiked ? styles.liked : ''} `}
          onClick={handleLike}
          disabled={likeLoading}
        >
          <FaHeart /> {likes}
        </button>
        <button className={styles.iconBtn} onClick={handleComment} disabled={isComment}>
          <FaComment /> {comments}
        </button>
      </div>
    </div>
  )
}
