import React from 'react';
import Link from 'next/link';
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
        <Link href="/" className="header-logo">
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
        </Link>

        {/* Menú desktop - componente cliente para detección de ruta activa */}
        <DesktopMenu />

        {/* Drawer móvil - componente cliente */}
        <MobileDrawer menuItems={menuItems} />
      </Toolbar>
    </AppBar>
  );
}



