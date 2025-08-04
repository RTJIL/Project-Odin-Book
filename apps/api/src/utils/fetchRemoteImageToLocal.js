import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'

const UPLOAD_DIR = path.join(process.cwd(), 'src/uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

export async function fetchRemoteImageToLocal(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error('fetch failed')
  const ct = (res.headers.get('content-type') || '').toLowerCase()
  if (!/^image\/(png|jpe?g|gif)/.test(ct))
    throw new Error('unsupported type')

  const ext = ct.includes('png')
    ? '.png'
    : ct.includes('gif')
    ? '.gif'
    : '.jpg'
  const filename = `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
  const outPath = path.join(UPLOAD_DIR, filename)
  const writeStream = fs.createWriteStream(outPath)

  if (!res.body) throw new Error('no body')

  await pipeline(res.body, writeStream)

  return {
    diskPath: outPath,
    publicPath: `/uploads/${filename}`,
  }
}
