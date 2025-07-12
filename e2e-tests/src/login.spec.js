import { test, expect, describe, beforeEach } from '@playwright/test'
import { login } from './helper'
const mongoose = require('mongoose')

describe('login', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await page.goto('/')
  })
  test('can login with correct credentials', async ({ page }) => {
    await login(page, 'johnpuller', 'johnpass01')
    await expect(page).toHaveURL('/blogs')
    const profileNavBtn = await page.getByTestId('profile-nav-btn')
    await expect(profileNavBtn).toContainText('John')
  })
  test('cannot login with incorrect credentials', async ({ page }) => {
    await login(page, 'doshimanas02', 'badpassword')
    await expect(page).toHaveURL('/login')
  })
})
