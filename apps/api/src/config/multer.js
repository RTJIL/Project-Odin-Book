import multer from 'multer'
import path from 'path'
import fs from 'fs'

const UPLOAD_DIR = path.join(process.cwd(), 'src/uploads')
fs.mkdirSync(UPLOAD_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `image-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/gif']
    allowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Bad file type'))
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})
