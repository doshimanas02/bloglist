import { useDispatch, useSelector } from 'react-redux'
import { likeBlog, removeBlog, addComment } from '../reducers/blogs'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'

const Blog = ({ blog }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loggedInUser)
  const formSchema = z.object({
    comment: z
      .string()
      .min(2, 'Comment needs to be at least 2 characters long'),
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { comment: '' },
  })

  if (!blog || !user) {
    return (
      <div>
        <p className="text-center text-4xl m-10 p-10">404 Blog not found</p>
      </div>
    )
  }
  return (
    <div className="blog flex gap-10 m-4 p-4">
      <div className="min-w-2xl flex flex-col gap-3">
        <p className="text-4xl text-white">{blog.title}</p>
        <p>
          {' '}
          Author:{' '}
          <span className="text-secondary-foreground">{blog.author}</span>
        </p>
        <p>
          Link:{' '}
          <a href={blog.url} className="text-secondary-foreground">
            {blog.url}
          </a>
        </p>
        <p>
          Added by:{' '}
          <span className="text-secondary-foreground">{blog.user.name}</span>
        </p>
        <p className="text-secondary-foreground" data-testid='like-count-text'>{blog.likes} likes </p>
        <div className="flex gap-2">
          <Button onClick={() => dispatch(likeBlog(blog))} variant="outline" data-testid="blog-like-btn">
            ♡ Like
          </Button>

          {blog.user.name === user.name ? (
            <Button
              onClick={async () => {
                dispatch(removeBlog(blog))
                navigate('/blogs')
              }}
              variant="destructive"
            >
              Delete
            </Button>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <p className="text-2xl text-white">Comments</p>
        <Form {...form}>
          <form
            name="comment-form"
            onSubmit={form.handleSubmit((values) => {
              dispatch(addComment(blog.id, values.comment))
              form.reset()
            })}
            className="flex gap-4"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className="w-72"
                      placeholder="Thoughts?"
                      data-testid="blog-comment-input"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" variant="outline">
              Add Comment
            </Button>
          </form>
        </Form>
        {blog.comments.length > 0 ? (
          <ul>
            {blog.comments.map((c, i) => (
              <li key={i} data-testid='blog-comment-text'>{c}</li>
            ))}
          </ul>
        ) : (
          'No comments yet'
        )}
      </div>
    </div>
  )
}

export default Blog
