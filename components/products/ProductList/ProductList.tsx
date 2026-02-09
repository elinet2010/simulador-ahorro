'use client';

import { Grid, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Product } from '@/data/products';
import ProductCard from '../ProductCard/ProductCard';

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const theme = useTheme();

  if (products.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.secondary }}>
          No se encontraron productos
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="products-grid">
      {products.map((product) => (
        <Box key={product.id}>
          <ProductCard product={product} />
        </Box>
      ))}
    </Box>
  );
}
