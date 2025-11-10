import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Hook que hace scroll al inicio de la página cuando cambia la ruta
 * @param behavior - Comportamiento del scroll ('smooth' | 'auto')
 */
export function useScrollToTop(behavior: ScrollBehavior = 'smooth') {
  const pathname = usePathname();

  useEffect(() => {
    // Hacer scroll al inicio cuando cambia la ruta
    window.scrollTo({ top: 0, left: 0, behavior });
  }, [pathname, behavior]);
}

