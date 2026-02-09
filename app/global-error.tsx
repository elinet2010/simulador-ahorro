'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error('🔴 Error en global-error:', error)
  }, [error])

  return (
    <html>
      <body style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
        <h2>Ocurrió un error 😢</h2>
        <p>{error.message}</p>
        <button
          onClick={() => reset()}
          style={{
            background: '#000',
            color: '#fff',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            marginTop: '1rem',
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  )
}
