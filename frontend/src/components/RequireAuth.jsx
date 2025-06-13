import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router'

const RequireAuth = ({ children }) => {
  const loggedInUser = useSelector((state) => state.loggedInUser)
  const location = useLocation()
  console.log(loggedInUser)
  return loggedInUser ? (
    children
  ) : (
    <Navigate
      replace
      to="/login"
      state={{ path: location.pathname }}
    ></Navigate>
  )
}

export default RequireAuth
