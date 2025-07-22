import { notify } from './notification'
import { logout } from './login'

export const handleError = (error, dispatch, defaultMessage) => {
  const response = error.response

  if (response === undefined) {
    dispatch(notify(false, defaultMessage))
    return
  }
  if (response.status === 400) {
    dispatch(notify(false, response.data))
  }
  else if (response.status === 401) {
    dispatch(notify(false, 'Invalid session'))
    dispatch(logout())
  } else {
    dispatch(notify(false, defaultMessage))
  }
}
