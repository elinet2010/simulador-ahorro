import { createTheme } from '@mui/material/styles';

// Extender los tipos de Material-UI para incluir 'tertiary' en text
declare module '@mui/material/styles' {
  interface TypeText {
    tertiary?: string;
  }
}

// Colores del proyecto
const colors = {
  bittersweet: '#ff5e5b',
  timberwolf: '#d8d8d8',
  ivory: '#ffffea',
  robinEggBlue: '#00cecb',
  maize: '#ffed66',
  violet: '#511b96',
};

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.robinEggBlue, // Azul turquesa como color principal
      light: '#33d8d5',
      dark: '#00a3a0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.bittersweet, // Rojo/coral como color secundario
      light: '#ff7e7b',
      dark: '#cc4b48',
      contrastText: '#ffffff',
    },
    warning: {
      main: colors.maize, // Amarillo para advertencias
      light: '#fff088',
      dark: '#ccbe52',
      contrastText: '#000000',
    },
    background: {
      default: colors.ivory, // Fondo principal en marfil
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
      tertiary: colors.violet,  // Violeta oscuro
    },
    divider: colors.timberwolf, // #d8d8d8
    grey: {
      100: colors.timberwolf,
      200: '#c8c8c8',
      300: '#b8b8b8',
      400: '#a8a8a8',
      500: '#888888',
    },
  },
  typography: {
    fontFamily: [
      'var(--font-geist-sans)',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

