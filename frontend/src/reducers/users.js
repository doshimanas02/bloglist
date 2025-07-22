import { createSlice } from '@reduxjs/toolkit'
import UsersService from '../services/users'
import { handleError } from './util'
import { notify } from './notification'

const slice = createSlice({
  name: 'users',
  initialState: null,
  reducers: {
    setUsers(state, action) {
      return action.payload
    },
    updateUser(state, action) {
      const user = action.payload
      const users = state.filter((u) => u.id !== user.id)
      users.push(user)
      return users
    },
    appendUser(state, action) {
      const user = action.payload
      return state.concat(user)
    }
  },
})

export default slice.reducer
const { setUsers, updateUser, appendUser } = slice.actions

export const fetchUsers = () => {
  return async (dispatch) => {
    try {
      const users = await UsersService.getAll()
      dispatch(setUsers(users))
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch users')
    }
  }
}

export const fetchUser = (id) => {
  return async (dispatch) => {
    try {
      const user = await UsersService.get(id)
      dispatch(updateUser(user))
    } catch (error) {
      handleError(error, dispatch, 'Failed to fetch user')
    }
  }
}

export const addUser = (user) => {
  return async (dispatch) => {
    try {
      const addedUser = await UsersService.create(user)
      dispatch(appendUser(addedUser))
      dispatch(notify(true, `New user '${addedUser.name}' added successfully`))
      return true
    } catch (error) {
      handleError(error, dispatch, 'Failed to add user')
      return false
    }
  }
}
