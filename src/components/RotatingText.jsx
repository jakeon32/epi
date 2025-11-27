import React, { useState, useEffect } from 'react';

/**
 * Rotating Text Component
 * Smooth horizontal slide transition between texts
 * Used throughout the site for dynamic content
 */
const RotatingText = ({ texts, interval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 800); // Slide out duration
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  const animationClasses = isAnimating
    ? 'opacity-0 -translate-x-4'
    : 'opacity-100 translate-x-0';

  return (
    <span className={`inline-block transition-all duration-[800ms] ease-in-out ${animationClasses} ${className}`}>
      {texts[currentIndex]}
    </span>
  );
};

export default RotatingText;
