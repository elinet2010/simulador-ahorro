'use client';

// Evitar prerender de esta página
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Función de reset que se ejecuta solo en el cliente
  const handleReset = () => {
    if (typeof window !== 'undefined' && reset) {
      reset();
    }
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Simulador de Ahorro Digital</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1a1a1a' }}>
            Algo salió mal
          </h1>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Ha ocurrido un error inesperado. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#00cecb',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 500,
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}

