import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/login'
import { Link, useNavigate } from 'react-router'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

const Navigation = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.loggedInUser)
  const navItemStyles = {
    listStyleType: 'none',
    margin: '0 5px',
    display: 'inline',
    color: 'black',
  }
  const navContainerStyles = {
    margin: 0,
    padding: '10px',
    background: '#bbbbbb',
  }
  return (
    <div className="flex w-full items-center" style={navContainerStyles}>
      <ul>
        <li style={navItemStyles}>
          <Link to="/blogs" data-testid='blogs-nav-btn'>Blogs</Link>
        </li>
        <li style={navItemStyles}>
          <Link to="/users" data-testid='users-nav-btn'>Users</Link>
        </li>
      </ul>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" data-testid="profile-nav-btn">{user.name}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => navigate(`/users/${user.id}`)}>
              My Account
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {
              dispatch(logout())
              navigate('/login')
            }} data-testid='nav-menu-logout-item'>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default Navigation
