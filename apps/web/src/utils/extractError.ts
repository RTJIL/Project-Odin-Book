export type ErrorShape = Record<string, string>

export default function extractError(e: unknown): ErrorShape {
  if (typeof e === 'object' && e !== null) {
    const anyE = e as any
    if (anyE.fields && typeof anyE.fields === 'object') {
      return anyE.fields as ErrorShape
    }
    if (typeof anyE.error === 'string') {
      return { general: anyE.error }
    }
    if (typeof anyE.message === 'string') {
      return { general: anyE.message }
    }
  }
  if (e instanceof Error) {
    return { general: e.message }
  }
  return { general: 'Something went wrong' }
}
