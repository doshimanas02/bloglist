import { createBlog } from '../reducers/blogs'
import { useDispatch } from 'react-redux'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

const BlogForm = () => {
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const formSchema = z.object({
    title: z
      .string()
      .min(2, { message: 'Title must be at least 2 characters' }),
    author: z
      .string()
      .min(2, { message: 'Author must be at least 2 characters' }),
    url: z.string().min(2, { message: 'Url must be at least 2 characters' }),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '', author: '', url: '' },
  })

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(event) => {
          setOpen(event)
          form.reset()
        }}
      >
        <DialogTrigger asChild>
          <Button data-testid='add-blog-btn'>Add Blog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-slate-200">
          <DialogHeader>
            <DialogTitle>Add a new blog</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              name="blog-form"
              onSubmit={form.handleSubmit((values) => {
                setOpen(false)
                dispatch(
                  createBlog({
                    title: values.title,
                    author: values.author,
                    url: values.url,
                  })
                )
              })}
              className="grid gap-4 py-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-300" data-testid='blogform-title-input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-300" data-testid='blogform-author-input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-slate-300" data-testid='blogform-url-input' />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" data-testid='blogform-submit-btn' >Add Blog</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default BlogForm
