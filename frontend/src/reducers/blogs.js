import { createSlice } from '@reduxjs/toolkit'
import { default as BlogsService } from '../services/bloglist'
import { notify } from './notification'
import { handleError } from './util'
import { fetchUser } from './users'

const slice = createSlice({
  name: 'blogs',
  initialState: null,
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      return state.concat(action.payload)
    },
    updateBlog(state, action) {
      const blogToUpdate = action.payload
      const blogs = state.filter((blog) => blog.id !== blogToUpdate.id)
      blogs.push(blogToUpdate)
      return blogs
    },
    deleteBlog(state, action) {
      const blogToDelete = action.payload
      const blogs = state.filter((blog) => blog.id !== blogToDelete.id)
      return blogs
    },
  },
})

const { setBlogs, appendBlog, updateBlog, deleteBlog } = slice.actions

export default slice.reducer

export const createBlog = (blog) => {
  return async (dispatch, getState) => {
    try {
      const user = getState().loggedInUser
      const response = await BlogsService.createBlog(blog, user)
      dispatch(appendBlog(response.data))
      dispatch(fetchUser(user.id))
      dispatch(notify(true, `Added new blog '${blog.title}' successfully`))
    } catch (error) {
      handleError(error, dispatch, 'Failed to add new blog')
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch, getState) => {
    const updates = { likes: blog.likes + 1 }
    const user = getState().loggedInUser
    try {
      const response = await BlogsService.updateBlog(blog.id, updates, user)
      dispatch(updateBlog(response.data))
    } catch (error) {
      handleError(error, dispatch, 'Failed to like blog')
    }
  }
}

export const removeBlog = (blog) => {
  return async (dispatch, getState) => {
    const user = getState().loggedInUser
    if (!window.confirm(`Delete blog ${blog.title} by ${blog.author}`)) {
      return
    }
    try {
      await BlogsService.deleteBlog(blog, user)
      dispatch(deleteBlog(blog))
      dispatch(fetchUser(user.id))
      dispatch(notify(true, `Deleted blog '${blog.title}' successfully`))
    } catch (error) {
      handleError(error, dispatch, 'Failed to delete blog')
    }
    return true
  }
}

export const fetchBlogs = () => {
  return async (dispatch, getState) => {
    const user = getState().loggedInUser
    try {
      const blogs = await BlogsService.getBlogs(user)
      dispatch(setBlogs(blogs))
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch blogs')
    }
  }
}

export const addComment = (id, comment) => {
  return async (dispatch, getState) => {
    const user = getState().loggedInUser
    try {
      const response = await BlogsService.addComment(id, user, comment)
      dispatch(updateBlog(response.data))
    } catch (error) {
      handleError(error, dispatch, 'Failed to add comment')
    }
  }
}
