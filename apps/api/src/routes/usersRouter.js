import { Router } from 'express'
import { usersController } from '../controllers/usersController.js'
import { isAuth } from '../middlewares/isAuth.js'

export const usersRouter = Router()

usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:userId', usersController.getUserById)
