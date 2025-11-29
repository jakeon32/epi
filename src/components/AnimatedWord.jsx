import React, { useRef, useState, useEffect } from 'react';

/**
 * Animated Word Component (formerly SplitText)
 * Word-by-word slide-up reveal animation
 * Used for hero titles and section headings
 */
const AnimatedWord = ({ text, delay = 0, isScrollTriggered = false }) => {
  const domRef = useRef();
  const [isVisible, setVisible] = useState(!isScrollTriggered);

  useEffect(() => {
    if (!isScrollTriggered) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domRef.current);
      }
    });

    observer.observe(domRef.current);
    return () => observer.disconnect();
  }, [isScrollTriggered]);

  const wordClasses = `block transform translate-y-full ${isVisible ? 'reveal-slide-up' : ''}`;

  return (
    <div ref={domRef} className="overflow-hidden inline-block relative">
      <span
        className={wordClasses}
        style={{ animationDelay: `${delay}s` }}
      >
        {text}
      </span>
    </div>
  );
};

export default React.memo(AnimatedWord);
