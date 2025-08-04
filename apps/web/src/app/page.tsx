import AuthForm from '@/features/auth/components/AuthForm'
import isAuth from '@/utils/isAuth'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const auth = await isAuth()
  if (auth) redirect('/home')

  return <AuthForm login={true} />
}
