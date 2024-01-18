import { response } from "express"
import knex from "../database/knex/index.js"
import AppError from "../utils/AppError.js"

class MoviesController {
  async create(request, response) {
    const { title, description, rating, tags } = request.body
    const { user_id } = request.params

    if(rating < 1 || rating > 5) {
      throw new AppError('Dê uma nota entre 1 e 5 para o filme.')
    }
    
    const [ movie_id ] = await knex('movies').insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        name,
        movie_id,
        user_id
      }
    })

    await knex('tags').insert(tagsInsert)

    response.json()
  }

  async show(request, response) {
    const { id } = request.params

    const movie = await knex('movies').where({ id }).first()
    const tags = await knex('tags').where({ movie_id: id }).orderBy('id')
    
    return response.json({
      ...movie,
      tags
    })
  }

  async index(request, response) {
    const { user_id, title, tags } = request.query
    const tableMovies = () => knex('movies')
    const tableTags = () => knex('tags')
  
    let movies;

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim())

      movies = await tableMovies()
        .select([
          'movies.id',
          'movies.title',
          'movies.user_id'
        ])
        .innerJoin('tags','movies.id', 'tags.movie_id')
        .where('notes.user_id', user_id)
        .whereLike('movies.title', `%${title}%`)
        .whereIn('tags.name', filterTags)
        .orderBy('movies.title')
    } else {
      movies = await tableMovies()
        .where({ user_id })
        .whereLike('title', `%%${title}`)
        .orderBy('title')
    }

    const userTags = await tableTags().where({ user_id })
    const moviesWithTags = movies.map(movie => {
      const movieTags = userTags.filter(tag => tag.movie_id === movie.id)
      return {
        ...movie,
        tags: movieTags
      }      
    })

    return response.json(moviesWithTags)
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('movies').where({ id }).del()

    return response.json()
  }
}

export default MoviesController