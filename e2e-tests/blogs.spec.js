import { describe, beforeEach, test, expect } from '@playwright/test'
import { login, createBlog, getBlogByTitle, likeBlog, addComment } from './helper'
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
    const blogLocator = await getBlogByTitle(page, 'TDD')
    await blogLocator.click()
    await likeBlog(page)
    const likeCountLocator = await page.getByTestId('like-count-text')
    await expect(likeCountLocator).toContainText('1 likes')
  })

  test('a created blog can be deleted', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      await expect(dialog.message()).toContain('Delete')
      await dialog.accept()
    })
    const blogLocator = await getBlogByTitle(page, 'Type')
    await blogLocator.click()
    await page.getByRole('button', { name: /delete/i }).click()
    const pattern = /\/api\/blogs\/*/gm
    await page.waitForResponse(response => pattern.test(response.url()))
    const deletedBlogLocator = await getBlogByTitle(page, 'Type')
    await expect(deletedBlogLocator).not.toBeDefined()
  })

  test('creator of the blog can only delete the blog', async ({ page }) => {
    const blogLocator = await getBlogByTitle(page, 'TDD')
    await blogLocator.click()
    const deleteBtnLocator = await page.getByRole('button', { name: /delete/i })
    await expect(deleteBtnLocator).not.toBeVisible()
  })

  test('blogs are sorted by likes', async ({ page }) => {
    await createBlog(page, 'Every Dev', 'Hello World 1', 'localhost')
    const blogLocator1 = await getBlogByTitle(page, 'Hello World 1')
    await blogLocator1.click()
    await likeBlog(page)

    await createBlog(page, 'Every Dev', 'Hello World 2', 'localhost')
    const blogLocator2 = await getBlogByTitle(page, 'Hello World 2')
    await blogLocator2.click()
    await likeBlog(page)
    await likeBlog(page)

    await page.goto('/')
    await page.waitForResponse('/api/blogs')
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
    const blogLocator = await getBlogByTitle(page, 'TDD')
    await blogLocator.click()
    await addComment(page, 'Nice')
    const comment = await page.getByTestId('blog-comment-text').last().textContent()
    assert(comment.indexOf('Nice') >= 0)
  })
})
