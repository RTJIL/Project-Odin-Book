import { Router } from 'express'
import { likesController } from '../controllers/likesController.js'

export const likesRouter = Router()

likesRouter.get('/', likesController.getLikesByUserId)

likesRouter.post('/:postId', likesController.createLike)

likesRouter.delete('/:postId', likesController.deleteLike) //edited⚠️
