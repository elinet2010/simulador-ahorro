/**
 * Pruebas unitarias para validaciones
 */

import { createSimulatorSchema } from '@/lib/validations';
import { Product } from '@/data/products';

// Mock de producto para pruebas
const mockProduct: Product = {
  id: '1',
  name: 'Producto Test',
  interestRate: 6.2,
  minTime: 12,
  maxTime: 60,
  minAmount: 100000,
  maxAmount: 5000000,
  description: 'Producto de prueba',
  category: 'ahorro',
  features: ['Feature 1', 'Feature 2'],
};

describe('Validaciones del Simulador', () => {
  describe('createSimulatorSchema', () => {
    it('debe validar monto inicial mayor o igual al mínimo', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('initialAmount', { initialAmount: 100000 })
      ).resolves.toBe(100000);
      
      await expect(
        schema.validateAt('initialAmount', { initialAmount: 50000 })
      ).rejects.toThrow();
    });

    it('debe validar monto inicial menor o igual al máximo', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('initialAmount', { initialAmount: 5000000 })
      ).resolves.toBe(5000000);
      
      await expect(
        schema.validateAt('initialAmount', { initialAmount: 6000000 })
      ).rejects.toThrow();
    });

    it('debe validar que monto inicial sea requerido', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('initialAmount', { initialAmount: undefined })
      ).rejects.toThrow();
    });

    it('debe validar aporte mensual mayor o igual a 0', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('monthlyContribution', { monthlyContribution: 0 })
      ).resolves.toBe(0);
      
      await expect(
        schema.validateAt('monthlyContribution', { monthlyContribution: -1000 })
      ).rejects.toThrow();
    });

    it('debe validar que aporte mensual sea requerido', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('monthlyContribution', { monthlyContribution: undefined })
      ).rejects.toThrow();
    });

    it('debe validar meses mayor o igual al mínimo', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('months', { months: 12 })
      ).resolves.toBe(12);
      
      await expect(
        schema.validateAt('months', { months: 6 })
      ).rejects.toThrow();
    });

    it('debe validar meses menor o igual al máximo', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('months', { months: 60 })
      ).resolves.toBe(60);
      
      await expect(
        schema.validateAt('months', { months: 70 })
      ).rejects.toThrow();
    });

    it('debe validar que meses sea un entero', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('months', { months: 12.5 })
      ).rejects.toThrow();
    });

    it('debe validar que meses sea requerido', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      await expect(
        schema.validateAt('months', { months: undefined })
      ).rejects.toThrow();
    });

    it('debe manejar productos sin máximo', async () => {
      const productWithoutMax: Product = {
        ...mockProduct,
        maxAmount: undefined,
        maxTime: undefined,
      };
      
      const schema = createSimulatorSchema(productWithoutMax);
      
      // Debe aceptar cualquier valor alto para monto
      await expect(
        schema.validateAt('initialAmount', { initialAmount: 10000000 })
      ).resolves.toBe(10000000);
    });

    it('debe validar valores válidos completos', async () => {
      const schema = createSimulatorSchema(mockProduct);
      
      const validData = {
        initialAmount: 500000,
        monthlyContribution: 200000,
        months: 24,
      };
      
      await expect(schema.validate(validData)).resolves.toEqual(validData);
    });
  });
});

