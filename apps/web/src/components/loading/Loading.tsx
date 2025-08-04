import styles from './loading.module.css'
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export default function Loading() {
  return (
    <div className={`${styles.spinner} ${roboto.className}`}>
      Loading
      <span className={styles.dots}>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </span>
    </div>
  )
}
