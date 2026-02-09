'use client';

import { useEffect, useState } from 'react';

export default function AnimatedTitle() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar animación después de un pequeño delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const text = 'Bienvenid@ a tu ahorro digital';
  const words = text.split(' ');

  return (
    <h1 className={`hero-title ${isVisible ? 'visible' : ''}`}>
      {words.map((word, index) => (
        <span
          key={index}
          className="hero-title-word"
          style={{
            animationDelay: `${index * 0.1}s`,
          }}
        >
          {word}
          {index < words.length - 1 && ' '}
        </span>
      ))}
    </h1>
  );
}



