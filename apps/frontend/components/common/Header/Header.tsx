'use client';

import React, { useState, useEffect } from 'react';
import './Header.css';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useTheme,
  Icon,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SavingsIcon from '@mui/icons-material/Savings';

const menuItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Simulador', href: '/simulator' },
  { label: 'Onboarding', href: '/onboarding' },
];

// Tema por defecto para usar cuando el ThemeProvider no está disponible
const defaultTheme = createTheme({
  palette: {
    background: { default: '#ffffea' },
    primary: { main: '#00cecb', light: '#00cecb' },
    text: { primary: '#1a1a1a' },
    divider: '#d8d8d8',
  },
});

function HeaderContent() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>('');
  const theme = useTheme();
  
  // Actualizar active basado en la ruta actual después de montar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const _active = menuItems.find((item) => item.href === currentPath);
      setActive(_active?.label || '');
    }
  }, []);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = () => {
    setMobileOpen(false);
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
          Menú
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: theme.palette.text.primary }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              onClick={handleMenuClick}
              component="a"
              href={item.href}
              className={active === item.label ? 'active': 'otro'}
              sx={{
                '&:hover, &.active': {
                  backgroundColor: theme.palette.primary.light + '20',
                },
                backgroundColor: active === item.label ? theme.palette.primary.light + '20' : 'inherit'
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: {
                    color: theme.palette.text.primary,
                    fontWeight: 500,
                  },
                }}
              />
              {active === item.label}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        className="header-appbar"
      >
        <Toolbar className="header-toolbar" >
          <Typography
            variant="h6"
            component="a"
            href="/"
            className="header-logo"
          >
            <Icon
              component={SavingsIcon}
              className="header-logo-icon"
            />
            <Typography
              component="span"
              className="header-logo-text"
            >
              Ahorro Digital
            </Typography>
          </Typography>

          {/* Menú desktop - oculto en móvil usando CSS en lugar de renderizado condicional */}
          <Box
            className="header-desktop-menu"
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 2,
            }}
          >
            {menuItems.map((item) => (
              <Typography
                key={item.label}
                component="a"
                href={item.href}
                className="header-menu-link"
              >
                {item.label}
              </Typography>
            ))}
          </Box>

          {/* Botón hamburguesa - solo visible en móvil usando CSS */}
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            className="header-menu-button"
            sx={{
              display: { xs: 'block', md: 'none' },
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer para móvil - solo renderizar después de montar para evitar hidratación */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en móvil
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default function Header() {
  // Envolver en ThemeProvider para asegurar que siempre haya un tema disponible
  // Esto previene errores cuando el Header se renderiza fuera del Providers del layout
  return (
    <ThemeProvider theme={defaultTheme}>
      <HeaderContent />
    </ThemeProvider>
  );
}



