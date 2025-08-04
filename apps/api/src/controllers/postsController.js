import path from 'path'
import fs from 'node:fs/promises'
import { postsService } from '../services/postsService.js'
import { supabase } from '../config/supabase.js'
import getContentType from '../utils/getContentType.js'
import fetch from 'node-fetch'

export const postsController = {
  getAllPosts: async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const posts = await postsService.getAllPosts({ page, limit })
      res.status(200).json(posts)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getOwnPosts: async (req, res, next) => {
    console.log('user info', req.user)
    const authorId = req.user.id

    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10

      const post = await postsService.getOwnPosts({ page, limit, authorId })
      res.status(200).json(post)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  getPostById: async (req, res, next) => {
    const { postId } = req.params

    try {
      const post = await postsService.getPostById(Number(postId))
      res.status(200).json(post)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  createPost: async (req, res, next) => {
    try {
      const { content, imgUrl: remoteImgUrl = null } = req.body

      if (!content?.trim() && !req.file && !remoteImgUrl) {
        return res.status(400).json({ error: 'Post must have text or image.' })
      }

      let imgUrl = null

      // Helper to upload a buffer to Supabase and return public/signed URL
      async function uploadBufferToSupabase(buffer, ext) {
        const filename = `post_${Date.now()}${ext}`
        const storagePath = `public/${filename}`
        const contentType = getContentType(ext)

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('smp')
          .upload(storagePath, buffer, {
            cacheControl: '3600',
            upsert: false,
            contentType,
          })

        if (uploadError) {
          throw uploadError
        }

        // try to get public URL
        const { data: publicUrlData } = supabase.storage
          .from('smp')
          .getPublicUrl(storagePath)

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl
        }

        // fallback to signed URL if public not available
        const { data: signedUrlData, error: signedErr } = await supabase.storage
          .from('smp')
          .createSignedUrl(storagePath, 60 * 60) // 1h expiry

        if (signedErr) {
          console.warn('Failed to get signed URL, returning no URL:', signedErr)
          return null
        }
        return signedUrlData.signedUrl
      }

      if (remoteImgUrl) {
        // fetch remote image as buffer
        const resp = await fetch(remoteImgUrl)
        if (!resp.ok) throw new Error('Failed to fetch remote image')
        const ct = (resp.headers.get('content-type') || '').toLowerCase()
        if (!/^image\/(png|jpe?g|gif)/.test(ct)) {
          return res
            .status(400)
            .json({ error: 'Unsupported remote image type' })
        }
        const ext = ct.includes('png')
          ? '.png'
          : ct.includes('gif')
            ? '.gif'
            : '.jpg'
        const arrayBuffer = await resp.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        imgUrl = await uploadBufferToSupabase(buffer, ext)
      } else if (req.file) {
        // multer already wrote it to disk; read & upload then delete local copy
        const diskPath = req.file.path // assuming multer used diskStorage
        const ext = path.extname(req.file.originalname) || '.png'
        const fileBuffer = await fs.readFile(diskPath)
        try {
          imgUrl = await uploadBufferToSupabase(fileBuffer, ext)
        } finally {
          // cleanup local temp
          await fs.unlink(diskPath).catch(() => {})
        }
      }

      const post = await postsService.createPost({
        authorId: req.user?.id,
        content: content?.trim(),
        imgUrl,
      })

      res.status(200).json(post)
    } catch (err) {
      console.error('createPost error:', err)
      next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  updatePost: async (req, res, next) => {
    const { postId } = req.params
    const { content } = req.body

    try {
      const post = await postsService.updatePost(Number(postId), { content })
      res.status(200).json(post)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },

  deletePost: async (req, res, next) => {
    const { postId } = req.params

    try {
      const post = await postsService.deletePost(Number(postId))
      res.status(200).json(post)
    } catch (err) {
      return next(new Error(`⚠️ DB Error: ${err.message}`))
    }
  },
}
