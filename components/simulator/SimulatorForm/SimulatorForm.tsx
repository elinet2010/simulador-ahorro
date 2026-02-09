'use client';

import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Box, Button, TextField, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setInitialAmount,
  setMonthlyContribution,
  setMonths,
  calculateResult,
} from '@/store/slices/simulatorSlice';
import { Product } from '@/data/products';
import { createSimulatorSchema } from '@/lib/validations';
import CurrencyInput from '@/components/ui/CurrencyInput/CurrencyInput';
import { formatCurrency, formatPercentage } from '@/lib/currency';

interface SimulatorFormProps {
  product: Product;
}

export default function SimulatorForm({ product }: SimulatorFormProps) {
  const dispatch = useAppDispatch();
  const { initialAmount, monthlyContribution, months, calculatedResult } =
    useAppSelector((state) => state.simulator);

  const validationSchema = createSimulatorSchema(product);

  const initialValues = {
    initialAmount: product.minAmount || 0,
    monthlyContribution: 0,
    months: product.minTime || 12,
  };

  // Inicializar valores en Redux al cargar el componente
  useEffect(() => {
    dispatch(setInitialAmount(initialValues.initialAmount));
    dispatch(setMonthlyContribution(initialValues.monthlyContribution));
    dispatch(setMonths(initialValues.months));
    dispatch(calculateResult());
  }, [dispatch, product.id]); // Solo cuando cambia el producto

  // Calcular automáticamente cuando cambien los valores
  useEffect(() => {
    if (initialAmount >= product.minAmount && months >= product.minTime) {
      dispatch(calculateResult());
    }
  }, [initialAmount, monthlyContribution, months, dispatch, product]);

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 4}}>
      <Typography variant="h5"  color="text.tertiary" gutterBottom>
        {product.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {product.description}
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          dispatch(setInitialAmount(values.initialAmount));
          dispatch(setMonthlyContribution(values.monthlyContribution));
          dispatch(setMonths(values.months));
          dispatch(calculateResult());
        }}
      >
        {({ values, errors, touched, setFieldValue, handleBlur }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Tasa de interés (solo lectura) */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <Typography variant="h4" color="text.tertiary" sx={{ mb: 3 }}>
                  {formatPercentage(product.interestRate)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Interés anual
                </Typography>
                
              </Grid>

              {/* Monto inicial */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <CurrencyInput
                  fullWidth
                  label="Monto inicial"
                  value={values.initialAmount}
                  onChange={(value) => {
                    setFieldValue('initialAmount', value);
                    dispatch(setInitialAmount(value));
                  }}
                  onBlur={handleBlur}
                  error={touched.initialAmount && !!errors.initialAmount}
                  helperText={
                    touched.initialAmount && errors.initialAmount
                      ? errors.initialAmount
                      : `Mínimo: ${formatCurrency(product.minAmount)}`
                  }
                  required
                />
              </Grid>

              {/* Aporte mensual */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <CurrencyInput
                  fullWidth
                  label="Aporte mensual"
                  value={values.monthlyContribution}
                  onChange={(value) => {
                    setFieldValue('monthlyContribution', value);
                    dispatch(setMonthlyContribution(value));
                  }}
                  onBlur={handleBlur}
                  error={
                    touched.monthlyContribution && !!errors.monthlyContribution
                  }
                  helperText={
                    touched.monthlyContribution && errors.monthlyContribution
                      ? errors.monthlyContribution
                      : 'Puede ser $0 si no deseas hacer aportes mensuales'
                  }
                  required
                />
              </Grid>

              {/* Meses */}
              <Grid item xs={12} md={6} {...({} as any)}>
                <Field
                  as={TextField}
                  fullWidth
                  name="months"
                  label="Plazo (meses)"
                  type="number"
                  inputProps={{ min: product.minTime, max: product.maxTime || 120 }}
                  error={touched.months && !!errors.months}
                  helperText={
                    touched.months && errors.months
                      ? errors.months
                      : `Mínimo: ${product.minTime} meses${
                          product.maxTime ? `, Máximo: ${product.maxTime} meses` : ''
                        }`
                  }
                  required
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = parseInt(e.target.value, 10) || 0;
                    setFieldValue('months', value);
                    dispatch(setMonths(value));
                  }}
                />
              </Grid>
              <Grid item xs={12} {...({} as any)}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={() => dispatch(calculateResult())}
                  disabled={!values.initialAmount || !values.monthlyContribution || !values.months}
                >
                  Calcular Rentabilidad
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}

