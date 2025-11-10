'use client';

import { useState } from 'react';
import './BenefitsSection.css';
import { useRouter } from 'next/navigation';

interface BenefitCard {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: string;
  url: string;
}

const benefits: BenefitCard[] = [
  {
    id: 1,
    title: 'Servicios',
    description: 'Accede a una amplia gama de servicios financieros digitales diseñados para facilitar tu día a día',
    image: '/images/servicios.jpg',
    url: '/products',
    icon: '💳',
  },
  {
    id: 2,
    title: 'Rentabilidad',
    description: 'Maximiza tus ahorros con opciones de inversión que te ayudan a hacer crecer tu dinero',
    image: '/images/rentabilidad.jpg',
    url: '/simulator',
    icon: '📈',
  },
  {
    id: 3,
    title: 'Calculadora',
    description: 'Simula y proyecta tus ahorros con nuestra herramienta de cálculo inteligente',
    image: '/images/calculadora.jpg',
    url: '/onboarding',
    icon: '🧮',
  },
];

export default function BenefitsSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const router = useRouter();
  return (
    <section id="benefits-section" className="benefits-section">
      <div className="benefits-container">
        <h2 className="benefits-title">Nuestros Beneficios</h2>
        <p className="benefits-subtitle">
          Descubre todo lo que tenemos para ofrecerte
        </p>
        <div className="benefits-cards">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className={`benefit-card ${hoveredCard === benefit.id ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredCard(benefit.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                backgroundImage: `url(${benefit.image})`,
              }}
            >
              <div className="benefit-card-overlay" />
              <div className="benefit-card-content">
                <div className="benefit-card-icon">{benefit.icon}</div>
                <h3 className="benefit-card-title">{benefit.title}</h3>
                <p className="benefit-card-description">{benefit.description}</p>
                <button 
                  className="benefit-card-button" 
                  onClick={() => router.push(benefit.url)}
                >
                  Conocer más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


