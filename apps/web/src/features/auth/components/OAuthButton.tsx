import { FcGoogle } from 'react-icons/fc'
import { useState } from 'react'

type Props = {
  className?: string
}

export default function OAuthButton({ className }: Props) {
  const [loading, setLoading] = useState(false)

  const handleClick = () => {
    try {
      setLoading(true)
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={className}
      aria-label="Continue with Google"
      type="button"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.15)',
            padding: 6,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FcGoogle size={24} />
        </div>
        <span style={{ flex: 1, textAlign: 'center' }}>
          Continue with Google
        </span>
      </div>
    </button>
  )
}
