import styles from './dropdown.module.css'
import type { Post, User } from '@/utils/types'
import { useState, useRef, useCallback } from 'react'
import { TbDots } from 'react-icons/tb'
import { MdDelete, MdEdit } from 'react-icons/md'
import { useOutsideClick } from '../../hooks/hooks'
import { deletePost } from '../../../services/api'

interface DropdownProps {
  post: Post
  currentUser: User
  setIsEditedId: React.Dispatch<React.SetStateAction<number | null>>
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function Dropdown({
  post,
  currentUser,
  setIsEditedId,
  setPosts,
}: DropdownProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const isDropdownOpen = openDropdownId === String(post.id)

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id)
  }

  const close = useCallback(() => setOpenDropdownId(null), [])
  useOutsideClick(wrapperRef, close)

  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement>,
    postId: string | number
  ) => {
    e.stopPropagation()
    setOpenDropdownId(null)
    setIsEditedId(typeof postId === 'number' ? postId : Number(postId))
    console.log('edit', postId)
  }

  const handleDelete = () => {
    deletePost(Number(post.id))
    setPosts((prev) => prev.filter((p) => p !== post))
  }

  return (
    currentUser.id === post.author.id && (
      <div ref={wrapperRef} className={styles.dropdown}>
        <div
          className={styles.dotsWrapper}
          onClick={() => toggleDropdown(String(post.id))}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpenDropdownId(isDropdownOpen ? null : String(post.id))
            }
          }}
          aria-haspopup="true"
          aria-expanded={isDropdownOpen}
          role="button"
        >
          <TbDots className={styles.dots} />
        </div>
        {isDropdownOpen && (
          <div className={styles.menu}>
            <button
              className={styles.edit}
              onClick={(e) => handleEdit(e, post.id)}
            >
              <MdEdit />
              <span>Edit</span>
            </button>

            <button className={styles.delete} onClick={handleDelete}>
              <MdDelete />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    )
  )
}
