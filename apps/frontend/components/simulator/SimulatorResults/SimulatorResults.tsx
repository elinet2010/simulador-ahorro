'use client';

import { Box, Paper, Typography, Grid, Button, Divider } from '@mui/material';
import { useAppSelector } from '@/store/hooks';
import { Product } from '@/data/products';
import { formatCurrency, formatPercentage } from '@/lib/currency';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
interface SimulatorResultsProps {
  product: Product;
}

export default function SimulatorResults({ product }: SimulatorResultsProps) {
  const { calculatedResult, interestRate, initialAmount, monthlyContribution, months } = useAppSelector(
    (state) => state.simulator
  );
  const router = useRouter();
  if (!calculatedResult) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Resultados de la Simulación
      </Typography>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {/* Columna izquierda: Resultados */}
        <Grid item xs={12} sm={6} {...({} as any)}>
          <Grid container spacing={2}>
            {/* Monto final */}
            <Grid item xs={12} {...({} as any)}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'primary.light',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Monto Final
                </Typography>
                <Typography variant="h4" color="primary.contrastText" fontWeight="bold">
                  {formatCurrency(calculatedResult.finalAmount)}
                </Typography>
              </Box>
            </Grid>

            {/* Total aportado */}
            <Grid item xs={12} {...({} as any)}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'grey.200',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Aportado
                </Typography>
                <Typography variant="h4" color="text.primary" fontWeight="bold">
                  {formatCurrency(calculatedResult.totalContributed)}
                </Typography>
              </Box>
            </Grid>

            {/* Interés generado */}
            <Grid item xs={12} {...({} as any)}>
              <Box
                sx={{
                  p: 3,
                  backgroundColor: 'info.light',
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" color="text.primary" gutterBottom>
                  Interés Generado
                </Typography>
                <Typography variant="h4" color="success.contrastText" fontWeight="bold">
                  {formatCurrency(calculatedResult.interestEarned)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>

        {/* Columna derecha: Resumen */}
        <Grid item xs={12} sm={6} {...({} as any)}>
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Typography variant="h6" gutterBottom>
              Resumen
            </Typography>
            <Typography variant="body2" paragraph>
              Con un monto inicial de {formatCurrency(initialAmount)}
              {monthlyContribution > 0 && ` y aportes mensuales de ${formatCurrency(monthlyContribution)}`},
              después de {months} meses con una tasa del {formatPercentage(interestRate)} anual,
              habrás acumulado {formatCurrency(calculatedResult.finalAmount)}, generando {formatCurrency(calculatedResult.interestEarned)} en intereses.
            </Typography>
          </Box>
        </Grid>
      </Grid>


      <Divider sx={{ my: 4 }} />
      <Button variant="contained" color="secondary" onClick={() => router.push('/products')}>
        Ver otros productos <ArrowForwardIcon />
      </Button>
    </Paper>
  );
}

