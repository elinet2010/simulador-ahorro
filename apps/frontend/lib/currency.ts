/**
 * Utilidades para formatear moneda
 */

/**
 * Formatea un número como moneda colombiana (COP)
 * @param amount - Monto a formatear
 * @returns String formateado como moneda (ej: "$ 1.000.000")
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formatea un número como moneda sin símbolo (solo números con separadores)
 * @param amount - Monto a formatear
 * @returns String formateado (ej: "1.000.000")
 */
export function formatCurrencyNumber(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Convierte un string formateado como moneda a número
 * @param value - String con formato de moneda
 * @returns Número o NaN si no es válido
 */
export function parseCurrency(value: string): number {
  // Remover todos los caracteres que no sean dígitos
  const numericValue = value.replace(/[^\d]/g, '');
  return numericValue ? parseInt(numericValue, 10) : 0;
}

/**
 * Formatea un porcentaje
 * @param value - Valor del porcentaje (ej: 4.5 para 4.5%)
 * @param decimals - Número de decimales (default: 2)
 * @returns String formateado (ej: "4.50%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}


