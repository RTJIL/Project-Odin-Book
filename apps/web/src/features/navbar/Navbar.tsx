'use client'

import styles from './navbar.module.css'
import { FaHome, FaUser } from 'react-icons/fa'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logout } from '../services/api'
import { User } from '@/utils/types'
import { useEffect, useState } from 'react'

interface NavbarProps {
  auth: User
}

export default function Navbar({ auth }: NavbarProps) {
  const [nav, setNav] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setNav((prev) => !prev)
  }, [auth])

  const handleLogout = async () => {
    try {
      const res = await logout()
      router.push('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className={`${styles.container}`}>
      <Link href={'/home'} className={styles.link}>
        <button className={styles.home}>
          <FaHome /> <span>Home</span>
        </button>
      </Link>

      <button className={styles.profile}>
        <FaUser />
        <span>Profile</span>
      </button>

      <button className={styles.logout} onClick={handleLogout}>
        <RiLogoutBoxRLine />
        <span>Logout</span>
      </button>
    </div>
  )
}
