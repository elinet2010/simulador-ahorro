'use client';

import { useEffect, useState } from 'react';
import './MoneySparkles.css';

interface Sparkle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

export default function MoneySparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Generar 30 chispas con propiedades aleatorias
    const newSparkles: Sparkle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Posición horizontal aleatoria (0-100%)
      delay: Math.random() * 2, // Delay aleatorio (0-2s)
      duration: 3 + Math.random() * 3, // Duración entre 3-6 segundos
      size: 16 + Math.random() * 20, // Tamaño entre 16-36px
    }));
    setSparkles(newSparkles);

    // Ocultar el contenedor después de 8 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="money-sparkles-container">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="money-sparkle"
          style={{
            left: `${sparkle.left}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
            fontSize: `${sparkle.size}px`,
          }}
        >
          $
        </div>
      ))}
    </div>
  );
}



