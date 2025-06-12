import { describe, test, beforeEach } from '@playwright/test'
import { login, getUserBlogCount, createBlog, deleteBlog } from './helper'
import assert from 'node:assert'

describe('Users', () => {
  beforeEach(async({ page, request }) => {
    await request.post('/api/testing/reset')
    await login(page, 'johnpuller', 'johnpass01')
  })
  test('user blog count is correct', async({ page }) => {
    const johnBlogCount = await getUserBlogCount(page, 'john')
    assert(johnBlogCount === 2)
  })
  test('user blog count increases after creating a blog', async({ page }) => {
    const johnBlogCount = await getUserBlogCount(page, 'john')
    await createBlog(page, 'Dan Abramov', 'React-Redux', 'google.com')
    await page.waitForLoadState('networkidle')
    const newJohnBlogCount = await getUserBlogCount(page, 'john')
    assert(johnBlogCount + 1 === newJohnBlogCount)
  })
  test('user blog count decreases after deleting a blog', async({ page }) => {
    const johnBlogCount = await getUserBlogCount(page, 'john')
    await deleteBlog(page, 'Type')
    await page.waitForLoadState('networkidle')
    const newJohnBlogCount = await getUserBlogCount(page, 'john')
    assert(johnBlogCount - 1 === newJohnBlogCount)
  })
})