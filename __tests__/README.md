# Pruebas Unitarias

Este directorio contiene todas las pruebas unitarias del proyecto.

## Estructura de Pruebas

```
__tests__/
├── app/
│   └── products/
│       └── page.test.tsx          # Verificación de SSR en products
├── data/
│   └── products.test.ts           # Pruebas de funciones de productos
├── hooks/
│   └── useDebounce.test.ts        # Pruebas del hook useDebounce
├── lib/
│   ├── currency.test.ts           # Pruebas de utilidades de moneda
│   └── validations.test.ts        # Pruebas de validaciones
└── simulator/
    └── calculateInterest.test.ts  # Pruebas de cálculo de interés
```

## Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con cobertura
npm run test:coverage
```

## Cobertura de Pruebas

Las pruebas cubren:

- ✅ **Cálculo de Interés**: Fórmulas de interés compuesto, diferentes escenarios
- ✅ **Validaciones**: Esquemas de validación del simulador
- ✅ **Utilidades de Moneda**: Formato y parseo de moneda
- ✅ **Funciones de Productos**: Búsqueda, filtrado, obtención por ID/categoría
- ✅ **Hooks**: useDebounce con diferentes tipos de valores
- ✅ **SSR Verification**: Verificación de que products use SSR

## Notas

- Las pruebas usan Jest y React Testing Library
- Se configuran timers falsos para pruebas de debounce
- Se mockean datos cuando es necesario
- Todas las pruebas son independientes y pueden ejecutarse en cualquier orden

