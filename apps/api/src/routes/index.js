import { Router } from 'express'
import { usersRouter } from './usersRouter.js'
import { authRouter } from './authRouter.js'
import { postsRouter } from './postsRouter.js'
import { commentsRouter } from './commentsRouter.js'
import { likesRouter } from './likesRouter.js'
import { followsRouter } from './followsRouter.js'

export const routes = Router()

routes.use('/users', usersRouter)
routes.use('/auth', authRouter)
routes.use('/posts', postsRouter)
routes.use('/comments', commentsRouter) 
routes.use('/likes', likesRouter) 
routes.use('/follows', followsRouter)
