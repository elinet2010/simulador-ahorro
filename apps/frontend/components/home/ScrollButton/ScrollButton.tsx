'use client';

import './ScrollButton.css';

export default function ScrollButton() {
  const handleScroll = () => {
    const benefitsSection = document.getElementById('benefits-section');
    if (benefitsSection) {
      benefitsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <button className="hero-scroll-button" onClick={handleScroll} aria-label="Scroll to benefits">
      <svg
        className="scroll-arrow"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19M12 19L19 12M12 19L5 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}



