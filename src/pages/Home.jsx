import React, { useEffect, useRef, useState } from 'react';
import { projectService } from '../services/projectService';
import { profileService } from '../services/profileService';
import { ArrowRight, Mail, Instagram, Linkedin, Sparkles, RefreshCw, Loader2, X } from 'lucide-react';
import {
  Navigation,
  TypewriterText,
  RotatingText,
  AnimatedWord,
  ScrollReveal
} from '../components';

/**
 * Saem.space 스타일의 디자인 컨셉을 적용한 포트폴리오 (Gemini AI Edition)
 * * [새로 추가된 AI 기능]
 * 1. The Digital Muse: 디자인 철학에 대한 영감을 주는 문구 생성
 * 2. AI Project Storyteller: 프로젝트별 가상의 디자인 스토리 생성
 * * [새로운 기능]
 * 3. Project Detail Modal: 감각적인 애니메이션의 프로젝트 상세 모달
 * 4. Rotating Text Animation: UI/UX 메시지가 지속적으로 변하는 애니메이션
 * * [기존 특징]
 * 1. Global Noise Overlay & Parallax Video Background
 * 2. Split Text Staggered Animation (단어별 시차 등장)
 * 3. Minimalist Typography (Pretendard & Noto Serif KR)
 * 4. Dynamic Contact Info (Admin Managed)
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

const Home = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProjects();
    fetchProfile();
  }, []);

  // 스크롤 이벤트 리스너
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모달 열렸을 때 스크롤 방지
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);

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
      <Navigation isScrolled={scrollY > 50} smoothScroll={smoothScroll} />

      {/* Hero Section */}
      <header className="relative h-screen flex flex-col justify-center px-6 md:px-20 pt-20">
        <div className="max-w-4xl z-10 relative">
          <div className={`text-sm md:text-base mb-6 tracking-widest uppercase opacity-0 fade-up`} style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <RotatingText
              texts={[
                "Creative Developer & Designer",
                "Crafting Digital Experiences",
                "Building Meaningful Interfaces",
                "Design Meets Functionality"
              ]}
              interval={6000}
            />
          </div>

          {/* Main Title with Split Text Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-[1.25] tracking-tight mb-8">
            <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden">
              <AnimatedWord text="Inspiration" delay={0.3} />
              <AnimatedWord text="comes" delay={0.4} />
            </div>
            <div className="flex flex-wrap gap-x-[0.2em] items-baseline" style={{ overflow: 'visible' }}>
              <AnimatedWord text="from" delay={0.5} />
              <span className="inline-block relative overflow-hidden" style={{ paddingBottom: '0.1em' }}>
                <span className="block reveal-slide-up font-serif italic bg-black text-white px-3 py-1 opacity-0" style={{ animationDelay: '0.6s', lineHeight: '1.2' }}>silence.</span>
              </span>
            </div>
          </h1>

          <div className="mt-4 max-w-lg text-white text-lg md:text-xl leading-relaxed opacity-0 fade-up h-[3.6em] md:h-[3.2em]" style={{ animationDelay: '1.2s', animationFillMode: 'forwards' }}>
            <TypewriterText
              texts={[
                "복잡함 속에서 본질을 찾습니다.\n사용자에게 고요한 몰입의 경험을 전합니다.",
                "Less is more.\n디자인은 보이지 않는 곳에서 완성됩니다.",
                "기능과 감성의 조화.\n사용자 경험을 설계합니다.",
                "디지털 공간에 의미를 더합니다.\n브랜드의 본질을 시각화합니다."
              ]}
              interval={7000}
              className="whitespace-pre-line text-white"
            />
          </div>
        </div>

        {/* Hero Background Video (Full Screen) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover contrast-125 opacity-25"
          >
            <source src="https://videos.pexels.com/video-files/5091624/5091624-hd_1920_1080_24fps.mp4" type="video/mp4" />
          </video>
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>
      </header>

      {/* Philosophy / About Section (Includes AI Muse) */}
      <section id="about" className="py-20 md:py-32 px-6 md:px-20 bg-white relative">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          <div className="sticky top-32">
            <h2 className="text-xs font-bold tracking-[0.2em] uppercase border-b border-black pb-4 mb-8">
              The Concept
            </h2>
            <div className="text-4xl md:text-6xl font-light leading-[1.3] mb-8">
              <div className="flex flex-wrap gap-x-[0.2em] overflow-hidden">
                <AnimatedWord text="Less" delay={0.2} isScrollTriggered />
                <AnimatedWord text="noise," delay={0.3} isScrollTriggered />
              </div>
              <div className="flex flex-wrap gap-x-[0.2em] items-baseline" style={{ overflow: 'visible' }}>
                <AnimatedWord text="More" delay={0.4} isScrollTriggered />
                <span className="inline-block relative" style={{ overflow: 'visible', paddingBottom: '0.15em' }}>
                  <span className="block font-serif italic text-gray-400 py-1" style={{ lineHeight: '1.2' }}>voice.</span>
                </span>
              </div>
            </div>

            {/* AI Feature 1: The Digital Muse */}
            <MuseSection />

          </div>
          <div className="space-y-12 text-lg md:text-xl leading-relaxed text-gray-800 font-light">
            <ScrollReveal>
              <p>
                <RotatingText
                  texts={[
                    "디지털 공간은 너무나 많은 소음으로 가득 차 있습니다. 저는 그 안에서 사용자가 오롯이 콘텐츠에 집중할 수 있는 '빈 공간(Void)'을 설계합니다.",
                    "좋은 디자인은 보이지 않습니다. 사용자가 자연스럽게 목표를 달성할 수 있도록 방해 요소를 제거하는 것이 진정한 디자인입니다.",
                    "단순함은 쉬움이 아닙니다. 본질만을 남기기 위해 끊임없이 고민하고, 불필요한 것들을 걷어내는 과정입니다.",
                    "사용자 경험은 픽셀 단위의 완성도에서 시작됩니다. 작은 디테일이 모여 큰 차이를 만듭니다."
                  ]}
                  interval={8000}
                />
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <p>
                <RotatingText
                  texts={[
                    "Saem의 철학처럼, 멈춤은 또 다른 시작을 품습니다. 화려한 기교보다는 단단한 구조와 명확한 메시지를 통해 오래도록 기억되는 웹 경험을 만듭니다.",
                    "디자인은 문제 해결의 과정입니다. 아름다움은 그 과정에서 자연스럽게 따라오는 결과물일 뿐입니다.",
                    "기능과 미학은 분리될 수 없습니다. 잘 작동하는 것이 아름답고, 아름다운 것이 잘 작동합니다.",
                    "인터페이스는 대화입니다. 사용자와 시스템 사이의 명확하고 직관적인 대화를 디자인합니다."
                  ]}
                  interval={8500}
                />
              </p>
            </ScrollReveal>
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-200">
              <ScrollReveal>
                <h3 className="text-sm font-bold uppercase mb-2">Strategy</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>User Research</li>
                  <li>Brand Identity</li>
                  <li>Contents Planning</li>
                </ul>
              </ScrollReveal>
              <ScrollReveal>
                <h3 className="text-sm font-bold uppercase mb-2">Design</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>UI/UX Design</li>
                  <li>Interaction</li>
                  <li>Prototyping</li>
                </ul>
              </ScrollReveal>
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
            <p className="text-3xl font-serif italic opacity-80">
              <RotatingText
                texts={[
                  "The Objects of Thought",
                  "Crafted with Intention",
                  "Stories in Design",
                  "Minimalism in Motion"
                ]}
                interval={7000}
              />
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <RotatingText
                texts={[
                  "Click on any project for details",
                  "Click 'Story' for AI-generated insights",
                  "Explore each project in depth",
                  "Discover the design process"
                ]}
                interval={6000}
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 min-[800px]:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border-t border-b border-white/10">
          {loadingProjects ? (
            <div className="col-span-full py-20 text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              Loading works...
            </div>
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                category={project.category}
                image={project.image_url}
                year={project.year}
                onProjectClick={() => setSelectedProject(project)}
                description={project.description}
                technologies={project.technologies}
                challenge={project.challenge}
                solution={project.solution}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              No projects found.
            </div>
          )}
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-32 overflow-hidden bg-[#f4f3f0]">
        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div className="marquee-scroll flex gap-8 items-center text-8xl md:text-9xl font-bold tracking-tighter opacity-10 uppercase">
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
            <span>Digital</span>
            <span>Creative</span>
            <span>Interaction</span>
            <span className="font-serif italic font-normal">Development</span>
          </div>
          <div className="absolute top-0 marquee-scroll-2 flex gap-8 items-center text-8xl md:text-9xl font-bold tracking-tighter opacity-10 uppercase">
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
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-light mb-12">
            <RotatingText
              texts={[
                "Let's create something timeless.",
                "Let's build something meaningful.",
                "Let's design something beautiful.",
                "Let's craft something unforgettable."
              ]}
              interval={6500}
              className="inline-block"
            />
            {" "}<span className="font-serif italic"></span>
          </h2>

          <div className="flex justify-center gap-8 mb-20">
            <a href={profile?.email ? `mailto:${profile.email}` : "#"} className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Mail className="w-6 h-6" />
            </a>
            <a href={profile?.instagram_url || "#"} target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Instagram className="w-6 h-6" />
            </a>
            <a href={profile?.linkedin_url || "#"} target="_blank" rel="noopener noreferrer" className="p-4 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-colors duration-300">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>

          <footer className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 border-t border-gray-100 pt-8 uppercase tracking-wider">
            <p>&copy; 2025 Jake's Portfolio.</p>
            <p>Inspired by Saem.space & Powered by Gemini</p>
          </footer>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Styles */}
      {/* Styles removed and moved to index.css */}
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
const ProjectCard = ({ title, category, image, year, onProjectClick, description, technologies, challenge, solution }) => {
  const [showStory, setShowStory] = useState(false);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCardClick = () => {
    onProjectClick({ title, category, image, year, description, technologies, challenge, solution });
  };

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
    <div
      onClick={handleCardClick}
      className={`group relative bg-[#222] border-r border-white/10 overflow-hidden transition-all duration-500 ease-in-out cursor-pointer ${showStory ? 'row-span-2 aspect-[3/5]' : 'aspect-[3/4]'}`}
    >
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


/**
 * Project Detail Modal Component
 * 감각적인 애니메이션과 함께 프로젝트 상세 정보를 표시
 */
const ProjectDetailModal = ({ project, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    // 열기 애니메이션 트리거
    setTimeout(() => setIsVisible(true), 10);

    // ESC 키로 닫기
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);

    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 400); // 애니메이션 시간과 동일
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 md:px-8 transition-all duration-500 ${isVisible ? 'bg-black/80 backdrop-blur-md' : 'bg-black/0 backdrop-blur-none'
        }`}
    >
      <div
        ref={modalRef}
        className={`relative w-full max-w-5xl max-h-[90vh] bg-[#f4f3f0] rounded-none md:rounded-sm overflow-hidden shadow-2xl transition-all duration-500 ease-out ${isVisible
          ? 'opacity-100 scale-100 translate-y-0'
          : 'opacity-0 scale-95 translate-y-8'
          }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 p-3 bg-black/80 hover:bg-black text-white rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          {/* Hero Image */}
          <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
            <img
              src={project.image_url || project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#f4f3f0] via-transparent to-transparent"></div>
          </div>

          {/* Content */}
          <div className="px-8 md:px-16 py-12 space-y-12">
            {/* Title & Category */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-500">
                  <span className="border border-gray-300 px-3 py-1 rounded-full">{project.year}</span>
                  <span>{project.category}</span>
                </div>
                {project.project_url && (
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors"
                  >
                    Visit Site <ArrowRight className="w-3 h-3" />
                  </a>
                )}
              </div>
              <h2 className="text-5xl md:text-7xl font-light tracking-tight">
                {project.title}
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl">
                {project.description}
              </p>
            </div>

            {/* Technologies */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4">Technologies</h3>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Challenge & Solution */}
            <div className="grid md:grid-cols-2 gap-12 border-t border-gray-200 pt-8">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-red-600">
                  Challenge
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {project.challenge}
                </p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-green-600">
                  Solution
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

            {/* Placeholder for more content */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6">Project Highlights</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="aspect-video bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
                <div className="aspect-video bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
                <div className="aspect-video bg-gray-200 rounded-sm flex items-center justify-center">
                  <span className="text-gray-400 text-sm">Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;
