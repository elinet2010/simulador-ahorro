import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SimulatorState {
  initialAmount: number;
  monthlyContribution: number;
  months: number;
  interestRate: number; // Tasa de interés anual
  productId: string | null;
  calculatedResult: {
    finalAmount: number;
    totalContributed: number;
    interestEarned: number;
  } | null;
}

const initialState: SimulatorState = {
  initialAmount: 0,
  monthlyContribution: 0,
  months: 12,
  interestRate: 0,
  productId: null,
  calculatedResult: null,
};

// Función auxiliar para calcular el valor futuro
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

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    setInitialAmount: (state, action: PayloadAction<number>) => {
      state.initialAmount = action.payload;
      state.calculatedResult = null;
    },
    setMonthlyContribution: (state, action: PayloadAction<number>) => {
      state.monthlyContribution = action.payload;
      state.calculatedResult = null;
    },
    setMonths: (state, action: PayloadAction<number>) => {
      state.months = action.payload;
      state.calculatedResult = null;
    },
    setInterestRate: (state, action: PayloadAction<number>) => {
      state.interestRate = action.payload;
      state.calculatedResult = null;
    },
    setProductId: (state, action: PayloadAction<string>) => {
      state.productId = action.payload;
      state.calculatedResult = null;
    },
    calculateResult: (state) => {
      const { initialAmount, monthlyContribution, interestRate, months } = state;
      
      // Validar que los valores sean válidos antes de calcular
      if (initialAmount < 0 || monthlyContribution < 0 || months < 1) {
        return;
      }
      
      state.calculatedResult = calculateFutureValue(
        initialAmount,
        monthlyContribution,
        interestRate,
        months
      );
    },
    resetSimulator: (state) => {
      return initialState;
    },
  },
});

export const {
  setInitialAmount,
  setMonthlyContribution,
  setMonths,
  setInterestRate,
  setProductId,
  calculateResult,
  resetSimulator,
} = simulatorSlice.actions;

export default simulatorSlice.reducer;


