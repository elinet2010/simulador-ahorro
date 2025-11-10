import MoneySparkles from '../MoneySparkles/MoneySparkles';
import AnimatedTitle from '../AnimatedTitle/AnimatedTitle';
import ScrollButton from '../ScrollButton/ScrollButton';
import './HeroSection.css';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <MoneySparkles />
      <div className="hero-container">
        <AnimatedTitle />
        <h3 className="hero-subtitle">
          descubre los beneficios que tenemos para tí
        </h3>
        <ScrollButton />
      </div>
    </section>
  );
}



