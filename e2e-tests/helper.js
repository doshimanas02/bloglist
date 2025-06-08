

export const login = async (page, username, password) => {
  await page.goto('/')
  const usernameLocator = await page.getByTestId('login-username-input')
  const passwordLocator = await page.getByTestId('login-password-input')
  await usernameLocator.fill(username)
  await passwordLocator.fill(password)
  await page.getByTestId('login-btn').click()
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
}