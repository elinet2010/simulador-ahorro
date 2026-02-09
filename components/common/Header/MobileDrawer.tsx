'use client';

import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileDrawerProps {
  menuItems: Array<{ label: string; href: string }>;
}

export default function MobileDrawer({ menuItems }: MobileDrawerProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const theme = useTheme();

  const active = menuItems.find((item) => item.href === pathname)?.label || '';

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
              component={Link}
              href={item.href}
              className={active === item.label ? 'active' : 'otro'}
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
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        color="primary"
        aria-label="open drawer"
        edge="end"
        onClick={handleDrawerToggle}
        sx={{
          display: { xs: 'flex', md: 'none' },
          color: theme.palette.text.primary,
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
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

