const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: { type: String, default: 'NA' },
  username: { type: String, required: [true, 'Username required'], minLength: [3, 'Username must be at least three characters long'], unique: true },
  password: { type: String, required: [true, 'Password required'] },
  blogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  }]
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.password
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User