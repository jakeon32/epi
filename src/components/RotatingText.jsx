import React, { useState, useEffect } from 'react';

/**
 * Rotating Text Component
 * Smooth horizontal slide transition between texts
 * Used throughout the site for dynamic content
 */
const RotatingText = ({ texts, interval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span className={`inline-grid items-center ${className}`}>
      {texts.map((text, index) => (
        <span
          key={index}
          className={`col-start-1 row-start-1 transition-all duration-[800ms] ease-in-out ${index === currentIndex
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-4 pointer-events-none'
            }`}
          aria-hidden={index !== currentIndex}
        >
          {text}
        </span>
      ))}
    </span>
  );
};

export default RotatingText;
