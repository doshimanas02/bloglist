import { expect } from '@playwright/test'

export const navigateToBlogs = async(page) => {
  const blogsNavBtn = await page.getByTestId('blogs-nav-btn')
  await blogsNavBtn.click()
  await expect(page.locator('.blogs-table')).toBeVisible()
}

export const navigateToUsers = async(page) => {
  const usersNavBtn = await page.getByTestId('users-nav-btn')
  await usersNavBtn.click()
  await page.locator('.users-table').waitFor()
}

export const login = async (page, username, password) => {
  await page.goto('/')
  const usernameLocator = await page.getByTestId('login-username-input')
  const passwordLocator = await page.getByTestId('login-password-input')
  await usernameLocator.fill(username)
  await passwordLocator.fill(password)
  await page.getByTestId('login-btn').click()
  await page.waitForResponse('/api/login')
}

export const register = async(page, name, username, password) => {
  await page.goto('/register')
  const nameLocator = await page.getByTestId('register-name-input')
  const usernameLocator = await page.getByTestId('register-username-input')
  const passwordLocator = await page.getByTestId('register-password-input')
  await nameLocator.fill(name)
  await usernameLocator.fill(username)
  await passwordLocator.fill(password)
  await page.getByTestId('register-btn').click()
  await page.waitForResponse('/api/users')
}

export const createBlog = async (page, author, title, url) => {
  await navigateToBlogs(page)
  await page.getByTestId('add-blog-btn').click()
  const authorLocator = await page.getByTestId('blogform-author-input')
  const titleLocator = await page.getByTestId('blogform-title-input')
  const urlLocator = await page.getByTestId('blogform-url-input')
  await expect(authorLocator).toBeVisible()
  await expect(titleLocator).toBeVisible()
  await expect(urlLocator).toBeVisible()
  await authorLocator.fill(author)
  await titleLocator.fill(title)
  await urlLocator.fill(url)
  await page.getByTestId('blogform-submit-btn').click()
  await page.waitForResponse('/api/blogs')
}

export const likeBlog = async (page, blog) => {
  await navigateToBlogs(page)
  const blogLocator = await page.getByRole('cell', { name: blog })
  await expect(blogLocator).toHaveCount(1)
  await blogLocator.locator('..').click()
  const blogLikeBtnLocator = await page.getByTestId('blog-like-btn')
  await blogLikeBtnLocator.click()
  const pattern = /\/api\/blogs\/*/gm
  await page.waitForResponse(response => pattern.test(response.url()))
}

export const addComment = async (page, blog, comment) => {
  await navigateToBlogs(page)
  const blogLocator = await page.getByRole('cell', { name: blog })
  await expect(blogLocator).toHaveCount(1)
  await blogLocator.locator('..').click()
  const commentLocator = await page.getByTestId('blog-comment-input')
  await commentLocator.fill(comment)
  const current = await page.getByTestId('blog-comment-text').all()
  await page.getByRole('button', { name: /comment/i }).click()
  await expect(page.getByTestId('blog-comment-text')).toHaveCount(current.length + 1)
}

export const getUserBlogCount = async(page, user) => {
  await navigateToUsers(page)
  const userLocator = await page.getByRole('cell', { name: user })
  await expect(userLocator).toHaveCount(1)
  await userLocator.locator('..').click()
  const userDetailsLocator = await page.getByTestId('user')
  await expect(userDetailsLocator).toHaveCount(1, { timeout: 100000 })
  const allBlogs = await userDetailsLocator.getByRole('link').all()
  return allBlogs.length
}


export const deleteBlog = async(page, blog) => {
  page.once('dialog', async (dialog) => {
    await dialog.accept()
  })
  await navigateToBlogs(page)
  const blogLocator = await page.getByRole('cell', { name: blog })
  await expect(blogLocator).toHaveCount(1)
  await blogLocator.locator('..').click()
  await page.getByRole('button', { name: /delete/i }).click()
  await expect(page.getByRole('cell', { name: blog })).toHaveCount(0)
}