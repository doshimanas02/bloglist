import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'notification',
  initialState: {},
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
  },
})

const { setNotification } = slice.actions
export default slice.reducer

export const notify = (success, message) => {
  return async (dispatch) => {
    dispatch(setNotification({ success, message }))
    await new Promise((resolve) => setTimeout(resolve, 5000))
    dispatch(setNotification({}))
  }
}
