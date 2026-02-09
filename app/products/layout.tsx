import type { Metadata } from 'next';
import ScrollToTop from './ScrollToTop';

export const metadata: Metadata = {
  title: 'Productos de Ahorro Digital | Simulador',
  description: 'Descubre todos nuestros productos de ahorro digital y encuentra el plan perfecto para ti',
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}


