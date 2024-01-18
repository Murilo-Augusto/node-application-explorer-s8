import { Router } from 'express'

import userRoutes from './users.routes.js'
import movieRoutes from './movies.routes.js'

const routes = Router()
routes.use('/users', userRoutes)
routes.use('/movies', movieRoutes)

export default routes