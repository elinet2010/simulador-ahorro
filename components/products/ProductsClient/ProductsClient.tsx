'use client';

import { useState, useMemo } from 'react';
import { Container, Typography, Box, useTheme } from '@mui/material';
import { Product } from '@/data/products';
import ProductList from '@/components/products/ProductList/ProductList';
import ProductSearch from '@/components/products/ProductFilters/ProductFilters';

interface ProductsClientProps {
  products: Product[];
}

/**
 * Función auxiliar para filtrar productos localmente
 * Filtra por nombre, descripción o categoría
 */
function filterProducts(products: Product[], query: string): Product[] {
  if (!query.trim()) {
    return products;
  }

  const lowerQuery = query.toLowerCase();
  const categoryLabels: Record<string, string> = {
    ahorro: 'ahorro',
    inversion: 'inversión',
    cdt: 'cdt',
    deposito: 'depósito',
  };

  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      categoryLabels[product.category]?.toLowerCase().includes(lowerQuery)
  );
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    // Filtrar por búsqueda de texto (nombre o tipo)
    return filterProducts(products, searchQuery);
  }, [searchQuery, products]);

  return (
    <Box className="products-page">
      {/* Header de la página con buscador */}
      <Box className="products-page-header">
        <Container maxWidth="lg">
          <Typography
            variant="h1"
            component="h1"
            className="products-page-title"
          >
            Productos de Ahorro Digital
          </Typography>
          <Typography
            variant="h6"
            component="p"
            className="products-page-subtitle"
          >
            Encuentra el plan perfecto para hacer crecer tus ahorros
          </Typography>

          {/* Buscador en el header */}
          <Box sx={{ mt: 4 }}>
            <ProductSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </Box>
          {/* contador de productos encontrados */}
          <Box sx={{ mb: 2, mt: 2 }}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {filteredProducts.length} producto
              {filteredProducts.length !== 1 ? 's' : ''}{' '}
              encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contenido principal con productos */}
      <Container maxWidth="lg">
        <ProductList products={filteredProducts} />
      </Container>
    </Box>
  );
}

