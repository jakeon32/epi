import React, { useState, useEffect } from 'react';

/**
 * Typewriter Text Component
 * Character-by-character typing animation with blur fade-out effect
 * Used in Hero section for special emphasis
 */
const TypewriterText = ({ texts, interval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let charIndex = 0;

    // Typing animation
    if (isTyping) {
      setIsFadingOut(false);
      setDisplayText('');
      const typingTimer = setInterval(() => {
        if (charIndex <= currentText.length) {
          setDisplayText(currentText.substring(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingTimer);
          setIsTyping(false);
        }
      }, 50); // 50ms per character

      return () => clearInterval(typingTimer);
    } else {
      // Wait before fading out
      const waitTimer = setTimeout(() => {
        setIsFadingOut(true);

        // After fade out completes, show next text
        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % texts.length);
          setIsTyping(true);
        }, 800); // Match blur transition duration

      }, interval - (currentText.length * 50) - 800); // Adjust wait time

      return () => clearTimeout(waitTimer);
    }
  }, [currentIndex, isTyping, texts, interval]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Invisible placeholder to reserve space */}
      <span className="opacity-0 select-none" aria-hidden="true">
        {texts[currentIndex]}
      </span>

      {/* Absolute positioned typing text with blur fade-out */}
      <span
        className={`absolute top-0 left-0 w-full h-full transition-all duration-[800ms] ease-in-out ${
          isFadingOut ? 'opacity-0 blur-sm' : 'opacity-100 blur-0'
        }`}
      >
        {displayText}
        {isTyping && <span className="animate-pulse">|</span>}
      </span>
    </span>
  );
};

export default TypewriterText;
