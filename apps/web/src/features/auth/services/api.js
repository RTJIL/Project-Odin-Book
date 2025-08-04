import formatUrl from '@/utils/formatUrl'

const rawBase = process.env.NEXT_PUBLIC_API_BASE
if (!rawBase) throw new Error('Missing NEXT_PUBLIC_API_BASE')
const apiBase = formatUrl(rawBase)

async function handleError(res) {
  let payload = {}
  try {
    payload = await res.json()
  } catch {} 
  
  const error = payload.error || payload.message || 'Unknown error'
  const normalized = {}

  if (payload.fields && typeof payload.fields === 'object') {
    normalized.fields = payload.fields
  }
  normalized.error = error
  throw normalized
}

export async function loginUser(username, password) {
  const res = await fetch(`${apiBase}api/auth/local/login`, {
    mode: 'cors',
    credentials: 'include', 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()

  console.log(data)

  if (!res.ok) {
    await handleError(res)
  }
}

export async function registerUser(username, password) {
  const res = await fetch(`${apiBase}api/auth/local/register`, {
    mode: 'cors',
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  if (!res.ok) {
    await handleError(res)
  }
}
