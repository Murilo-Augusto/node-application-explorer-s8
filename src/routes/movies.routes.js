import { Router } from 'express'

import MoviesController from '../controllers/MoviesController.js'

const movieRoutes = Router()

const moviesController = new MoviesController()

movieRoutes.post('/:user_id', moviesController.create)
movieRoutes.get('/:id', moviesController.show)
movieRoutes.get('/', moviesController.index)
movieRoutes.delete('/:id', moviesController.delete)


export default movieRoutes