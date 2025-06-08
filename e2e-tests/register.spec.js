import { test, expect } from '@playwright/test'
import { register, login } from './helper'

test('can register with unique username', async({ page }) => {
  await register(page, 'manas', 'manas', 'manasdoshi')
  await expect(page).toHaveURL('/login')
})