"use client";

import { useState, useMemo } from "react";
import { Container, Typography, Box, useTheme } from "@mui/material";
import { getAllProducts, searchProducts } from "@/data/products";
import ProductList from "@/components/products/ProductList/ProductList";
import ProductSearch from "@/components/products/ProductFilters/ProductFilters";
import "./products.css";

export default function ProductsPage() {
	const theme = useTheme();
	const [searchQuery, setSearchQuery] = useState("");
	const allProducts = getAllProducts();

	const filteredProducts = useMemo(() => {
		// Filtrar por búsqueda de texto (nombre o tipo)
		if (searchQuery.trim().length > 0) {
			return searchProducts(searchQuery);
		}
		return allProducts;
	}, [searchQuery, allProducts]);

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
							{filteredProducts.length !== 1 ? "s" : ""}{" "}
							encontrado{filteredProducts.length !== 1 ? "s" : ""}
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
