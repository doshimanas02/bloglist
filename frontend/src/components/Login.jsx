import { login } from '../reducers/login'
import { useDispatch } from 'react-redux'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
  FormItem,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { state } = useLocation()
  const formSchema = z.object({
    username: z.string().min(2, {
      message: 'Username must be at least 2 characters.',
    }),
    password: z
      .string()
      .min(2, { message: 'Password must be at least 2 character' }),
  })
  const form = useForm({
    defaultValues: { username: '', password: '' },
    resolver: zodResolver(formSchema),
  })
  return (
    <div className='flex items-center justify-center h-full bg-slate-900 text-slate-300 gap-10'>
      <div>
        <p className='text-4xl'>Welcome to</p>
        <p className='text-4xl'>Bloglist!</p>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (values) => {
              await dispatch(login(values.username, values.password))
              if (!state)
                await navigate('/')
              else
                await navigate(state.path)
            })}
            className='space-y-8 flex flex-col justify-center items-center' data-testid="login-form"
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder='doshimanas02' {...field} data-testid='login-username-input'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='manas' {...field} data-testid='login-password-input'/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4'>
              <Button
                variant='outline'
                onClick={async (event) => {
                  event.preventDefault()
                  await navigate('/register')
                }}
              >
                Sign Up
              </Button>
              <Button type='submit' data-testid="login-btn">Login</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Login
