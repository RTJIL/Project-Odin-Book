import Profile from '@/features/profile/Profile'
import isAuth from '@/utils/isAuth'
import { redirect } from 'next/navigation'
import { User } from '@/utils/types'

export default async function ProfilePage() {
  const auth = await isAuth()
  if (!auth) redirect('/')

  return <Profile currentUser={auth as unknown as User} />
}
