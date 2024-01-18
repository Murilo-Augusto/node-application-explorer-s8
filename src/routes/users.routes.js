import { Router } from 'express'

import UsersController from '../controllers/UsersController.js'

const userRoutes = Router()

const usersController = new UsersController()

userRoutes.post('/', usersController.create)
userRoutes.put('/:id', usersController.update)

export default userRoutes