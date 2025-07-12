import { describe, beforeEach, test, expect } from '@playwright/test'
import { login, createBlog, likeBlog, addComment, deleteBlog, navigateToBlogs } from './helper'
import assert from 'node:assert'

describe('Blogs', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await login(page, 'johnpuller', 'johnpass01')
  })

  test('a new blog can be created', async ({ page }) => {
    await createBlog(page, 'Every Dev', 'Hello World', 'localhost')
    const notificationLocator = await page.getByTestId('notification')
    await expect(notificationLocator).toContainText('Added')
    await page.getByText('Every Dev').waitFor()
  })

  test('a blog can be liked', async ({ page }) => {
    await likeBlog(page, 'TDD')
    const likeCountLocator = await page.getByTestId('like-count-text')
    await expect(likeCountLocator).toContainText('1 likes')
  })

  test('a created blog can be deleted', async ({ page }) => {
    await deleteBlog(page, 'Type')
    const blogLocator = await page.getByRole('cell', { name: 'Type' })
    await expect(blogLocator).toHaveCount(0)
  })

  test('creator of the blog can only delete the blog', async ({ page }) => {
    const blogLocator = await page.getByRole('cell', { name: 'TDD' })
    await expect(blogLocator).toHaveCount(1)
    await blogLocator.locator('..').click()
    const deleteBtnLocator = await page.getByRole('button', { name: /delete/i })
    await expect(deleteBtnLocator).not.toBeVisible()
  })

  test('blogs are sorted by likes', async ({ page }) => {
    await createBlog(page, 'Every Dev', 'Hello World 1', 'localhost')
    await likeBlog(page, 'Hello World 1')

    await createBlog(page, 'Every Dev', 'Hello World 2', 'localhost')
    await likeBlog(page, 'Hello World 2')
    await likeBlog(page, 'Hello World 2')

    await navigateToBlogs(page)
    const allBlogTitlesLocator = await page.getByTestId('blogs-title').all()
    const helloWorldBlogs = []
    for (const locator of allBlogTitlesLocator) {
      const content = await locator.textContent()
      if (content.indexOf('Hello World') >= 0) {
        helloWorldBlogs.push(locator)
      }
    }
    await expect(helloWorldBlogs[0].locator('..').getByTestId('blogs-like-count')).toContainText('2')
    await expect(helloWorldBlogs[1].locator('..').getByTestId('blogs-like-count')).toContainText('1')
  })

  test('user can comment on blog', async ({ page }) => {
    await addComment(page, 'TDD', 'Nice')
    const comment = await page.getByTestId('blog-comment-text').last().textContent()
    assert(comment.indexOf('Nice') >= 0)
  })
})
