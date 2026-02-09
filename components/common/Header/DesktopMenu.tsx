'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Typography, Box } from '@mui/material';

const menuItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/products' },
  { label: 'Simulador', href: '/simulator' },
  { label: 'Onboarding', href: '/onboarding' },
];

export default function DesktopMenu() {
  const pathname = usePathname();
  const active = menuItems.find((item) => item.href === pathname)?.label || '';

  return (
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
          component={Link}
          href={item.href}
          className={`${active === item.label ? 'active' : ''} header-menu-link`}
        >
          {item.label}
        </Typography>
      ))}
    </Box>
  );
}

