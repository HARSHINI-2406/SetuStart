import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Landmark, Rocket, FileText, Users, Globe } from 'lucide-react';

export const ImpactStatsSection: React.FC = () => {
  const { t } = useLanguage();
  const [hasStarted, setHasStarted] = useState(false);
  const [counts, setCounts] = useState({ stat1: 0, stat2: 0, stat3: 0, stat4: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const targets = { stat1: 50, stat2: 500, stat3: 100, stat4: 25 };
    const duration = 1400; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setCounts({
        stat1: Math.floor(ease * targets.stat1),
        stat2: Math.floor(ease * targets.stat2),
        stat3: Math.floor(ease * targets.stat3),
        stat4: Math.floor(ease * targets.stat4),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCounts(targets);
      }
    };

    requestAnimationFrame(animate);
  }, [hasStarted]);

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-[#EFF6FF] border-y border-[#DCE6F2] py-6 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto">
        
        {/* 5 Statistics & Impact Horizontal Blocks */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 w-full items-center">
          
          {/* Block 1: Active Government Challenges */}
          <div className="flex items-center space-x-3 md:border-r md:border-[#C7DCF8] md:pr-4 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0F2A56] tracking-tight leading-none">
                {counts.stat1}+
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {t('impactStats.activeChallenges')}
              </p>
            </div>
          </div>

          {/* Block 2: Registered Innovative Startups */}
          <div className="flex items-center space-x-3 md:border-r md:border-[#C7DCF8] md:pr-4 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
              <Rocket className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0F2A56] tracking-tight leading-none">
                {counts.stat2}+
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {t('impactStats.registeredStartups')}
              </p>
            </div>
          </div>

          {/* Block 3: Active Sandbox Pilots */}
          <div className="flex items-center space-x-3 md:border-r md:border-[#C7DCF8] md:pr-4 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0F2A56] tracking-tight leading-none">
                {counts.stat3}+
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {t('impactStats.sandboxPilots')}
              </p>
            </div>
          </div>

          {/* Block 4: Empirically Validated Solutions */}
          <div className="flex items-center space-x-3 md:border-r md:border-[#C7DCF8] md:pr-4 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#0F2A56] tracking-tight leading-none">
                {counts.stat4}+
              </p>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {t('impactStats.validatedSolutions')}
              </p>
            </div>
          </div>

          {/* Block 5: India Civic Vision Statement */}
          <div className="col-span-2 md:col-span-1 flex items-center space-x-3 pl-1 p-2 rounded-lg hover:bg-white/60 transition-all duration-200">
            <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-[#0F2A56] leading-snug">
              Building a more innovative, inclusive and resilient India.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
