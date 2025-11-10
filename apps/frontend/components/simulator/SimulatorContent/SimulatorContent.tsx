'use client';

import { useEffect } from 'react';
import { Box, Typography, Alert, Button, Grid } from '@mui/material';
import { useAppDispatch } from '@/store/hooks';
import { setProductId, setInterestRate } from '@/store/slices/simulatorSlice';
import { getProductById } from '@/data/products';
import SimulatorForm from '../SimulatorForm/SimulatorForm';
import SimulatorResults from '../SimulatorResults/SimulatorResults';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface SimulatorContentProps {
  productId: number;
}

export default function SimulatorContent({ productId }: SimulatorContentProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Buscar el producto seleccionado
  const selectedProduct =
    getProductById(productId.toString()) ||
    getProductById('1') ||
    null;

  // Actualizar Redux con el producto seleccionado
  useEffect(() => {
    if (selectedProduct) {
      dispatch(setProductId(selectedProduct.id));
      dispatch(setInterestRate(selectedProduct.interestRate));
    }
  }, [dispatch, selectedProduct]);

  if (!selectedProduct) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', mt: 10 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Producto no encontrado
        </Alert>
        <Typography variant="body1">
          El producto con ID {productId} no existe. Por favor, selecciona un producto válido.
        </Typography>
        <Button variant="contained" color="primary" onClick={() => router.push('/products')}>
          <ArrowBackIcon />
          Volver a la lista de productos
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, mt: 10 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Simulador de Rentabilidad
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Calcula cuánto puedes ganar con tu plan de ahorro
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} {...({} as any)}>
          <SimulatorForm product={selectedProduct} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} {...({} as any)}>
          <SimulatorResults product={selectedProduct} />
        </Grid>
      </Grid>
    </Box>
  );
}


