'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import createEmotionCache from './emotion-cache';
import { theme } from './theme';

// Crear instancia del cache de Emotion
const clientSideEmotionCache = createEmotionCache();

import { makeStore, AppStore } from '@/store';

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <CacheProvider value={clientSideEmotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={storeRef.current}>{children}</Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

