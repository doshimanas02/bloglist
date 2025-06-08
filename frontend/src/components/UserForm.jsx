import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { addUser } from '../reducers/users'
import {
  FormItem,
  FormLabel,
  FormControl,
  Form,
  FormField,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

const UserForm = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const formSchema = z.object({
    username: z.string().min(2, 'Username must be at least 2 characters'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 character'),
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { username: '', password: '', name: '' },
  })
  return (
    <div className="h-full flex items-center justify-center p-10 gap-10">
      <div>
        <p className="text-4xl">Welcome to</p>
        <p className="text-4xl">Bloglist!</p>
      </div>
      <div>
        <Form {...form}>
          <form
            className="grid gap-4 py-4"
            name="user-form"
            onSubmit={form.handleSubmit(async (values) => {
              const status = await dispatch(addUser(values))
              if (status) {
                navigate('/login')
                form.reset()
              }
            })}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-300" data-testid='register-name-input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-300" data-testid='register-username-input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-slate-300" data-testid='register-password-input' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={async (event) => {
                  event.preventDefault()
                  await navigate('/login')
                }}
              >
                Login
              </Button>
              <Button type="submit" data-testid='register-btn' >Register</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default UserForm
