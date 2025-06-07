const User = require('../models/user')
const users = [
  {
    name: 'John Puller',
    username:'johnpuller',
    password: '$2b$10$kxiO8OpBnV5vAh7kuJb89essauRBQHR/S8NjByS7RajLM/ePnZgg6',
    _id: '67caba413323fc4a1a786267',
    blogs: [
      '5a422a851b54a676234d17f7',
      '5a422bc61b54a676234d17fc'
    ]
  },
  {
    name: 'Julie Carson',
    username: 'jcarson',
    password: '$2b$10$wf5kPBBK2Iytq0atLXBtJe76lYra68DBXe7ynQse0xJR4r4y4xAdi',
    _id: '67caba413323fc4a1a786268',
    blogs: [
      '5a422b3a1b54a676234d17f9',
      '5a422aa71b54a676234d17f8'
    ]
  },
  {
    name: 'Veronica Knox',
    username: 'veronicak',
    password: '$2b$10$k4wKq9h08HKlpsZygxnbRO3qyzmtGfcpZ60zLkP5D8f0SNVHilrK.',
    _id: '67caba413323fc4a1a786269',
    blogs: [
      '5a422b891b54a676234d17fa'
    ]
  },
  {
    name: 'Robert Puller',
    username: 'rpuller',
    password: '$2b$10$L.Nj26ZmYX//NE4easIthuVnw03KG8lYsTc6kKncbgfTFKaKAcuWu',
    _id: '67caba413323fc4a1a78626a',
    blogs: [
      '5a422ba71b54a676234d17fb'
    ]
  }
]

const addTestUsers = async () => {
  await User.deleteMany({})
  const userObjects = users.map(u => new User(u))
  const promises = userObjects.map(u => u.save())
  await Promise.all(promises)
}

module.exports = { addTestUsers,users }