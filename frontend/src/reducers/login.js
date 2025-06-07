import { createSlice } from '@reduxjs/toolkit'
import LoginService from '../services/login'
import { notify } from './notification'

const initialState = JSON.parse(
  window.localStorage.getItem('loggedBloglistUser')
)

const slice = createSlice({
  name: 'loggedInUser',
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

const { setUser } = slice.actions
export default slice.reducer

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await LoginService.login(username, password)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      dispatch(setUser(user))
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        dispatch(notify(false, error.response.data))
      } else {
        console.log(error)
        dispatch(notify(false, 'Failed to login'))
      }
    }
  }
}

export const logout = () => {
  return async (dispatch) => {
    window.localStorage.setItem('loggedBloglistUser', null)
    dispatch(setUser(null))
  }
}
