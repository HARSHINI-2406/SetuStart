import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ShieldCheck, Rocket, Landmark } from 'lucide-react';

export const CTASection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="w-full bg-[#EFF6FF] border border-[#C7DCF8] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xs relative overflow-hidden">
          
          {/* Subtle Background Accent Pattern */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
            <ShieldCheck className="w-64 h-64 text-[#146EF5]" />
          </div>

          {/* Left Content */}
          <div className="space-y-2.5 max-w-2xl relative z-10">
            {/* Small Label Pill */}
            <div className="inline-flex items-center space-x-1.5 bg-white/90 border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#0F2A56] uppercase tracking-wider">
                GOVERNED INNOVATION PLATFORM
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0F2A56] tracking-tight">
              {t('ctaSection.heading')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              {t('ctaSection.subheading')}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 relative z-10 shrink-0">
            <Link
              to="/register"
              className="btn-gov-primary group text-xs md:text-sm py-2.5 px-5 shadow-xs"
            >
              <Rocket className="w-4 h-4 text-white" />
              <span>{t('ctaSection.startupBtn')}</span>
              <ArrowRight className="w-4 h-4 btn-arrow" />
            </Link>

            <Link
              to="/challenges"
              className="btn-gov-secondary group text-xs md:text-sm py-2.5 px-5"
            >
              <Landmark className="w-4 h-4 text-[#146EF5]" />
              <span>Explore Challenges</span>
              <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
