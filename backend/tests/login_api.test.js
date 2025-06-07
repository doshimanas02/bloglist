const supertest = require('supertest')
const { test,describe,beforeEach,after } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app')
const { addTestUsers } = require('./users')
const api = supertest(app)

beforeEach(async () => {
  await addTestUsers()
})

describe('when trying to log in', () => {
  test('valid user is able to log in', async () => {
    const body = { username: 'johnpuller', password: 'johnpass01' }
    await api.post('/api/login').set('Accept','application/json').send(body).expect(200)
  })
  test('invalid user is not able to log in', async () => {
    const body = { username: 'doshimanas02', password: 'manas01' }
    await api.post('/api/login').set('Accept', 'application/json').send(body).expect(401)
  })
  test('user is not able to login with incorrect password', async () => {
    const body = { username: 'johnpuller', password: 'jpuller01' }
    await api.post('/api/login').set('Accept', 'application/json').send(body).expect(401)
  })
})

after(async () => {
  await mongoose.connection.close()
})
