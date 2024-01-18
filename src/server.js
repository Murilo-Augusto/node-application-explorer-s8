import "express-async-errors"
import AppError from "./utils/AppError.js"
import migrationsRun from "./database/sqlite/migrations/index.js"
import express, { json } from "express"
import routes from "./routes/index.js"

migrationsRun()

const app = express()
app.use(json())

app.use(routes)

app.use((error, request, response, next) => {
  if(error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.log(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = 3333

app.listen(PORT, () => console.log('Server running'))