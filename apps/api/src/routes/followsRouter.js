import { Router } from 'express'
import { followsController } from '../controllers/followsController.js'

export const followsRouter = Router()

followsRouter.get('/followers', followsController.getFollowers)
followsRouter.get('/following', followsController.getFollowing)

followsRouter.post('/:followingId', followsController.createFollow)
followsRouter.delete('/:followingId', followsController.deleteFollow)