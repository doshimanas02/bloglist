const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const _ = require('lodash')
const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const { addTestUsers,users } = require('./users')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await addTestUsers()
})

describe('when creating a user', async () => {
  test('user is saved to DB', async () => {
    const user = { username: 'doshimanas02', password: 'Manas', name: 'Manas' }
    await api.post('/api/users').send(user).set('Accept', 'application/json').expect(201)
    const userInDb = await User.findOne({ username: user.username })
    assert.notStrictEqual(userInDb, undefined)
  })
  test('password is stored in hashed format', async () => {
    const user = { username: 'doshimanas02', password: 'Manas', name: 'Manas' }
    await api.post('/api/users').send(user).set('Accept', 'application/json').expect(201)
    const userInDb = await User.findOne({ username: user.username })
    assert.notStrictEqual(userInDb.password, user.password)
  })
  test('duplicate username is not allowed', async () => {
    const user = { username: 'doshimanas02', password: 'Manas', name: 'Manas' }
    await api.post('/api/users').send(user).set('Accept', 'application/json').expect(201)
    const response = await api.post('/api/users').send(user).set('Accept', 'application/json').expect(400)
    assert(response.text.toLowerCase().includes('duplicate'))
  })
})

describe('when fetching all users', async () => {
  test('all users are fetched', async () => {
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, 4)
  })
  test('password not shown', async () => {
    const response = await api.get('/api/users')
    for (let u of response.body) {
      assert.strictEqual(u.password, undefined)
    }
  })
  test('user identifier is id', async () => {
    const response = await api.get('/api/users')
    const firstUser = response.body[0]
    assert('id' in firstUser)
  })
  test('blogs are fetched for each user', async () => {
    const response = await api.get('/api/users')
    const john = response.body.find(u => u.username === 'johnpuller')
    assert(john)
    const johnData = users.find(u => u.username === 'johnpuller')
    const set1 = new Set(johnData.blogs)
    const set2 = new Set(john.blogs.map(b => b.id))
    assert(_.isEqual(set1, set2))
  })
})

after(async () => {
  await mongoose.connection.close()
})