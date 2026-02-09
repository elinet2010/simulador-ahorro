import { useEffect, useState } from 'react';

/**
 * Hook personalizado para debounce de valores
 * @param value - El valor a debounce
 * @param delay - El tiempo de espera en milisegundos (default: 300ms)
 * @returns El valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Crear un timer que actualizará el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el timer si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

