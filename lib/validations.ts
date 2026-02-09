import * as Yup from 'yup';
import { Product } from '@/data/products';
import { formatCurrency } from './currency';

/**
 * Crea un esquema de validación dinámico basado en el producto seleccionado
 */
export function createSimulatorSchema(product: Product) {
  return Yup.object({
    initialAmount: Yup.number()
      .min(
        product.minAmount,
        `El monto inicial debe ser al menos ${formatCurrency(product.minAmount)}`
      )
      .max(
        product.maxAmount || Infinity,
        product.maxAmount
          ? `El monto inicial no puede exceder ${formatCurrency(product.maxAmount)}`
          : undefined
      )
      .required('El monto inicial es requerido')
      .typeError('Ingrese un monto válido'),
    monthlyContribution: Yup.number()
      .min(0, 'El aporte mensual debe ser mayor o igual a 0')
      .required('El aporte mensual es requerido')
      .typeError('Ingrese un monto válido'),
    months: Yup.number()
      .min(
        product.minTime,
        `El plazo mínimo es de ${product.minTime} meses`
      )
      .max(
        product.maxTime || 120,
        `El plazo máximo es de ${product.maxTime || 120} meses`
      )
      .integer('Debe ser un número entero de meses')
      .required('El número de meses es requerido')
      .typeError('Ingrese un número válido'),
  });
}


