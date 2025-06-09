export const login = async (page, username, password) => {
  await page.goto('/')
  const usernameLocator = await page.getByTestId('login-username-input')
  const passwordLocator = await page.getByTestId('login-password-input')
  await usernameLocator.fill(username)
  await passwordLocator.fill(password)
  await page.getByTestId('login-btn').click()
  await page.waitForURL('/blogs', { timeout: 2000 })
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

export const createBlog = async (page, author, title, url) => {
  await page.getByTestId('add-blog-btn').click()
  const authorLocator = await page.getByTestId('blogform-author-input')
  const titleLocator = await page.getByTestId('blogform-title-input')
  const urlLocator = await page.getByTestId('blogform-url-input')
  await authorLocator.fill(author)
  await titleLocator.fill(title)
  await urlLocator.fill(url)
  await page.getByTestId('blogform-submit-btn').click()
  await page.waitForResponse('/api/blogs')
}

export const likeBlog = async (page) => {
  const blogLikeBtnLocator = await page.getByTestId('blog-like-btn')
  await blogLikeBtnLocator.click()
}

export const getBlogByTitle = async (page, title) => {
  const allBlogTitlesLocator = await page.getByTestId('blogs-title').all()
  for(const blogLocator of allBlogTitlesLocator) {
    const content = await blogLocator.textContent()
    if (content.indexOf(title) < 0) {
      continue
    }
    return blogLocator
  }
}