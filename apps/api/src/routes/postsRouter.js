import { Router } from 'express'
import { postsController } from '../controllers/postsController.js'
import { upload } from '../config/multer.js'

export const postsRouter = Router()

postsRouter.get('/', postsController.getAllPosts)
postsRouter.get('/own', postsController.getOwnPosts)
postsRouter.get('/:postId', postsController.getPostById)

postsRouter.post('/', upload.single('image'), postsController.createPost)
postsRouter.patch('/:postId', postsController.updatePost)
postsRouter.delete('/:postId', postsController.deletePost)
