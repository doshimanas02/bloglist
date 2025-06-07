const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title required'] },
  author: { type: String, required: [true, 'Author required'] },
  url: { type: String, required: [true, 'URL required'] },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: { type: [String], default: [] }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = document._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog