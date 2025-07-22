import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const Users = () => {
  const users = useSelector((state) => state.users)
  const navigate = useNavigate()
  if (!users) {
    return <div>Loading...</div>
  }
  return (
    <div className="p-4 m-4">
      <p className="text-4xl">Users</p>
      <Table className="mt-10 users-table">
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-2xl">User</TableHead>
            <TableHead className="max-w-2xl">Blogs created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            return (
              <TableRow
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
              >
                <TableCell data-testid='users-name-text'>{user.name}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>

              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default Users
