import Login from './Login'
import Notification from './Notification'
import { useDispatch, useSelector } from 'react-redux'
import Blogs from './Blogs'
import Users from './Users'
import { Routes, Route, Navigate, useMatch } from 'react-router'
import User from './User'
import Blog from './Blog'
import Navigation from './Navigation'
import { useEffect } from 'react'
import { fetchBlogs } from '../reducers/blogs'
import { fetchUsers } from '../reducers/users'
import UserForm from './UserForm'
import RequireAuth from './RequireAuth'

const App = () => {
  const dispatch = useDispatch()
  const loggedInUser = useSelector((state) => state.loggedInUser)
  const blogs = useSelector((state) => state.blogs) || []
  const users = useSelector((state) => state.users) || []
  const blogIdRouteMatcher = useMatch('/blogs/:id')
  const userIdRouteMatcher = useMatch('/users/:id')
  const blog = blogIdRouteMatcher
    ? blogs.find((b) => b.id === blogIdRouteMatcher.params.id)
    : null
  const user = userIdRouteMatcher
    ? users.find((u) => u.id === userIdRouteMatcher.params.id)
    : null

  useEffect(() => {
    dispatch(fetchBlogs())
    dispatch(fetchUsers())
  }, [])

  return (
    <div className="dark bg-slate-900 text-slate-300 h-screen w-screen">
      <div><Notification /></div>
      {loggedInUser ? <Navigation /> : ''}
      <Routes>
        <Route path="/users" element={<RequireAuth>
          <Users />
        </RequireAuth>} />
        <Route path="/users/:id" element={<RequireAuth>
          <User user={user} />
        </RequireAuth>} />
        <Route path="/blogs" element={<RequireAuth>
          <Blogs />
        </RequireAuth>} />
        <Route path="/blogs/:id" element={<Blog blog={blog} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate replace to="/blogs" />} />
        <Route path="*" element={<div><p className="text-center text-4xl p-10">404 Not found</p></div>} />
        <Route path="/register" element={<UserForm />} />
      </Routes>
    </div>
  )
}

export default App
