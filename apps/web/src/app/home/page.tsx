import { redirect } from 'next/navigation'
import isAuth from '@/utils/isAuth'
import Feed from '@/features/feed/Feed'
import { User } from '@/utils/types'

export default async function HomePage() {
  const auth = await isAuth()
  if (!auth) redirect('/')

  return (<Feed currentUser={auth as User}/>)
}
