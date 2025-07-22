const express = require('express')
require('express-async-errors')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

mongoose.connect(config.MONGO_URI).then(() => {
  logger.info('Connected to MongoDB')
}).catch((error) => {
  logger.error('Error connecting to MongoDB:', error.message)
})

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist-fe'))
app.use(middleware.tokenExtractor)
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist-fe', 'index.html'))
})
app.use(middleware.errorHandler)
module.exports = app
