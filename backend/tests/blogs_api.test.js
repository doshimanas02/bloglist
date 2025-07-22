const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
var chai = require('chai')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const { addTestBlogs } = require('./blogs')
const { addTestUsers } = require('./users')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await addTestBlogs()
  await addTestUsers()
})

const getBlogs = async () => {
  const response = await api.get('/api/blogs')
  return response
}

const createBlog = async (token, blog, status) => {
  return await api.
    post('/api/blogs').
    send(blog).set('Accept', 'application/json').
    set('Authorization', 'Bearer ' + token).
    expect(status)
}

const deleteBlog = async (token, blog, status) => {
  return await api.
    delete(`/api/blogs/${blog.id}`).
    set('Authorization', 'Bearer ' + token).
    expect(status)
}

const updateBlog = async (token, blog, status) => {
  return await api.
    put(`/api/blogs/${blog.id}`).
    set('Authorization', 'Bearer ' + token).
    set('Content-Type', 'application/json').
    send(blog).
    expect(status)
}

const login = async () => {
  const body = { username: 'johnpuller', password: 'johnpass01' }
  const response = await api.post('/api/login').set('Accept', 'application/json').send(body).expect(200)
  return response.body.token
}

const addComment = async (token, blog, comment) => {
  const body = { comment }
  const response = await api.
    post(`/api/blogs/${blog.id}/comments`).
    set('Authorization', 'Bearer ' + token).
    set('Accept', 'application/json').
    send(body).
    expect(200)
  console.log(response)
  return response
}

describe('when fetching all blogs,', async () => {
  test('blogs are returned in JSON', async () => {
    const response = await getBlogs()
    chai.expect(response.headers['Content-type'],/application\/json/)
  })
  test('blog count is correct', async () => {
    const response = await getBlogs()
    assert.strictEqual(response.body.length, 6)
  })
  test('blog identifier is id', async () => {
    const response = await getBlogs()
    const firstBlog = response.body[0]
    assert('id' in firstBlog)
  })
})

describe('when creating a blog post,', async () => {
  const blog = { title: 'Handling payments with Razorpay', author: 'Manas Doshi', 'url': 'google.com', 'likes': 12 }
  test('blog is saved to DB', async () => {
    const len = (await getBlogs()).body.length
    const token = await login()
    await createBlog(token, blog, 201)
    const getResponse = await getBlogs()
    assert(getResponse.body.length, len + 1)
    assert(getResponse.body.map(b => b['author'].indexOf('Manas') >= 0))
  })
  test('cannot create blog without logging in', async () => {
    await api.post('/api/blogs').set('Accept', 'application/json').send(blog).expect(401)
  })
  test('blog without likes is saved with default', async () => {
    let b = { ...blog }
    delete b['likes']
    const len = (await api.get('/api/blogs')).body.length
    const token = await login()
    await createBlog(token, b, 201)
    const getResponse = await api.get('/api/blogs').expect(200)
    assert(getResponse.body.length, len + 1)
  })
  test('correct user is assigned to blog', async () => {
    const token = await login()
    await createBlog(token, blog, 201)
    const response = await api.get('/api/blogs').expect(200)
    const blogEntryInResponse = response.body.find(b => b.title === blog.title)
    assert(blogEntryInResponse && blogEntryInResponse.user.username === 'johnpuller')
  })
  test('correct user assigned to blog has been added to user\'s blogs array', async() => {
    const token = await login()
    await createBlog(token, blog, 201)
    const response = await api.get('/api/users').expect(200)
    const user = response.body.find(u => u.username === 'johnpuller')
    assert(user && user.blogs.find(b => b.title === blog.title))
  })
})

describe('when deleting a blog, ', async() => {
  test('blog can be deleted by the one who added', async() => {
    const blogs = (await getBlogs()).body
    const johnsBlog = blogs.find(b => b.user.username === 'johnpuller')
    const token = await login()
    await deleteBlog(token, johnsBlog, 204)
    const res = await Blog.findOne({ _id: johnsBlog.id })
    assert.strictEqual(res, null)
  })
  test('blog cannot be deleted by the one who did not add it', async () => {
    const blogs = (await getBlogs()).body
    const token = await login()
    const notJohnsBlog = blogs.find(b => b.user.username !== 'johnpuller')
    await deleteBlog(token, notJohnsBlog, 403)
    const res = await Blog.findOne({ _id: notJohnsBlog.id })
    assert(res)
  })
})

describe('when updating a blog,', async() => {
  test('own blog with given ID is updated in DB', async() => {
    const blogs = (await getBlogs()).body
    const johnsBlog = blogs.find(b => b.user.username === 'johnpuller')
    johnsBlog.likes = 34
    johnsBlog.author = 'Manas Doshi'
    const token = await login()
    await updateBlog(token, johnsBlog, 200)
    const newBlog = await Blog.findOne({ _id: johnsBlog.id })
    assert.strictEqual(newBlog.likes, johnsBlog.likes)
    assert.strictEqual(newBlog.author, johnsBlog.author)
  })
  test('others blog with given ID is not updated in DB', async () => {
    const blogs = (await getBlogs()).body
    const notJohnsBlog = blogs.find(b => b.user.username !== 'johnpuller')
    notJohnsBlog.likes = 34
    notJohnsBlog.author = 'Manas Doshi'
    const token = await login()
    await updateBlog(token, notJohnsBlog, 403)
    const newBlog = await Blog.findOne({ _id: notJohnsBlog.id })
    assert.notStrictEqual(newBlog.likes, notJohnsBlog.likes)
    assert.notStrictEqual(newBlog.author, notJohnsBlog.author)
  })
  test('others blog with given ID can be liked', async() => {
    const blogs = (await getBlogs()).body
    const johnsBlog = blogs.find(b => b.user.username === 'johnpuller')
    johnsBlog.likes = 12
    const token = await login()
    await updateBlog(token, johnsBlog, 200)
    const blog = await Blog.findOne({ _id: johnsBlog.id })
    assert.strictEqual(blog.likes, johnsBlog.likes)
  })
})

describe('when commenting on a blog', async () => {
  test('user can post comments', async () => {
    const token = await login()
    const blogs = (await getBlogs()).body
    const johnsBlog = blogs.find(b => b.user.username === 'johnpuller')
    const comment = 'A great blog!'
    await addComment(token, johnsBlog, comment)
    const updatedBlog = await Blog.findOne({ _id: johnsBlog.id })
    assert(updatedBlog.comments.length === 1)
    assert(updatedBlog.comments[0] === comment)
  })
  test('user can view comments', async () => {
    const token = await login()
    const comment = 'A great blog!'
    const blogs = (await getBlogs()).body
    const johnsBlog = blogs.find(b => b.user.username === 'johnpuller')
    await addComment(token, johnsBlog, comment)
    const newBlogs = (await getBlogs()).body
    const newJohnsBlog = newBlogs.find(b => b.id === johnsBlog.id)
    assert(newJohnsBlog.comments.length === 1)
    assert(newJohnsBlog.comments[0] === comment)
  })
})

after(async () => {
  await mongoose.connection.close()
})