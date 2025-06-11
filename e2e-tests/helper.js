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
  await authorLocator.fill(author)
  await titleLocator.fill(title)
  await urlLocator.fill(url)
  await page.getByTestId('blogform-submit-btn').click()
  await page.waitForResponse('/api/blogs')
}

export const likeBlog = async (page, blog) => {
  await navigateToBlogs(page)
  const blogLocator = await getBlogByTitle(page, blog)
  await blogLocator.click()
  const blogLikeBtnLocator = await page.getByTestId('blog-like-btn')
  await blogLikeBtnLocator.click()
  const pattern = /\/api\/blogs\/*/gm
  await page.waitForResponse(response => pattern.test(response.url()))
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

export const addComment = async (page, blog, comment) => {
  await navigateToBlogs(page)
  const blogLocator = await getBlogByTitle(page, blog)
  await blogLocator.click()
  const commentLocator = await page.getByTestId('blog-comment-input')
  await commentLocator.fill(comment)
  await page.getByRole('button', { name: /comment/i }).click()
  const pattern = /\/api\/blogs\/.*\/comments/i
  await page.waitForResponse(response => pattern.test(response.url()))
}

export const getUserBlogCount = async(page, user) => {
  await navigateToUsers(page)
  const allUsers = await page.getByTestId('users-name-text').all()
  let re = new RegExp(user, 'i')
  var userLocator = null
  for (const locator of allUsers) {
    if (re.test(await locator.textContent())) {
      userLocator = locator
      break
    }
  }
  await userLocator.locator('..').click()
  await page.waitForResponse('https://dog.ceo/api/breeds/image/random')
  const allBlogs = await page.getByTestId('user-blog').all()
  return allBlogs.length
}


export const deleteBlog = async(page, blog) => {
  await navigateToBlogs(page)
  page.on('dialog', async (dialog) => {
    await dialog.accept()
  })
  const blogLocator = await getBlogByTitle(page, blog)
  await blogLocator.click()
  await page.getByRole('button', { name: /delete/i }).click()
  const pattern = /\/api\/blogs\/*/gm
  await page.waitForResponse(response => pattern.test(response.url()))
}

export const navigateToBlogs = async(page) => {
  const blogsNavBtn = await page.getByTestId('blogs-nav-btn')
  await blogsNavBtn.click()
}

export const navigateToUsers = async(page) => {
  const usersNavBtn = await page.getByTestId('users-nav-btn')
  await usersNavBtn.click()
}