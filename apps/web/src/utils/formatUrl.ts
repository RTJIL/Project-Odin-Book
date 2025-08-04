export default function formatUrl(raw: string) {
  if (!raw) throw new Error('URL required')
  const url = raw.trim()
  return url.endsWith('/') ? url : `${url}/`
}
