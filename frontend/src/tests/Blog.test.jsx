import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import { expect } from 'vitest'
import userEvent from '@testing-library/user-event'

const blog = {
  title: 'A blog',
  author: 'A Author',
  likes: 10,
  url: 'example.com',
  user: {
    name: 'Manas',
    username: 'doshimanas02',
  },
}

test('blog component is rendered with only title and author', () => {
  const { container } = render(<Blog blog={blog} />)

  const header = container.querySelector('.blog-header')
  const details = container.querySelector('.blog-details')

  expect(header).toHaveTextContent('A Author')
  expect(header).toHaveTextContent('A blog')
  expect(details).toHaveStyle('display: none')
})

test('checks that the blog\'s URL and number of likes are shown on button click', async () => {
  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)
  const details = container.querySelector('.blog-details')
  const button = container.querySelector('.show-blog-details-btn')
  await user.click(button)
  expect(details).not.toHaveStyle('display: none')
})

test('checks that if the like button is clicked twice, the event handler is also called twice', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()
  const { container } = render(
    <Blog blog={blog} handleLikeBlog={mockHandler} />
  )
  const button = container.querySelector('.like-blog-btn')
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
