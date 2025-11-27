import React, { useState, useEffect } from 'react';

/**
 * Typewriter Text Component
 * Character-by-character typing animation with blinking cursor
 * Used in Hero section for special emphasis
 */
const TypewriterText = ({ texts, interval = 5000, className = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentText = texts[currentIndex];
    let charIndex = 0;

    // Typing animation
    if (isTyping) {
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
      // Wait before showing next text
      const waitTimer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsTyping(true);
      }, interval - (currentText.length * 50)); // Adjust wait time

      return () => clearTimeout(waitTimer);
    }
  }, [currentIndex, isTyping, texts, interval]);

  return (
    <span className={`relative inline-block ${className}`}>
      {/* Invisible placeholder to reserve space */}
      <span className="opacity-0 select-none" aria-hidden="true">
        {texts[currentIndex]}
      </span>

      {/* Absolute positioned typing text */}
      <span className="absolute top-0 left-0 w-full h-full">
        {displayText}
        {isTyping && <span className="animate-pulse">|</span>}
      </span>
    </span>
  );
};

export default TypewriterText;
