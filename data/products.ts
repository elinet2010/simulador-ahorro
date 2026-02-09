/**
 * Datos mock de productos de ahorro digital
 * Esta información será consumida para mostrar el listado de planes
 */

export interface Product {
  id: string;
  name: string;
  interestRate: number; // Tasa de interés anual en porcentaje
  minTime: number; // Tiempo mínimo de ahorro en meses
  maxTime?: number; // Tiempo máximo de ahorro en meses (opcional)
  minAmount: number; // Monto mínimo en pesos
  maxAmount?: number; // Monto máximo en pesos (opcional)
  description: string;
  category: 'ahorro' | 'inversion' | 'cdt' | 'deposito';
  features: string[]; // Características destacadas
  image?: string; // URL de imagen (opcional)
  isPopular?: boolean; // Si es un producto destacado
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Ahorro Digital Básico',
    interestRate: 4.5,
    minTime: 6,
    minAmount: 100000,
    description: 'Ideal para comenzar tu plan de ahorro. Rentabilidad estable y acceso fácil a tus fondos.',
    category: 'ahorro',
    features: [
      'Sin comisiones de manejo',
      'Retiros parciales permitidos',
      'Aplicación móvil incluida',
    ],
    isPopular: true,
  },
  {
    id: '2',
    name: 'Ahorro Digital Plus',
    interestRate: 6.2,
    minTime: 12,
    minAmount: 500000,
    description: 'Mayor rentabilidad para quienes pueden comprometerse a ahorrar por más tiempo.',
    category: 'ahorro',
    features: [
      'Tasa de interés preferencial',
      'Asesoría personalizada',
      'Seguro de ahorro incluido',
    ],
    isPopular: true,
  },
  {
    id: '3',
    name: 'Inversión Digital Inteligente',
    interestRate: 8.5,
    minTime: 24,
    minAmount: 1000000,
    description: 'Producto de inversión con mayor rentabilidad para objetivos a mediano y largo plazo.',
    category: 'inversion',
    features: [
      'Rentabilidad superior',
      'Reinversión automática',
      'Reportes mensuales detallados',
    ],
    isPopular: false,
  },
  {
    id: '4',
    name: 'CDT Digital',
    interestRate: 7.8,
    minTime: 36,
    minAmount: 2000000,
    description: 'Certificado de Depósito a Término con las mejores tasas del mercado digital.',
    category: 'cdt',
    features: [
      'Tasa fija garantizada',
      'Sin riesgo de pérdida',
      'Liquidación automática al vencimiento',
    ],
    isPopular: false,
  },
  {
    id: '5',
    name: 'Ahorro Joven',
    interestRate: 5.0,
    minTime: 3,
    minAmount: 50000,
    description: 'Diseñado especialmente para jóvenes que inician su vida financiera.',
    category: 'ahorro',
    features: [
      'Monto mínimo accesible',
      'Plazo flexible',
      'Educación financiera incluida',
    ],
    isPopular: true,
  },
  {
    id: '6',
    name: 'Depósito a Plazo Fijo',
    interestRate: 6.5,
    minTime: 18,
    minAmount: 300000,
    description: 'Depósito seguro con rentabilidad fija y garantizada durante todo el período.',
    category: 'deposito',
    features: [
      'Capital garantizado',
      'Tasa fija durante todo el plazo',
      'Sin variaciones de mercado',
    ],
    isPopular: false,
  },
  {
    id: '7',
    name: 'Ahorro Programado',
    interestRate: 5.5,
    minTime: 12,
    minAmount: 200000,
    description: 'Ahorra de forma automática con débitos programados y obtén beneficios adicionales.',
    category: 'ahorro',
    features: [
      'Débito automático mensual',
      'Bonificación por constancia',
      'Meta de ahorro personalizada',
    ],
    isPopular: false,
  },
  {
    id: '8',
    name: 'Inversión Premium',
    interestRate: 9.2,
    minTime: 48,
    minAmount: 5000000,
    description: 'Producto exclusivo para grandes inversores con máxima rentabilidad y beneficios premium.',
    category: 'inversion',
    features: [
      'Tasa premium exclusiva',
      'Asesoría financiera personalizada',
      'Acceso a eventos exclusivos',
      'Gestor de cuenta dedicado',
    ],
    isPopular: false,
  },
];

/**
 * Obtener todos los productos
 */
export const getAllProducts = (): Product[] => {
  return products;
};

/**
 * Obtener producto por ID
 */
export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter((product) => product.category === category);
};

/**
 * Obtener productos populares
 */
export const getPopularProducts = (): Product[] => {
  return products.filter((product) => product.isPopular === true);
};

/**
 * Buscar productos por nombre, descripción o tipo/categoría
 */
export const searchProducts = (query: string): Product[] => {
  const lowerQuery = query.toLowerCase();
  const categoryLabels: Record<string, string> = {
    ahorro: 'ahorro',
    inversion: 'inversión',
    cdt: 'cdt',
    deposito: 'depósito',
  };
  
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      categoryLabels[product.category]?.toLowerCase().includes(lowerQuery)
  );
};

