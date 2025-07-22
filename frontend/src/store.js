import { default as notificationReducer } from './reducers/notification'
import { default as blogsReducer } from './reducers/blogs'
import { default as loggedInUserReducer } from './reducers/login'
import { default as usersReducer } from './reducers/users'
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    loggedInUser: loggedInUserReducer,
    users: usersReducer
  },
})

export default store
