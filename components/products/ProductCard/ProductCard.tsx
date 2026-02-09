'use client';

import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import './ProductCard.css';
import { useTheme } from '@mui/material/styles';
import { Product } from '@/data/products';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const theme = useTheme();
  const router = useRouter();

  const handleSimulate = () => {
    router.push(`/simulator?productId=${product.id}`);
    // Scroll al inicio de la página
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <Card
      className="product-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: `0 12px 24px ${theme.palette.primary.main}40`,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header con nombre y badge popular */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            className="product-card-title"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: '1.5rem',
              flex: 1,
            }}
          >
            {product.name}
          </Typography>
          {product.isPopular && (
            <Chip
              label="Popular"
              size="small"
              sx={{
                backgroundColor: theme.palette.warning.main,
                color: theme.palette.text.primary,
                fontWeight: 600,
                ml: 1,
              }}
            />
          )}
        </Box>

        {/* Tasa de interés destacada */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
            p: 2,
            backgroundColor: theme.palette.primary.main + '15',
            borderRadius: 2,
          }}
        >
          <TrendingUpIcon sx={{ color: theme.palette.primary.main }} />
          <Typography
            variant="h4"
            component="div"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
            }}
          >
            {product.interestRate}%
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary, ml: 1 }}>
            Tasa anual
          </Typography>
        </Box>

        {/* Descripción */}
        <Typography
          variant="body1"
          className="product-card-description"
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            minHeight: '3rem',
          }}
        >
          {product.description}
        </Typography>

        {/* Información clave */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccessTimeIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Tiempo mínimo: <strong>{product.minTime} meses</strong>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AttachMoneyIcon sx={{ color: theme.palette.text.secondary, fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Monto mínimo: <strong>${product.minAmount.toLocaleString('es-CO')}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Características */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: theme.palette.text.secondary, fontWeight: 600, mb: 1, display: 'block' }}>
            Características:
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {product.features.slice(0, 3).map((feature, index) => (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontSize: '0.875rem',
                  '&::before': {
                    content: '"✓ "',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    mr: 0.5,
                  },
                }}
              >
                {feature}
              </Typography>
            ))}
          </Box>
        </Box>

        {/* Botón Simular */}
        <Button
          variant="contained"
          fullWidth
          endIcon={<ArrowForwardIcon />}
          onClick={handleSimulate}
          className="product-card-button"
        >
          Simular
        </Button>
      </CardContent>
    </Card>
  );
}

