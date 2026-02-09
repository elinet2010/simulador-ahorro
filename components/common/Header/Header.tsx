import React from 'react';
import './Header.css';
import {
  AppBar,
  Toolbar,
  Typography,
  Icon,
} from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import MobileDrawer from './MobileDrawer';
import DesktopMenu from './DesktopMenu';

const menuItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Simulador', href: '/simulator' },
  { label: 'Onboarding', href: '/onboarding' },
];

export default function Header() {
  return (
    <AppBar
      component="header"
      position="fixed"
      elevation={0}
      className="header-appbar"
    >
      <Toolbar className="header-toolbar">
        <a href="/" className="header-logo" rel="noopener noreferrer">
          <Icon
            component={SavingsIcon}
            className="header-logo-icon"
          />
          <Typography
            component="span"
            variant="h6"
            className="header-logo-text"
          >
            Ahorro Digital
          </Typography>
        </a>

        {/* Menú desktop - componente cliente para detección de ruta activa */}
        <DesktopMenu />

        {/* Drawer móvil - componente cliente */}
        <MobileDrawer menuItems={menuItems} />
      </Toolbar>
    </AppBar>
  );
}



