/**
 * Utilidades para reCAPTCHA v3
 */

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

/**
 * Carga el script de reCAPTCHA v3
 * @param siteKey - Site key de reCAPTCHA
 */
export function loadRecaptchaScript(siteKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Validar siteKey
    if (!siteKey || siteKey.trim() === '') {
      reject(new Error('Site Key de reCAPTCHA no está configurado'));
      return;
    }

    // Verificar si ya está cargado
    if (window.grecaptcha) {
      resolve();
      return;
    }

    // Verificar si el script ya está en el DOM
    const existingScript = document.querySelector(
      'script[src*="recaptcha"]'
    );
    if (existingScript) {
      // Esperar a que se cargue con timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Timeout al cargar reCAPTCHA'));
        }
      }, 100);
      return;
    }

    // Crear y cargar el script de reCAPTCHA v3 con el site key
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
    script.async = true;
    script.defer = true;
    
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo
    
    script.onload = () => {
      // Esperar a que grecaptcha esté disponible con timeout
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.grecaptcha) {
          clearInterval(checkInterval);
          resolve();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          reject(new Error('Timeout: grecaptcha no se inicializó correctamente'));
        }
      }, 100);
    };
    
    script.onerror = () => {
      reject(new Error('Error al cargar el script de reCAPTCHA. Verifica tu conexión a internet y la configuración del Site Key.'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Genera un token simulado de reCAPTCHA para desarrollo
 * @param action - Acción a ejecutar
 * @returns Token simulado
 */
function generateMockToken(action: string): string {
  // Generar un token simulado que se vea realista
  // Formato: base64-like string de ~1000 caracteres
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const tokenLength = 1000;
  const token = Array.from({ length: tokenLength }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  
  // Agregar prefijo para identificar que es simulado
  return `dev_mock_${action}_${token}`;
}

/**
 * Ejecuta reCAPTCHA v3 y obtiene el token
 * @param siteKey - Site key de reCAPTCHA
 * @param action - Acción a ejecutar (default: 'submit')
 * @returns Token de reCAPTCHA
 */
export async function executeRecaptcha(
  siteKey: string,
  action: string = 'submit'
): Promise<string> {
  try {
    // Modo desarrollo: si no hay siteKey, generar token simulado
    if (!siteKey || siteKey.trim() === '') {
      console.warn(
        '⚠️ [reCAPTCHA] Modo desarrollo: Site Key no configurado. Generando token simulado.'
      );
      // Simular un pequeño delay como si fuera real
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockToken = generateMockToken(action);
      console.log('[reCAPTCHA] Token simulado generado (modo desarrollo)');
      return mockToken;
    }

    await loadRecaptchaScript(siteKey);

    return new Promise((resolve, reject) => {
      // Timeout para evitar que se quede colgado
      const timeout = setTimeout(() => {
        reject(new Error('Timeout al ejecutar reCAPTCHA'));
      }, 10000); // 10 segundos

      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(siteKey, { action })
          .then((token) => {
            clearTimeout(timeout);
            if (!token || token.trim() === '') {
              reject(new Error('Token de reCAPTCHA vacío'));
            } else {
              resolve(token);
            }
          })
          .catch((error) => {
            clearTimeout(timeout);
            const errorMessage = error instanceof Error 
              ? error.message 
              : 'Error desconocido al ejecutar reCAPTCHA';
            reject(new Error(errorMessage));
          });
      });
    });
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error al ejecutar reCAPTCHA';
    throw new Error(errorMessage);
  }
}

