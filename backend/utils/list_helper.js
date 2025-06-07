const _ = require('lodash')
const blogs = require('../tests/blogs')
const dummy = (blogs) => {
  const count = blogs.length
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => blog.likes + sum, 0)
}

const favoriteBlog = (blogs) => {
  let blog = null
  let max = 0
  for (let b of blogs) {
    if(b.likes > max) {
      max = b.likes
      blog = b
    }
  }
  return blog
}

const mostBlogs = (blogs) => {
  const g = _.groupBy(blogs, 'author')
  const m = _.map(g, (group, key) => _.reduce(group, (result, val) => {
    result['author'] = key
    result['blogs'] = (result['blogs'] || 0) + 1
    return result
  }, {}))
  const max = _.maxBy(m, 'blogs')
  return max
}

const mostLikes = (blogs) => {
  const g = _.groupBy(blogs, 'author')
  const m = _.map(g, (group,key) => _.reduce(group, (result, val) => {
    result['author'] = key
    result['likes'] = (result['likes'] || 0) + val.likes
    return result
  }, {}))
  return _.maxBy(m, 'likes')
}

mostBlogs(blogs)
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
