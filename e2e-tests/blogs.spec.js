import { describe, beforeEach, test, expect } from '@playwright/test'
import { login, createBlog, getBlogByTitle, likeBlog, register } from './helper'

describe('When logged in', () => {
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

  // test('a created blog can be deleted', async ({ page }) => {
  //   page.on('dialog', async (dialog) => {
  //     await expect(dialog.message()).toContain('Delete')
  //     await dialog.accept()
  //   })

  //   await createBlog(page, 'Every Dev', 'Hello World', 'localhost')
  //   const blogLocator = await getBlogByTitle(page, 'Hello World')
  //   await blogLocator.getByRole('button', { name: 'Show' }).click()
  //   await blogLocator.getByRole('button', { name: 'Delete' }).click()
  //   await expect(page.locator('.blog-header')).toHaveCount(0)
  // })

  // test('creator of the blog can only delete the blog', async ({ page }) => {
  //   await register(page, 'otheruser', 'Other user', 'manas')
  //   await createBlog(page, 'Every Dev', 'Hello World', 'localhost')
  //   await page.getByRole('button', { name: 'Logout' }).click()
  //   await login(page, 'otheruser', 'manas')
  //   await page.waitForTimeout(500)
  //   const showBtnLocator = await page.getByRole('button', { name: 'Show' })
  //   await showBtnLocator.click()
  //   const deleteBtnLocator = await page.getByRole('button', {
  //     name: 'Delete',
  //   })
  //   await expect(deleteBtnLocator).not.toBeVisible()
  // })

  // test('blogs are sorted by likes', async ({ page }) => {
  //   await createBlog(page, 'Every Dev', 'Hello World 1', 'localhost')
  //   var blogLocator = await getBlogByTitle(page, 'Hello World 1')
  //   await likeBlog(blogLocator)

  //   await createBlog(page, 'Every Dev', 'Hello World 2', 'localhost')
  //   blogLocator = await getBlogByTitle(page, 'Hello World 2')
  //   await likeBlog(blogLocator)
  //   await likeBlog(blogLocator)

  //   await createBlog(page, 'Every Dev', 'Hello World 3', 'localhost')
  //   blogLocator = await getBlogByTitle(page, 'Hello World 3')
  //   await likeBlog(blogLocator)
  //   await likeBlog(blogLocator)
  //   await likeBlog(blogLocator)

  //   const blogs = await page.locator('.blog').all()
  //   await expect(blogs[0]).toContainText('likes 3')
  //   await expect(blogs[1]).toContainText('likes 2')
  //   await expect(blogs[2]).toContainText('likes 1')
  // })
})
