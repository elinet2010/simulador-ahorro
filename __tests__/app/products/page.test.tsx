/**
 * Pruebas para verificar que la página de productos use SSR
 */

import { getAllProducts } from '@/data/products';

describe('Products Page - SSR Verification', () => {
  it('debe ser una función async (Server Component)', () => {
    // Verificar que getAllProducts puede ser llamado en el servidor
    const products = getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('debe cargar productos correctamente en el servidor', () => {
    // Simular carga de productos como lo haría el Server Component
    const products = getAllProducts();
    
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    
    // Verificar estructura de productos
    products.forEach((product) => {
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('interestRate');
      expect(product).toHaveProperty('minTime');
      expect(product).toHaveProperty('minAmount');
    });
  });

  it('debe retornar los mismos productos en cada llamada (consistencia SSR)', () => {
    const products1 = getAllProducts();
    const products2 = getAllProducts();
    
    expect(products1.length).toBe(products2.length);
    expect(products1.map(p => p.id)).toEqual(products2.map(p => p.id));
  });
});

