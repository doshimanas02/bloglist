import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import BlogForm from './BlogForm'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const Blogs = () => {
  const navigate = useNavigate()
  const blogs = useSelector((state) => {
    const blogs = state.blogs
    if (!blogs) {
      return
    }
    const blogsCopy = [...blogs]
    blogsCopy.sort((a, b) => b.likes - a.likes)
    return blogsCopy
  })

  let blogsHtml = ''

  if (!blogs) {
    blogsHtml = <p>Loading blogs...</p>
  } else if (blogs.length === 0) {
    blogsHtml = <p>No Blogs yet!</p>
  } else {
    blogsHtml = (
      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-2xl">Title</TableHead>
              <TableHead className="max-w-3xl">Author</TableHead>
              <TableHead className="text-right max-w-2xl">Likes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => {
              return (
                <TableRow
                  key={blog.id}
                  onClick={() => navigate(`/blogs/${blog.id}`)}
                >
                  <TableCell data-testid='blogs-title'>{blog.title}</TableCell>
                  <TableCell>{blog.author}</TableCell>
                  <TableCell className="text-right">{blog.likes}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex w-full">
        <span className="text-4xl">Hot Blogs</span>
        <div className="ml-auto">
          <BlogForm />
        </div>
      </div>
      {blogsHtml}
    </div>
  )
}

export default Blogs
