import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import SimulatorContent from '@/components/simulator/SimulatorContent/SimulatorContent';

interface SimulatorPageProps {
  searchParams: Promise<{ productId?: string }>;
}

export default async function SimulatorPage({
  searchParams,
}: SimulatorPageProps) {
  const params = await searchParams;
  
  // Leer productId de la URL, usar 1 por defecto
  const productId = params.productId
    ? parseInt(params.productId, 10)
    : 1;

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      }
    >
      <SimulatorContent productId={productId} />
    </Suspense>
  );
}


