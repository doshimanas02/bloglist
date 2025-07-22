import axios from 'axios'
const baseUrl = '/api/blogs'

const getBlogs = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async (blog, user) => {
  const response = await axios.post(baseUrl, blog, {
    headers: { Authorization: `Bearer ${user.token}` },
  })
  return response
}

const updateBlog = async (id, updates, user) => {
  const response = await axios.put(`${baseUrl}/${id}`, updates, {
    headers: { Authorization: `Bearer ${user.token}` },
  })
  return response
}

const deleteBlog = async (blog, user) => {
  const response = await axios.delete(`${baseUrl}/${blog.id}`, {
    headers: { Authorization: `Bearer ${user.token}` },
  })
  return response
}

const addComment = async (blogId, user, comment) => {
  const response = await axios.post(
    `${baseUrl}/${blogId}/comments`,
    { comment },
    { headers: { Authorization: `Bearer ${user.token}` } }
  )
  return response
}

export default { getBlogs, createBlog, updateBlog, deleteBlog, addComment }
