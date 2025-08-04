import isAuth from '@/utils/isAuth'
import { redirect } from 'next/navigation'
import Post from '@/features/post/Post'
import { User } from '@/utils/types'

export default async function PostPage() {
  const auth = await isAuth()
  if (!auth) redirect('/')

  return <Post currentUser={auth as unknown as User} />
}
