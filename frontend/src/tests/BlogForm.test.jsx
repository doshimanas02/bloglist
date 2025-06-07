import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../components/BlogForm'

test('checks that form calls the event handler with the right details to create blog', async () => {
  const author = 'Manas'
  const title = 'A blog'
  const url = 'example.com'
  const mockHandler = vi.fn()
  const user = userEvent.setup()
  const { container } = render(<BlogForm createBlog={mockHandler} />)
  const authorInput = container.querySelector('#author')
  const titleInput = container.querySelector('#title')
  const urlInput = container.querySelector('#url')
  const submitBtn = container.querySelector('.create-blog-btn')
  await user.type(authorInput, author)
  await user.type(titleInput, title)
  await user.type(urlInput, url)
  await user.click(submitBtn)
  expect(mockHandler.mock.calls[0][0]['title']).toBe(title)
  expect(mockHandler.mock.calls[0][0]['author']).toBe(author)
  expect(mockHandler.mock.calls[0][0]['url']).toBe(url)
})
