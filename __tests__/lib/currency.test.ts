/**
 * Pruebas unitarias para utilidades de formato de moneda
 */

import {
  formatCurrency,
  formatCurrencyNumber,
  parseCurrency,
  formatPercentage,
} from '@/lib/currency';

describe('Utilidades de Moneda', () => {
  describe('formatCurrency', () => {
    it('debe formatear números grandes correctamente', () => {
      expect(formatCurrency(1000000)).toContain('1.000.000');
      expect(formatCurrency(1000000)).toContain('$');
    });

    it('debe formatear números pequeños correctamente', () => {
      expect(formatCurrency(50000)).toContain('50.000');
    });

    it('debe formatear cero correctamente', () => {
      expect(formatCurrency(0)).toContain('0');
    });

    it('debe formatear números con muchos dígitos', () => {
      const result = formatCurrency(50000000);
      expect(result).toContain('50.000.000');
    });

    it('debe usar formato colombiano (es-CO)', () => {
      const result = formatCurrency(1234567);
      // Debe usar punto como separador de miles
      expect(result).toContain('.');
    });
  });

  describe('formatCurrencyNumber', () => {
    it('debe formatear sin símbolo de moneda', () => {
      const result = formatCurrencyNumber(1000000);
      expect(result).toContain('1.000.000');
      expect(result).not.toContain('$');
    });

    it('debe formatear números correctamente', () => {
      expect(formatCurrencyNumber(50000)).toBe('50.000');
      expect(formatCurrencyNumber(1234567)).toBe('1.234.567');
    });
  });

  describe('parseCurrency', () => {
    it('debe parsear strings con formato de moneda', () => {
      expect(parseCurrency('$ 1.000.000')).toBe(1000000);
      expect(parseCurrency('50.000')).toBe(50000);
    });

    it('debe parsear strings sin formato', () => {
      expect(parseCurrency('1000000')).toBe(1000000);
      expect(parseCurrency('50000')).toBe(50000);
    });

    it('debe retornar 0 para strings vacíos', () => {
      expect(parseCurrency('')).toBe(0);
      expect(parseCurrency('   ')).toBe(0);
    });

    it('debe manejar strings con caracteres especiales', () => {
      expect(parseCurrency('$1.234.567,89')).toBe(1234567);
      expect(parseCurrency('COP 500.000')).toBe(500000);
    });

    it('debe extraer solo los dígitos', () => {
      expect(parseCurrency('abc123def456')).toBe(123456);
    });
  });

  describe('formatPercentage', () => {
    it('debe formatear porcentajes con 2 decimales por defecto', () => {
      expect(formatPercentage(4.5)).toBe('4.50%');
      expect(formatPercentage(6.2)).toBe('6.20%');
    });

    it('debe formatear porcentajes con decimales personalizados', () => {
      expect(formatPercentage(4.567, 1)).toBe('4.6%');
      expect(formatPercentage(6.234, 3)).toBe('6.234%');
    });

    it('debe formatear porcentajes enteros', () => {
      expect(formatPercentage(5)).toBe('5.00%');
      expect(formatPercentage(10)).toBe('10.00%');
    });

    it('debe manejar porcentajes con muchos decimales', () => {
      expect(formatPercentage(4.56789, 2)).toBe('4.57%');
    });
  });
});

