const { test, describe } = require('node:test')
const assert = require('node:assert')
const { blogs } = require('./blogs')
const { dummy,totalLikes,favoriteBlog, mostBlogs,mostLikes } = require('../utils/list_helper')

test('dummy returns one', () => {
  assert.strictEqual(dummy(blogs), 1)
})

describe('total likes', () => {
  test('when list has only one blog, equal the likes of that', () => {
    assert.strictEqual(totalLikes([blogs[0]]), 7)
  })
  test('when list has no blogs, likes are zero', () => {
    assert.strictEqual(totalLikes([]), 0)
  })
  test('when list has multiple blogs, equals the likes of all', () => {
    assert.strictEqual(totalLikes(blogs), 36)
  })
})

describe('favorite blog', () => {
  test('when list has only one blog, is equal of that', () => {
    assert.deepStrictEqual(favoriteBlog([blogs[0]]), blogs[0])
  })
  test('when list has no blogs, is equal to null', () => {
    assert.deepStrictEqual(favoriteBlog([]), null)
  })
  test('when list has multiple blogs, is equal to favorite among all', () => {
    assert.deepStrictEqual(favoriteBlog(blogs), blogs[2])
  })
})

describe('most blogs', () => {
  test('when list has only one blog', () => {
    assert.deepStrictEqual(mostBlogs([blogs[0]]), { author: blogs[0]['author'], blogs: 1 })
  })
  test('when list has no blogs', () => {
    assert.strictEqual(mostBlogs([]), undefined)
  })
  test('when list has multiple blogs', () => {
    assert.deepStrictEqual(mostBlogs(blogs), { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('when list has only one blog', () => {
    assert.deepStrictEqual(mostLikes([blogs[0]]), { author: blogs[0]['author'], likes: blogs[0]['likes'] })
  })
  test('when list has no blogs', () => {
    assert.strictEqual(mostLikes([]), undefined)
  })
  test('when list has multiple blogs', () => {
    assert.deepStrictEqual(mostLikes(blogs), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})