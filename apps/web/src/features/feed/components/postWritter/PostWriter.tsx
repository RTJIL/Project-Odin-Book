import styles from './postWriter.module.css'
import React, { useRef, useState } from 'react'
import { FaImage } from 'react-icons/fa'
import { RxCross2 } from 'react-icons/rx'
import { Post } from '@/utils/types'
import { createPost } from '../../../services/api'
import Image from 'next/image'
import sizeConverter from '@/utils/sizeConverter'
import isValidHttpUrl from '@/utils/isValidHttpUrl'

interface PostWriteProps {
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function PostWriter({ setPosts }: PostWriteProps) {
  const fileRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [loadingSend, setLoadingSend] = useState(false)

  const [selectfile, setSelectfile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{ size: number } | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)

  const [text, setText] = useState('')
  const max = 280

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!text.trim() && previewUrl === null) return

    try {
      setLoadingSend(true)

      const imageToSend =
        selectfile ??
        (previewUrl && isValidHttpUrl(previewUrl) ? previewUrl : null)

      const newPost = await createPost(text.trim(), imageToSend)
      setPosts((prev) => [newPost, ...prev])
      setText('')
      setSelectfile(null)
      setPreviewUrl(null)
    } catch (err) {
      console.error('Failed to create post:', err)
    } finally {
      setLoadingSend(false)
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current
    if (!textarea) return

    setText(e.target.value)

    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError(null)
    const file = e.target.files?.[0]
    if (!file) return

    const allowedExts = ['png', 'jpg', 'jpeg', 'gif']
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!ext || !allowedExts.includes(ext)) {
      console.warn('Unsupported file type:', file.type)
      setImageError('Only PNG / JPG / GIF allowed.')
      setPreviewUrl(null)
      setFileInfo(null)
      return
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    setSelectfile(file)
    setFileInfo({ size: file.size })
  }

  const handleCancel = () => {
    setPreviewUrl(null)
  }

  return (
    <div className={styles['form-container']}>
      <form onSubmit={handleSubmit} method="POST" className={styles.form}>
        <div className={styles['textarea-container']}>
          <label htmlFor="post-content"></label>
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            value={text}
            className={`${styles.textarea} ${(text.length >= max || imageError) && styles.error}`}
            name="content"
            id="post-content"
            placeholder="What’s happening?"
            rows={1}
          ></textarea>
          <span className={styles.counter}>
            {text.length} / {max}
          </span>
        </div>

        <div className={styles.actions} aria-label="actions-container">
          {previewUrl ? (
            <section className={styles['image-detail']}>
              <div className={styles.close}>
                <button className={styles.cancel} onClick={handleCancel}>
                  <RxCross2 size={'30px'} />
                </button>
                <Image
                  src={previewUrl}
                  alt="image"
                  className={styles.image}
                  width={100}
                  height={100}
                />
                <ul>
                  <li>
                    Size: {fileInfo ? sizeConverter(fileInfo.size) : 'N/A'}
                  </li>
                </ul>
              </div>
            </section>
          ) : (
            <>
              <button
                type="button"
                className={styles.iconBtn}
                aria-label="Attach image"
                onClick={() => fileRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    fileRef.current?.click()
                  }
                }}
              >
                <span className={styles.icon}>
                  <FaImage size={'20px'} />
                </span>
              </button>

              {imageError !== null && (
                <span style={{ marginBottom: '4px' }}>Error: {imageError}</span>
              )}

              <input
                id="file"
                type="file"
                onChangeCapture={handleFileChange}
                accept="image/png, image/gif, image/jpeg"
                ref={(el) => {
                  fileRef.current = el
                }}
                className={styles.hiddenInput}
                aria-label="Attach image"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    console.log('Selected:', e.target.files[0])
                  }
                }}
                disabled={loadingSend}
              />
            </>
          )}

          <div className={styles.spacer} />

          <button
            className={`${styles.post} ${loadingSend ? styles.sending : ''}`}
            type="submit"
            disabled={
              loadingSend ||
              (!text.trim() && !selectfile) ||
              text.length >= max ||
              imageError !== null
            }
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
