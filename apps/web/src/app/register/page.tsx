import AuthForm from '@/features/auth/components/AuthForm'
import isAuth from '@/utils/isAuth'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const user = await isAuth()
  if (user) redirect('/home')

  return <AuthForm />
}
