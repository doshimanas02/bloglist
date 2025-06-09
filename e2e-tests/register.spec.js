import { test, expect, describe, beforeEach } from '@playwright/test'
import { register, login } from './helper'

describe('register', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await page.goto('/')
  })
  test('can register with unique username', async({ page }) => {
    await register(page, 'manas', 'manas', 'manasdoshi')
    const notificationLocator = await page.getByTestId('notification')
    await expect(notificationLocator).toContainText('successfully')
    await expect(page).toHaveURL('/login')
  })
  test('cannot register with duplicate username', async({ page }) => {
    await register(page, 'john', 'johnpuller', 'johnpass01')
    const notificationLocator = await page.getByTestId('notification')
    await expect(notificationLocator).toContainText('username')
  })
  test('can register and login with new creds', async({ page }) => {
    await register(page, 'manas', 'manas', 'manasdoshi')
    await page.waitForURL('/login', { timeout: 2000 })
    await login(page, 'manas', 'manasdoshi')
    await page.waitForURL('/blogs', { timeout: 2000 })
    await expect(page).toHaveURL('/blogs')
  })
})

