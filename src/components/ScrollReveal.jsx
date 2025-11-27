import React, { useRef, useState, useEffect } from 'react';

/**
 * Scroll Reveal Component (formerly FadeIn)
 * Fade-in animation triggered when element enters viewport
 * Used for content sections throughout the site
 */
const ScrollReveal = ({ children }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    });

    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  const revealClasses = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-12';

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${revealClasses}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
