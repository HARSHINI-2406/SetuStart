import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Lightbulb, Users, BarChart3, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadStage, setLoadStage] = useState(0);

  useEffect(() => {
    // 0ms: Hero background appears
    // 150ms: Main heading enters
    const t1 = setTimeout(() => setLoadStage(1), 150);
    // 300ms: Description enters
    const t2 = setTimeout(() => setLoadStage(2), 300);
    // 450ms: Primary CTA enters
    const t3 = setTimeout(() => setLoadStage(3), 450);
    // 550ms: Secondary CTA enters
    const t4 = setTimeout(() => setLoadStage(4), 550);
    // 650ms: The four value propositions appear one after another
    const t5 = setTimeout(() => setLoadStage(5), 650);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const slides = [
    {
      titleLine1: t('hero.slide1Title1'),
      titleLine2: t('hero.slide1Title2'),
      description: t('hero.slide1Desc'),
      buttonText: t('hero.slide1Cta'),
      buttonLink: "/challenges",
      secondaryText: "How It Works",
      secondaryLink: "/how-it-works",
    },
    {
      titleLine1: t('hero.slide2Title1'),
      titleLine2: t('hero.slide2Title2'),
      description: t('hero.slide2Desc'),
      buttonText: t('hero.slide2Cta'),
      buttonLink: "/challenges",
      secondaryText: "Demand Radar",
      secondaryLink: "/demand-radar",
    },
    {
      titleLine1: t('hero.slide3Title1'),
      titleLine2: t('hero.slide3Title2'),
      description: t('hero.slide3Desc'),
      buttonText: t('hero.slide3Cta'),
      buttonLink: "/pilot-sandbox",
      secondaryText: "Validation Criteria",
      secondaryLink: "/public-transparency",
    },
    {
      titleLine1: t('hero.slide4Title1'),
      titleLine2: t('hero.slide4Title2'),
      description: t('hero.slide4Desc'),
      buttonText: t('hero.slide4Cta'),
      buttonLink: "/public-transparency",
      secondaryText: "Governance Model",
      secondaryLink: "/platform-guidelines",
    },
    {
      titleLine1: t('hero.slide5Title1'),
      titleLine2: t('hero.slide5Title2'),
      description: t('hero.slide5Desc'),
      buttonText: t('hero.slide5Cta'),
      buttonLink: "/how-it-works",
      secondaryText: "View Challenges",
      secondaryLink: "/challenges",
    },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const valueProps = [
    { label: t('hero.governance'), icon: Lightbulb },
    { label: t('hero.solutions'), icon: Users },
    { label: t('hero.impact'), icon: BarChart3 },
    { label: t('hero.transparent'), icon: CheckCircle2 },
  ];

  return (
    <section
      className="relative w-full overflow-hidden bg-white border-b border-[#DCE6F2]"
      aria-label="SetuStart Key Features Hero"
    >
      {/* LAYER 1 — REALISTIC PHOTOGRAPHIC PALACE BACKGROUND (0ms load) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-opacity duration-700 opacity-100">
        <img
          src="/assets/hero-palace-sky.png"
          alt="Indian civic government palace photographic sky background"
          className="w-full h-full object-cover object-[center_60%] opacity-100"
        />
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-6 md:py-8 relative z-20 min-h-[220px] flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* LAYER 2 — HERO LEFT (Cols 1-5): DYNAMIC SLIDING CAROUSEL TEXT & CTAs */}
          <div className="lg:col-span-5 space-y-3">
            <div 
              key={currentSlide}
              className="animate-fadeIn"
            >
              {/* 150ms: Main heading enters with opacity + translateY + subtle scale */}
              <h1 
                className={`text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-extrabold tracking-tight leading-[1.15] mb-2.5 transition-all duration-500 ease-out ${
                  loadStage >= 1 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-4 scale-[0.98]'
                }`}
              >
                <span className="text-[#0F2A56] block">{slides[currentSlide].titleLine1}</span>
                <span className="text-[#146EF5] block">{slides[currentSlide].titleLine2}</span>
              </h1>

              {/* 300ms: Description enters from slightly below */}
              <p 
                className={`text-xs sm:text-[13px] md:text-[14px] text-slate-700 max-w-[440px] leading-relaxed font-normal min-h-[42px] mb-3.5 transition-all duration-500 ease-out ${
                  loadStage >= 2 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-3 scale-[0.99]'
                }`}
              >
                {slides[currentSlide].description}
              </p>

              {/* 450ms & 550ms: Primary & Secondary CTAs enter */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={slides[currentSlide].buttonLink}
                  className={`btn-gov-primary group transition-all duration-500 ease-out ${
                    loadStage >= 3 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
                  }`}
                >
                  <span>{slides[currentSlide].buttonText}</span>
                  <ArrowRight className="w-4 h-4 btn-arrow" />
                </Link>

                {slides[currentSlide].secondaryText && (
                  <Link
                    to={slides[currentSlide].secondaryLink}
                    className={`btn-gov-secondary group transition-all duration-500 ease-out ${
                      loadStage >= 4 
                        ? 'opacity-100 translate-y-0 scale-100' 
                        : 'opacity-0 translate-y-3 scale-95 pointer-events-none'
                    }`}
                  >
                    <span>{slides[currentSlide].secondaryText}</span>
                    <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* LAYER 3 — HERO CENTER (Cols 6-8): 4 BENEFITS COLUMN WITH STAGED ENTRANCE & HOVER */}
          <div className="hidden lg:flex lg:col-span-3 items-center border-l border-[#C7DCF8] pl-6 py-1">
            <div className="space-y-2.5 text-xs sm:text-[13px] md:text-sm w-full">
              {valueProps.map((prop, idx) => {
                const Icon = prop.icon;
                const isItemVisible = loadStage >= 5;
                const delayMs = idx * 100; // 650ms, 750ms, 850ms, 950ms

                return (
                  <div
                    key={prop.label}
                    style={{
                      transitionDelay: isItemVisible ? `${delayMs}ms` : '0ms'
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg border border-transparent transition-all duration-300 ease-out cursor-default group hover:bg-blue-50/90 hover:border-blue-300 hover:border-l-4 hover:border-l-[#146EF5] hover:shadow-xs ${
                      isItemVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-3 scale-[0.96]'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5 text-[#146EF5] shrink-0 transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                    <span className="text-[#0F2A56] font-semibold transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:text-blue-900">
                      {prop.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LAYER 4 — HERO RIGHT (Cols 9-12): STATIC CAMPAIGN STATEMENT */}
          <div className="hidden lg:flex lg:col-span-4 justify-end items-center pr-6">
            <div className="space-y-2 text-right">
              <p className="text-xs sm:text-[13px] md:text-sm font-extrabold text-[#0F2A56] uppercase leading-snug tracking-wide">
                {t('hero.campaignLine1')}<br />{t('hero.campaignLine2')}<br />{t('hero.campaignLine3')}
              </p>
              
              {/* Small Orange & Green Accent Lines */}
              <div className="flex items-center justify-end space-x-1.5 py-0.5">
                <span className="w-6 h-1 bg-[#FF9933] rounded-full" />
                <span className="w-6 h-1 bg-white border border-slate-300 rounded-full" />
                <span className="w-6 h-1 bg-[#138808] rounded-full" />
              </div>

              <p className="text-[12px] md:text-[13px] font-extrabold text-[#146EF5]">
                #InnovationForBharat
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* LEFT & RIGHT CIRCULAR CAROUSEL BUTTON CONTROLS */}
      <button
        onClick={handlePrev}
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white text-[#0F2A56] border border-[#DCE6F2] flex items-center justify-center transition-all duration-200 hover:shadow-md hover:-translate-y-[52%] active:translate-y-[-50%] z-30 cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4.5 h-4.5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 hover:bg-white text-[#0F2A56] border border-[#DCE6F2] flex items-center justify-center transition-all duration-200 hover:shadow-md hover:-translate-y-[52%] active:translate-y-[-50%] z-30 cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4.5 h-4.5" />
      </button>

      {/* CAROUSEL PAGINATION DOTS ON HERO */}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-30">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`transition-all duration-200 cursor-pointer ${
              idx === currentSlide
                ? 'w-5 h-1.5 rounded-full bg-[#146EF5]'
                : 'w-2 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
