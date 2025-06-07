const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()

loginRouter.post('/', async (request, response) => {
  for (let k of ['username', 'password']) {
    if (!request.body[k]) {
      return response.status(400).send(`${k} is missing`)
    }
  }
  const username = request.body.username
  const password = request.body.password
  const user = await User.findOne({ username })
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return response.status(401).send('Username/Password is incorrect')
  }

  const userForToken = { username: user.username, id: user._id }
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
  return response.status(200).send({ name: user.name, token, id: user.id })
})

module.exports = loginRouter