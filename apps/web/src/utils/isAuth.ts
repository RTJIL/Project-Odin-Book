import formatUrl from './formatUrl'
import getCoockieAuth from './getCoockieAuth'
import { User } from './types'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export default async function isAuth(): Promise<User | null> {
  if (!API_BASE) return null

  const cookieHeader = await getCoockieAuth()
  if (!cookieHeader) return null

  try {
    const res = await fetch(`${formatUrl(API_BASE)}api/auth/me`, {
      headers: { cookie: cookieHeader },
      credentials: 'include',
      cache: 'no-store',
    })
    if (!res.ok) return null
    const { user } = await res.json()
    return user
  } catch {
    return null
  }
}
