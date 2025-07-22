const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  return response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog()
  blog.title = request.body.title
  blog.author = request.body.author
  blog.likes = 0
  blog.url = request.body.url
  blog.user = user._id
  blog.comments = []
  const result = await (await blog.save()).populate('user', { username : 1, name : 1 })
  user.blogs.push(blog)
  await user.save()
  return response.status(201).json(result)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    if (request.user._id.toString() !== blog.user.toString()) {
      return response.status(403).end()
    }
    await Blog.findByIdAndDelete(request.params.id)
    request.user.blogs = request.user.blogs.filter(b => b.toString() !== request.params.id)
    await request.user.save()
  }
  return response.status(204).end()
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  const newBlog = new Blog()
  newBlog.user = blog.user
  newBlog._id = blog._id
  for (let k of ['title', 'author', 'url', 'comments']) {
    newBlog[k] = blog[k]
    if (!request.body[k]) {
      continue
    }
    if(!(blog.user.equals(request.user._id))) {
      return response.status(403).end()
    }
    else {
      newBlog[k] = request.body[k]
    }
  }

  newBlog['likes'] = request.body['likes'] || blog['likes']

  const result = await (await Blog.findByIdAndUpdate(blog._id, newBlog, { new: true, runValidators: true })).
    populate('user', { username: 1, name: 1 })
  if (result) {
    return response.json(result)
  }
  else {
    return response.status(404).end()
  }
})

blogsRouter.post('/:id/comments', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (!request.body.comment) {
    return response.status(400).send({ error: 'non-empty comment string required' })
  }
  blog.comments.push(request.body.comment)
  const result = await (await Blog.findByIdAndUpdate(blog._id, blog, { new: true, runValidators: true })).
    populate('user', { username: 1, name: 1 })
  if (result) {
    return response.json(result)
  }
  else {
    return response.status(404).end()
  }
})

module.exports = blogsRouter