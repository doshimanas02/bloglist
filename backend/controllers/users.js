const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const saltRounds = 10
usersRouter.post('/', async (request, response) => {
  for (let k of ['username', 'password', 'name']) {
    if (!request.body[k]) {
      return response.status(400).send(`${k} is missing`)
    }
    else if(request.body[k].length < 2) {
      return response.status(400).send(`${k} is invalid`)
    }
  }
  const username = request.body.username
  const name = request.body.name
  const password = request.body.password

  const duplicateUsername = await User.findOne({ username })
  if (duplicateUsername) {
    return response.status(400).send('Duplicate username')
  }
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({ username,name,password: passwordHash })
  await user.save()
  return response.status(201).send(user).end()
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  return response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findOne({ _id: request.params.id }).populate('blogs', { title: 1, author:1, url: 1 })
  return response.json(user)
})

module.exports = usersRouter