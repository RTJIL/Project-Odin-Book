import { cookies } from 'next/headers'

export default async function getCoockieAuth() {
  const cookieStore = await cookies()
  const sid = cookieStore.get('connect.sid')
  if (!sid) {
    console.error("⛔Can't extract cookies")
    return
  }
  const cookieHeader = `connect.sid=${sid.value}`
  return cookieHeader
}