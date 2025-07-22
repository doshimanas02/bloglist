const router = require('express').Router()
const { addTestUsers } = require('../tests/users')
const { addTestBlogs } = require('../tests/blogs')

router.post('/reset', async (request, response) => {
  await addTestUsers()
  await addTestBlogs()
  response.status(204).end()
})

module.exports = router