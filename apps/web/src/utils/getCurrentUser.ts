import { cookies } from 'next/headers'

interface User {
  id: string | number
  username: string
  avatarUrl?: string
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const sid = cookieStore.get('connect.sid')
  if (!sid) return null

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/me`, {
    headers: {
      cookie: `connect.sid=${sid.value}`,
    },
  })

  if (!res.ok) return null
  return res.json()
}
