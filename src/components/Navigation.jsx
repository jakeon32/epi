import React from 'react';
import MobileMenu from './MobileMenu';

/**
 * Navigation Component
 * Responsive navigation bar with scroll-based styling
 */
const Navigation = ({ isScrolled, smoothScroll }) => {
  const baseClasses = "fixed top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-40 transition-all duration-300 ease-in-out";
  const scrolledClasses = "bg-white/70 backdrop-blur-md border-b border-gray-200/50 shadow-sm text-black";
  const topClasses = "mix-blend-difference text-white";

  return (
    <nav className={`${baseClasses} ${isScrolled ? scrolledClasses : topClasses}`}>
      <div className="text-xl font-bold tracking-tighter">9STUDIO</div>

      {/* Desktop Navigation (>= 800px) */}
      <div className="hidden min-[800px]:flex gap-8 text-sm font-medium tracking-wide">
        <a href="#" onClick={(e) => smoothScroll(e, 'body')} className="hover:opacity-50 transition-opacity">Home</a>
        <a href="#about" onClick={(e) => smoothScroll(e, '#about')} className="hover:opacity-50 transition-opacity">Concept</a>
        <a href="#work" onClick={(e) => smoothScroll(e, '#work')} className="hover:opacity-50 transition-opacity">Work</a>
        <a href="#contact" onClick={(e) => smoothScroll(e, '#contact')} className="hover:opacity-50 transition-opacity">Contact</a>
        <a href="/admin" className="hover:opacity-50 transition-opacity text-xs border border-current px-3 py-1 rounded-full">Admin</a>
      </div>

      {/* Mobile Navigation Button (< 800px) */}
      <MobileMenu smoothScroll={smoothScroll} isScrolled={isScrolled} />
    </nav>
  );
};

export default Navigation;
