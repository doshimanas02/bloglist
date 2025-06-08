const { test, expect, beforeEach, describe } = require("@playwright/test");
const {
  loginWith,
  createBlogWith,
  createUser,
  likeBlog,
  getBlogByTitle,
} = require("./helper.js");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await createUser(request, "doshimanas02", "Manas Doshi", "manas");
    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    const username = await page.getByTestId("username");
    const password = await page.getByTestId("password");
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
  });

  describe("login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "doshimanas02", "manas");
      await page.getByText("logged in").waitFor();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "doshimanas02", "doshimanas");
      await page.getByText("Username/Password is incorrect").waitFor();
    });
  });
  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "doshimanas02", "manas");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlogWith(page, "Every Dev", "Hello World", "localhost");
      await page.getByText("Every Dev").waitFor();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlogWith(page, "Every Dev", "Hello World", "localhost");
      const blogLocator = await getBlogByTitle(page, "Hello World");
      await likeBlog(blogLocator);
      await expect(blogLocator).toContainText("likes 1");
    });

    test("a created blog can be deleted", async ({ page }) => {
      page.on("dialog", async (dialog) => {
        await expect(dialog.message()).toContain("Delete");
        await dialog.accept();
      });

      await createBlogWith(page, "Every Dev", "Hello World", "localhost");
      const blogLocator = await getBlogByTitle(page, "Hello World");
      await blogLocator.getByRole("button", { name: "Show" }).click();
      await blogLocator.getByRole("button", { name: "Delete" }).click();
      await expect(page.locator(".blog-header")).toHaveCount(0);
    });

    test("creator of the blog can only delete the blog", async ({
      page,
      request,
    }) => {
      await createUser(request, "otheruser", "Other user", "manas");
      await createBlogWith(page, "Every Dev", "Hello World", "localhost");
      await page.getByRole("button", { name: "Logout" }).click();
      await loginWith(page, "otheruser", "manas");
      await page.waitForTimeout(500);
      const showBtnLocator = await page.getByRole("button", { name: "Show" });
      await showBtnLocator.click();
      const deleteBtnLocator = await page.getByRole("button", {
        name: "Delete",
      });
      await expect(deleteBtnLocator).not.toBeVisible();
    });

    test("blogs are sorted by likes", async ({ page }) => {
      await createBlogWith(page, "Every Dev", "Hello World 1", "localhost");
      var blogLocator = await getBlogByTitle(page, "Hello World 1");
      await likeBlog(blogLocator);

      await createBlogWith(page, "Every Dev", "Hello World 2", "localhost");
      blogLocator = await getBlogByTitle(page, "Hello World 2");
      await likeBlog(blogLocator);
      await likeBlog(blogLocator);

      await createBlogWith(page, "Every Dev", "Hello World 3", "localhost");
      blogLocator = await getBlogByTitle(page, "Hello World 3");
      await likeBlog(blogLocator);
      await likeBlog(blogLocator);
      await likeBlog(blogLocator);

      const blogs = await page.locator(".blog").all();
      await expect(blogs[0]).toContainText("likes 3");
      await expect(blogs[1]).toContainText("likes 2");
      await expect(blogs[2]).toContainText("likes 1");
    });
  });
});
