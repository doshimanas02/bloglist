import ImageService from '../services/image'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
const User = ({ user }) => {
  const [imageUrl, setImageUrl] = useState()
  useEffect(() => {
    const getImage = async () => {
      const data = await ImageService.getRandomImage()
      setImageUrl(data.message)
    }
    getImage()
  }, [])

  if (!user) {
    return (
      <div>
        <p className="text-center text-4xl m-10 p-10">404 User Not Found</p>
      </div>
    )
  }
  if (!imageUrl) {
    return (
      <div>
        <p className="text-center text-2xl m-10 p-10">Loading...</p>
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center m-4 p-4 gap-4" data-testid='user'>
      <div>
        <img style={{ width: '200px', height: '200px' }} src={imageUrl} />
        <p className="text-4xl">{user.name}</p>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-2xl text-secondary-foreground">Added blogs</p>
        <ul>
          {user.blogs.map((blog) => {
            return (
              <li key={blog.id} data-testid='user-blog'>
                <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default User
