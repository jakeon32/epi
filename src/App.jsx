import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Mail, Instagram, Linkedin, Sparkles, RefreshCw, Loader2 } from 'lucide-react';

/**
 * Saem.space 스타일의 디자인 컨셉을 적용한 포트폴리오 (Gemini AI Edition)
 * * [새로 추가된 AI 기능]
 * 1. The Digital Muse: 디자인 철학에 대한 영감을 주는 문구 생성
 * 2. AI Project Storyteller: 프로젝트별 가상의 디자인 스토리 생성
 * * [기존 특징]
 * 1. Global Noise Overlay & Parallax Video Background
 * 2. Split Text Staggered Animation (단어별 시차 등장)
 * 3. Minimalist Typography (Pretendard & Noto Serif KR)
 */

// ----------------------------------------------------------------------
// Gemini API Configuration
// ----------------------------------------------------------------------
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const callGemini = async (prompt) => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    return "API key is required to generate real content. This is a placeholder text demonstrating the layout.";
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No content generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Momentary silence... (Error generating content)";
  }
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

const Portfolio = () => {
  const [scrollY, setScrollY] = useState(0);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Custom Physics-based Smooth Scroll
  const smoothScroll = (e, targetId) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;

    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // ms - Slower for more "weight"
    let start = null;

    // Easing function: easeInOutQuart for a more dramatic acceleration/deceleration curve
    const easeInOutQuart = (x) => {
      return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
    };

    const animation = (currentTime) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = easeInOutQuart(progress);

      window.scrollTo(0, startPosition + distance * ease);

      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  };

  return (
    <div className="min-h-screen bg-[#f4f3f0] text-[#1a1a1a] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* 1. Global Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full px-6 py-6 flex justify-between items-center z-40 mix-blend-difference text-white">
        <div className="text-xl font-bold tracking-tighter">9STUDIO</div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-wide">
          <a href="#about" onClick={(e) => smoothScroll(e, '#about')} className="hover:opacity-50 transition-opacity">Concept</a>
          <a href="#work" onClick={(e) => smoothScroll(e, '#work')} className="hover:opacity-50 transition-opacity">Work</a>
          <a href="#contact" onClick={(e) => smoothScroll(e, '#contact')} className="hover:opacity-50 transition-opacity">Contact</a>
        </div>
        <button className="md:hidden">Menu</button>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
        <div className="max-w-4xl z-10">
          <p className={`text-sm md:text-base mb-6 tracking-widest uppercase opacity-0 animate-fade-in-up`} style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            Creative Developer & Designer
          </p>

          {/* Main Title with Split Text Animation */}
          <h1 className="text-5xl md:text-8xl font-light leading-[1.15] tracking-tight mb-8">
            <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden">
              <SplitText text="Inspiration" delay={0.3} />
              <SplitText text="comes" delay={0.4} />
            </div>
            <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden items-baseline">
              <SplitText text="from" delay={0.5} />
              <span className="overflow-hidden inline-block relative top-[0.1em]">
                <span className="block animate-blind-slide-up font-serif italic bg-black text-white px-3" style={{ animationDelay: '0.6s' }}>silence.</span>
              </span>
            </div>
          </h1>

          <p className="mt-4 max-w-lg text-gray-600 text-lg md:text-xl leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            복잡함 속에서 본질을 찾습니다.<br />
            사용자에게 고요한 몰입의 경험을 전합니다.
          </p>
        </div>

        {/* Hero Background Video (Parallax) */}
        <div className="absolute right-0 top-1/4 w-[60vw] h-[60vh] md:w-[40vw] md:h-[70vh] -z-10 overflow-hidden opacity-80">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover grayscale contrast-125 transition-transform duration-75 ease-linear"
            style={{ transform: `translateY(${scrollY * 0.15}px)` }}
          >
            <source src="https://videos.pexels.com/video-files/5091624/5091624-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
        </div>
      </header>

      {/* Philosophy / About Section (Includes AI Muse) */}
      <section id="about" className="py-32 px-6 md:px-20 bg-white relative">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-black pb-4 mb-8">
              The Concept
            </h2>
            <div className="text-4xl md:text-6xl font-light leading-tight mb-8">
              <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden">
                <SplitText text="Less" delay={0.2} isScrollTriggered />
                <SplitText text="noise," delay={0.3} isScrollTriggered />
              </div>
              <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden items-baseline">
                <SplitText text="More" delay={0.4} isScrollTriggered />
                <span className="overflow-hidden inline-block relative top-[0.1em]">
                  <span className="block font-serif italic text-gray-400">voice.</span>
                </span>
              </div>
            </div>

            {/* AI Feature 1: The Digital Muse */}
            <MuseSection />

          </div>
          <div className="space-y-12 text-lg md:text-xl leading-relaxed text-gray-800 font-light">
            <FadeIn>
              <p>
                디지털 공간은 너무나 많은 소음으로 가득 차 있습니다.
                저는 그 안에서 사용자가 오롯이 콘텐츠에 집중할 수 있는
                '빈 공간(Void)'을 설계합니다.
              </p>
            </FadeIn>
            <FadeIn>
              <p>
                Saem의 철학처럼, 멈춤은 또 다른 시작을 품습니다.
                화려한 기교보다는 단단한 구조와 명확한 메시지를 통해
                오래도록 기억되는 웹 경험을 만듭니다.
              </p>
            </FadeIn>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <FadeIn>
                <h3 className="text-sm font-bold uppercase mb-2">Strategy</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>User Research</li>
                  <li>Brand Identity</li>
                  <li>Contents Planning</li>
                </ul>
              </FadeIn>
              <FadeIn>
                <h3 className="text-sm font-bold uppercase mb-2">Design</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>UI/UX Design</li>
                  <li>Interaction</li>
                  <li>Prototyping</li>
                </ul>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works Section (Includes AI Storyteller) */}
      <section id="work" className="py-20 bg-[#1a1a1a] text-[#f4f3f0]">
        <div className="px-6 md:px-20 mb-20">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-white/20 pb-4 mb-4">
            Selected Works
          </h2>
          <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <p className="text-3xl font-serif italic opacity-80">The Objects of Thought</p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Click "Story" for AI-generated insights
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border-t border-b border-white/10">
          <ProjectCard
            title="Mono Archive"
            category="Web Design"
            image="https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=1000&auto=format&fit=crop"
            year="2024"
          />
          <ProjectCard
            title="Silence UI Kit"
            category="System Design"
            image="https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop"
            year="2023"
          />
          <ProjectCard
            title="Type & Space"
            category="Editorial"
            image="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop"
            year="2023"
          />
          <ProjectCard
            title="Urban Flow"
            category="App Concept"
            image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop"
            year="2022"
          />
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-32 overflow-hidden bg-[#f4f3f0]">
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex gap-8 items-center text-8xl md:text-9xl font-bold tracking-tighter opacity-10 uppercase">
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
            <span>Digital</span>
            <span>Creative</span>
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
          </div>
          <div className="absolute top-0 animate-marquee2 flex gap-8 items-center text-8xl md:text-9xl font-bold tracking-tighter opacity-10 uppercase">
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
            <span>Digital</span>
            <span>Creative</span>
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 md:px-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-bold tracking-widest uppercase mb-6 text-gray-500">Contact</p>
          <h2 className="text-5xl md:text-7xl font-light mb-12">Let's create <br /><span className="font-serif italic">something timeless.</span></h2>

          <div className="flex justify-center gap-8 mb-20">
            <a href="#" className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Mail className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          <footer className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-8 uppercase tracking-wider">
            <p>&copy; 2025 Jake's Portfolio.</p>
            <p>Inspired by Saem.space & Powered by Gemini</p>
          </footer>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css");
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@300;400;700&display=swap');

        body {
          font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
        }
        .font-serif {
          font-family: 'Noto Serif KR', 'Times New Roman', serif !important;
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        @keyframes blind-slide-up {
          from { transform: translateY(120%); }
          to { transform: translateY(0); }
        }
        .animate-blind-slide-up {
          animation: blind-slide-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee2 {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee2 {
          animation: marquee2 25s linear infinite;
        }
      `}</style>
    </div>
  );
};

// ----------------------------------------------------------------------
// Reusable Components
// ----------------------------------------------------------------------

/**
 * AI Feature 1: The Digital Muse Component
 * Gemini를 사용하여 매번 다른 영감(Inspiration) 문구를 생성
 */
const MuseSection = () => {
  const [inspiration, setInspiration] = useState("");
  const [loading, setLoading] = useState(false);

  const getInspiration = async () => {
    setLoading(true);
    const prompt = "You are a minimalist design philosopher. Generate a single, short, profound, and poetic sentence about the importance of silence, void, or minimalism in design and creativity. Tone: Architectural, Zen. Korean. Max 20 words.";
    const result = await callGemini(prompt);
    setInspiration(result);
    setLoading(false);
  };

  return (
    <div className="mt-8 pt-8 border-t border-black/10">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-purple-500" />
        <span className="text-xs font-bold uppercase tracking-widest text-purple-600">The Digital Muse</span>
      </div>

      <div className="min-h-[80px]">
        {loading ? (
          <div className="flex items-center gap-2 text-gray-400 italic text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating inspiration...
          </div>
        ) : (
          <p className="text-lg font-serif italic text-gray-700 leading-relaxed transition-all duration-500">
            "{inspiration || "Click the button below to receive a fragment of thought."}"
          </p>
        )}
      </div>

      <button
        onClick={getInspiration}
        disabled={loading}
        className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white px-4 py-2 border border-black transition-all rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        {inspiration ? "Another Thought" : "Ask for Inspiration"}
      </button>
    </div>
  );
};

/**
 * AI Feature 2: Project Card with Storyteller
 * Gemini가 프로젝트의 배경 스토리를 생성해줌
 */
const ProjectCard = ({ title, category, image, year }) => {
  const [showStory, setShowStory] = useState(false);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStoryToggle = async (e) => {
    e.stopPropagation(); // 카드 클릭 방지

    if (showStory) {
      setShowStory(false);
      return;
    }

    setShowStory(true);
    if (!story) {
      setLoading(true);
      const prompt = `Write a sophisticated, 2-sentence design concept backstory for a fictional design project named "${title}" in the category "${category}". Focus on the design challenge (e.g., clutter, noise) and the minimalist solution (e.g., silence, structure). Tone: Professional, Artistic.`;
      const result = await callGemini(prompt);
      setStory(result);
      setLoading(false);
    }
  };

  return (
    <div className={`group relative bg-[#222] border-r border-white/10 overflow-hidden transition-all duration-500 ease-in-out ${showStory ? 'row-span-2 aspect-[3/5]' : 'aspect-[3/4]'}`}>
      <img
        src={image}
        alt={title}
        className={`w-full h-full object-cover transition-all duration-700 ease-out 
          ${showStory ? 'opacity-20 grayscale-0 scale-105' : 'opacity-60 grayscale group-hover:opacity-40 group-hover:scale-105 group-hover:grayscale-0'}`}
      />

      <div className="absolute inset-0 p-8 flex flex-col justify-between z-10 pointer-events-none">
        <div className="flex justify-between items-start translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <span className="text-xs font-mono border border-white/30 px-2 py-1 rounded-full text-white">{year}</span>
          <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-white" />
        </div>

        <div className="transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 pointer-events-auto">
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">{category}</p>
          <h3 className="text-2xl font-serif italic text-white mb-4">{title}</h3>

          {/* AI Story Button */}
          <button
            onClick={handleStoryToggle}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/70 hover:text-purple-300 transition-colors"
          >
            <Sparkles className="w-3 h-3" />
            {showStory ? "Close Story" : "Reveal Story ✨"}
          </button>

          {/* AI Generated Content Area */}
          <div className={`mt-4 overflow-hidden transition-all duration-500 ${showStory ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="bg-black/50 backdrop-blur-sm p-4 border-l-2 border-purple-500">
              {loading ? (
                <div className="flex items-center gap-2 text-white/50 text-xs">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Dreaming up a story...
                </div>
              ) : (
                <p className="text-sm text-gray-200 font-light leading-relaxed">
                  {story}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SplitText = ({ text, delay = 0, isScrollTriggered = false }) => {
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

  return (
    <div ref={domRef} className="overflow-hidden inline-block relative">
      <span
        className={`block transform translate-y-full ${isVisible ? 'animate-blind-slide-up' : ''}`}
        style={{ animationDelay: `${delay}s` }}
      >
        {text}
      </span>
    </div>
  );
};

const FadeIn = ({ children }) => {
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

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
    >
      {children}
    </div>
  );
};

export default Portfolio;
