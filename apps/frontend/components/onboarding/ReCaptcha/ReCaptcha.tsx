'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Box, Alert } from '@mui/material';
import { executeRecaptcha } from '@/lib/recaptcha';

interface ReCaptchaProps {
  siteKey: string;
  onTokenChange: (token: string | null) => void;
  onError?: (error: string) => void;
}

export default function ReCaptcha({
  siteKey,
  onTokenChange,
  onError,
}: ReCaptchaProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasLoadedRef = useRef(false);

  // Memoizar callbacks para evitar re-renders infinitos
  const handleTokenChange = useCallback(
    (token: string | null) => {
      onTokenChange(token);
    },
    [onTokenChange]
  );

  const handleError = useCallback(
    (errorMessage: string) => {
      if (onError) {
        onError(errorMessage);
      }
    },
    [onError]
  );

  useEffect(() => {
    // Evitar cargar múltiples veces
    if (hasLoadedRef.current) {
      return;
    }

    const loadToken = async () => {
      try {
        setIsLoading(true);
        setError(null);
        hasLoadedRef.current = true;

        // Modo desarrollo: funciona sin siteKey (genera token simulado)
        if (!siteKey || siteKey.trim() === '') {
          console.warn(
            '⚠️ [reCAPTCHA] Modo desarrollo: Site Key no configurado. Usando token simulado.'
          );
        } else {
          console.log('[reCAPTCHA] Iniciando carga...', { siteKey: siteKey.substring(0, 10) + '...' });
        }

        const token = await executeRecaptcha(siteKey, 'onboarding');
        
        if (!siteKey || siteKey.trim() === '') {
          console.log('[reCAPTCHA] Token simulado generado (modo desarrollo)');
        } else {
          console.log('[reCAPTCHA] Token obtenido exitosamente');
        }
        
        handleTokenChange(token);
        setError(null);
      } catch (err) {
        hasLoadedRef.current = false; // Permitir reintento
        const errorMessage =
          err instanceof Error ? err.message : 'Error al cargar reCAPTCHA';
        console.error('[reCAPTCHA] Error:', err);
        setError(errorMessage);
        handleTokenChange(null);
        handleError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, [siteKey, handleTokenChange, handleError]);

  // Mostrar errores aunque el componente sea invisible
  // Los errores se mostrarán en el OnboardingForm
  return (
    <Box sx={{ display: 'none' }}>
      {/* Este componente es invisible, pero los errores se manejan en el padre */}
    </Box>
  );
}


