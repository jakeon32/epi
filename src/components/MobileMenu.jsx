import React, { useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Mobile Menu Component
 * Fullscreen mobile navigation menu with smooth animations
 */
const MobileMenu = ({ smoothScroll, isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLinkClick = (e, targetId) => {
    setIsOpen(false);
    smoothScroll(e, targetId);
  };

  const menuButtonClasses = `relative z-50 text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
    isScrolled ? 'text-black' : 'mix-blend-difference text-white'
  } ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`;

  const overlayClasses = `fixed inset-0 bg-[#1a1a1a] z-[100] flex flex-col justify-center items-center transition-all duration-500 ease-in-out mix-blend-normal ${
    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
  }`;

  const menuItems = ['Home', 'Concept', 'Work', 'Contact'];

  return (
    <div className="min-[800px]:hidden">
      <button onClick={toggleMenu} className={menuButtonClasses}>
        Menu
      </button>

      {/* Fullscreen Overlay */}
      {createPortal(
        <div className={overlayClasses}>
          {/* Close Button */}
          <button
            onClick={toggleMenu}
            className="absolute top-6 right-6 text-sm font-bold uppercase tracking-widest bg-black text-white px-4 py-2 rounded-full border border-white/20"
          >
            Close
          </button>

          {/* Menu Items */}
          <div className="flex flex-col gap-8 text-center">
            {menuItems.map((item, index) => {
              const targetId = item === 'Home' ? 'body' : `#${item.toLowerCase()}`;
              const linkClasses = `text-4xl md:text-5xl font-light text-[#f4f3f0] hover:text-gray-400 transition-all duration-500 transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`;

              return (
                <a
                  key={item}
                  href={targetId}
                  onClick={(e) => handleLinkClick(e, targetId)}
                  className={linkClasses}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {item}
                </a>
              );
            })}

            {/* Admin Link */}
            <a
              href="/admin"
              className={`text-4xl md:text-5xl font-light text-[#f4f3f0] hover:text-gray-400 transition-all duration-500 transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              Admin
            </a>
          </div>

          {/* Footer */}
          <div className="absolute bottom-12 text-xs text-gray-500 uppercase tracking-widest">
            9STUDIO &copy; 2025
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default MobileMenu;
