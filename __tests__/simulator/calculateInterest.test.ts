/**
 * Pruebas unitarias para el cálculo de interés compuesto
 */

// Función auxiliar para calcular el valor futuro (extraída del slice para testing)
function calculateFutureValue(
  initialAmount: number,
  monthlyContribution: number,
  annualInterestRate: number,
  months: number
): {
  finalAmount: number;
  totalContributed: number;
  interestEarned: number;
} {
  const monthlyRate = annualInterestRate / 100 / 12;
  
  // Valor futuro del monto inicial con interés compuesto
  const futureValueInitial = initialAmount * Math.pow(1 + monthlyRate, months);
  
  // Valor futuro de los aportes mensuales (anualidad)
  let futureValueContributions = 0;
  if (monthlyContribution > 0 && monthlyRate > 0) {
    futureValueContributions = monthlyContribution * 
      ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  } else if (monthlyContribution > 0) {
    // Si la tasa es 0, solo suma los aportes sin interés
    futureValueContributions = monthlyContribution * months;
  }
  
  const finalAmount = futureValueInitial + futureValueContributions;
  const totalContributed = initialAmount + (monthlyContribution * months);
  const interestEarned = finalAmount - totalContributed;
  
  return {
    finalAmount,
    totalContributed,
    interestEarned,
  };
}

describe('Cálculo de Interés Compuesto', () => {
  describe('calculateFutureValue', () => {
    it('debe calcular correctamente con solo monto inicial', () => {
      const result = calculateFutureValue(1000000, 0, 6.2, 12);
      
      // Monto inicial: 1,000,000
      // Tasa mensual: 6.2% / 12 = 0.5167%
      // Valor futuro: 1,000,000 * (1.005167)^12 ≈ 1,063,800
      expect(result.totalContributed).toBe(1000000);
      expect(result.finalAmount).toBeGreaterThan(1000000);
      expect(result.interestEarned).toBeGreaterThan(0);
      expect(result.interestEarned).toBeCloseTo(63800, -3); // Aproximadamente 63,800
    });

    it('debe calcular correctamente con monto inicial y aportes mensuales', () => {
      const result = calculateFutureValue(1000000, 200000, 6.2, 12);
      
      // Total aportado: 1,000,000 + (200,000 * 12) = 3,400,000
      expect(result.totalContributed).toBe(3400000);
      expect(result.finalAmount).toBeGreaterThan(result.totalContributed);
      expect(result.interestEarned).toBeGreaterThan(0);
    });

    it('debe manejar correctamente tasa de interés cero', () => {
      const result = calculateFutureValue(1000000, 200000, 0, 12);
      
      // Sin interés, el monto final debe ser igual al total aportado
      expect(result.totalContributed).toBe(3400000);
      expect(result.finalAmount).toBe(3400000);
      expect(result.interestEarned).toBe(0);
    });

    it('debe manejar correctamente sin aportes mensuales', () => {
      const result = calculateFutureValue(500000, 0, 5.0, 6);
      
      expect(result.totalContributed).toBe(500000);
      expect(result.finalAmount).toBeGreaterThan(500000);
      expect(result.interestEarned).toBeGreaterThan(0);
    });

    it('debe calcular correctamente con diferentes plazos', () => {
      const result12 = calculateFutureValue(1000000, 200000, 6.2, 12);
      const result24 = calculateFutureValue(1000000, 200000, 6.2, 24);
      
      // A mayor plazo, mayor debe ser el interés ganado
      expect(result24.interestEarned).toBeGreaterThan(result12.interestEarned);
      expect(result24.finalAmount).toBeGreaterThan(result12.finalAmount);
    });

    it('debe calcular correctamente con diferentes tasas de interés', () => {
      const resultLow = calculateFutureValue(1000000, 200000, 4.5, 12);
      const resultHigh = calculateFutureValue(1000000, 200000, 8.5, 12);
      
      // Mayor tasa debe generar más interés
      expect(resultHigh.interestEarned).toBeGreaterThan(resultLow.interestEarned);
      expect(resultHigh.finalAmount).toBeGreaterThan(resultLow.finalAmount);
    });

    it('debe retornar valores válidos con montos grandes', () => {
      const result = calculateFutureValue(5000000, 500000, 9.2, 48);
      
      expect(result.finalAmount).toBeGreaterThan(0);
      expect(result.totalContributed).toBe(29000000); // 5M + (500K * 48)
      expect(result.interestEarned).toBeGreaterThan(0);
      expect(Number.isFinite(result.finalAmount)).toBe(true);
      expect(Number.isFinite(result.interestEarned)).toBe(true);
    });

    it('debe manejar correctamente montos pequeños', () => {
      const result = calculateFutureValue(50000, 10000, 5.0, 3);
      
      expect(result.totalContributed).toBe(80000); // 50K + (10K * 3)
      expect(result.finalAmount).toBeGreaterThan(result.totalContributed);
      expect(result.interestEarned).toBeGreaterThan(0);
    });

    it('debe calcular correctamente el interés compuesto mensual', () => {
      // Verificación matemática: con 1,000,000 a 6% anual por 12 meses
      // Tasa mensual: 0.5%
      // Valor futuro: 1,000,000 * (1.005)^12 ≈ 1,061,677.81
      const result = calculateFutureValue(1000000, 0, 6, 12);
      
      expect(result.finalAmount).toBeCloseTo(1061677.81, 0);
      expect(result.interestEarned).toBeCloseTo(61677.81, 0);
    });
  });
});

