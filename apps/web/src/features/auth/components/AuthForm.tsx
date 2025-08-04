'use client'

import styles from '../auth.module.css'
import Link from 'next/link'
import { useState } from 'react'
import OAuthButton from './OAuthButton'
import GuestButton from './GuestButton'
import { loginUser, registerUser } from '../services/api'
import extractError from '@/utils/extractError'
import { useRouter } from 'next/navigation'

type ErrorShape = Record<string, string>

export default function AuthForm({ login = false }: { login?: boolean }) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<ErrorShape>({})

  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log(e)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    if (loading) return

    try {
      setLoading(true)
      if (login) {
        await loginUser(username, password)
        router.push('/home')
      } else {
        await registerUser(username, password)
      }
    } catch (err: unknown) {
      console.log(err)
      setErrors(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['form-container']}>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2 className={styles.title}>{login ? 'Login' : 'Register'}</h2>

        <div className={styles.field}>
          <label htmlFor="username" className={styles.srOnly}>
            Username
          </label>
          <input
            required
            type="text"
            id="username"
            name="username"
            placeholder="Enter username"
            autoComplete="off"
            className={styles.input}
          />
        </div>

        <div className={`${styles.field} ${!login ? styles.register : ''}`}>
          <label htmlFor="password" className={styles.srOnly}>
            Password
          </label>
          <input
            required
            type="password"
            id="password"
            name="password"
            placeholder="Enter password"
            autoComplete="off"
            className={styles.input}
          />
        </div>

        {!login && (
          <div className={styles.field}>
            <label htmlFor="cpassword" className={styles.srOnly}>
              Confirm Password
            </label>
            <input
              required
              type="password"
              id="cpassword"
              name="cpassword"
              placeholder="Confirm password"
              autoComplete="off"
              className={styles.input}
            />
          </div>
        )}

        {login && (
          <div className={styles.optional}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="remember"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <Link className={styles.link} href="/restore-pass">
              Forgot password?
            </Link>
          </div>
        )}
        <button
          type="submit"
          className={styles.submit}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className={styles.spinner} aria-label="loading" />
          ) : login ? (
            'Login'
          ) : (
            'Register'
          )}
        </button>

        <p className={styles.switchText}>
          {login ? "Don't have an account?" : 'Already have one?'}{' '}
          <Link
            className={styles.switchLink}
            href={login ? '/register' : '/'}
          >
            {login ? 'Register' : 'Login'}
          </Link>
        </p>

        <div className={styles.orWrapper}>
          <span className={styles.or}>OR</span>
        </div>

        <OAuthButton className={styles['oauth-button']} />
        <GuestButton className={styles['oauth-button']} />
      </form>
    </div>
  )
}
