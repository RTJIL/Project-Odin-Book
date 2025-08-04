import { FaGhost } from 'react-icons/fa'
import { useState } from 'react'

type Props = {
  className?: string
}

export default function GuestButton({ className }: Props) {
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
      aria-label="Continue as Guest"
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
          <FaGhost size={24} />
        </div>
        <span style={{ flex: 1, textAlign: 'center' }}>
          Continue as a Guest
        </span>
      </div>
    </button>
  )
}
