import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  FileText, Search, BarChart3, Settings, ShieldCheck, Handshake, TrendingUp, ChevronRight, ArrowRight, CheckCircle2, UserCheck
} from 'lucide-react';

const STAGES = [
  { 
    step: '1', 
    title: 'IDENTIFY', 
    desc: 'Public Challenges', 
    role: 'Government Department',
    detail: 'Government departments formulate outcome-based problem statements using Challenge Studio templates with structured requirement definitions and KPI targets.',
    icon: FileText,
    outerBg: 'bg-[#EFF6FF] border-[#BFDBFE]',
    innerBg: 'bg-[#146EF5]',
    activeColor: 'border-[#146EF5] bg-blue-50/70',
    link: '/how-it-works'
  },
  { 
    step: '2', 
    title: 'DISCOVER', 
    desc: 'Innovative Solutions', 
    role: 'Startup',
    detail: 'Eligible startups explore published government opportunities via Demand Radar and submit detailed solution profiles matching operational demand signals.',
    icon: Search,
    outerBg: 'bg-[#E0F2FE] border-[#7DD3FC]',
    innerBg: 'bg-[#0284C7]',
    activeColor: 'border-[#0284C7] bg-sky-50/70',
    link: '/challenges'
  },
  { 
    step: '3', 
    title: 'EVALUATE', 
    desc: 'with Evidence', 
    role: 'Evaluator Committee',
    detail: 'The platform calculates an explainable 100-point match breakdown across eligibility, technical fit, and impact. Human evaluators review recommendations to form candidate shortlists.',
    icon: BarChart3,
    outerBg: 'bg-[#F3E8FF] border-[#D8B4FE]',
    innerBg: 'bg-[#9333EA]',
    activeColor: 'border-[#9333EA] bg-purple-50/70',
    link: '/how-it-works'
  },
  { 
    step: '4', 
    title: 'PILOT', 
    desc: 'in Real Environments', 
    role: 'Department & Startup',
    detail: 'Shortlisted startups enter a bound regulatory pilot sandbox with defined data boundaries, milestone timelines, SLA tracking, and structured risk heatmaps.',
    icon: Settings,
    outerBg: 'bg-[#DCFCE7] border-[#86EFAC]',
    innerBg: 'bg-[#16A34A]',
    activeColor: 'border-[#16A34A] bg-emerald-50/70',
    link: '/pilot-sandbox'
  },
  { 
    step: '5', 
    title: 'VALIDATE', 
    desc: 'Independent Review', 
    role: 'Independent Validator',
    detail: 'Independent Validators inspect empirical pilot evidence packs, KPI telemetry logs, and field reports to issue objective validation findings.',
    icon: ShieldCheck,
    outerBg: 'bg-[#CCFBF1] border-[#5EEAD4]',
    innerBg: 'bg-[#0D9488]',
    activeColor: 'border-[#0D9488] bg-teal-50/70',
    link: '/evidence-validation'
  },
  { 
    step: '6', 
    title: 'PROCURE', 
    desc: 'with Governance', 
    role: 'Department Administrator',
    detail: 'Validated pilot solutions move through multi-stage approval gates for compliant procurement, 21-day payment SLA release, and contract issuance.',
    icon: Handshake,
    outerBg: 'bg-[#FFEDD5] border-[#FDBA74]',
    innerBg: 'bg-[#EA580C]',
    activeColor: 'border-[#EA580C] bg-orange-50/70',
    link: '/procurement-scale'
  },
  { 
    step: '7', 
    title: 'SCALE', 
    desc: 'for Greater Impact', 
    role: 'State & National Portals',
    detail: 'Validated innovations scale across state and central departments with transparent SLA indicators, open audit trails, and multi-department reuse recommendations.',
    icon: TrendingUp,
    outerBg: 'bg-[#FCE7F3] border-[#F472B6]',
    innerBg: 'bg-[#DB2777]',
    activeColor: 'border-[#DB2777] bg-pink-50/70',
    link: '/public-transparency'
  },
];

export const HowSetuStartWorksSection: React.FC = () => {
  const { t } = useLanguage();
  // Initially all stages are compact; user clicks a stage to expand it
  const [activeStage, setActiveStage] = useState<number | null>(null);

  const toggleStage = (idx: number) => {
    setActiveStage((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6F2]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#DCE6F2] pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                7-Stage End-to-End Governance
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Click any stage to expand details
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2A56] tracking-tight mt-1">
              {t('howItWorks.title')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <Link
            to="/how-it-works"
            className="text-xs font-bold text-[#146EF5] hover:text-blue-800 flex items-center space-x-1 shrink-0 py-1.5 px-3 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
          >
            <span>Platform Lifecycle Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 7 Horizontal Connected Stages Lifecycle */}
        <div className="relative pt-2">
          {/* Subtle Horizontal Connector Line behind stages on desktop */}
          <div className="hidden lg:block absolute top-[34px] left-8 right-8 h-0.5 bg-slate-200 z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4 relative z-10">
            {STAGES.map((item, idx) => {
              const Icon = item.icon;
              const isExpanded = activeStage === idx;
              const isLast = idx === STAGES.length - 1;

              return (
                <button
                  key={item.title}
                  data-stage={item.title}
                  onClick={() => toggleStage(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 ease-out cursor-pointer flex flex-col items-center text-center relative group ${
                    isExpanded
                      ? `${item.activeColor} border-2 shadow-md -translate-y-1 scale-[1.03]`
                      : 'bg-white hover:bg-slate-50/90 border-[#DCE6F2] shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                  }`}
                >
                  {/* Stage Circular Icon Badge */}
                  <div className={`w-13 h-13 rounded-full border flex items-center justify-center mb-2 shadow-2xs relative transition-transform duration-300 ${
                    isExpanded ? 'scale-110 shadow-sm' : 'group-hover:scale-105'
                  } ${item.outerBg}`}>
                    <div className={`w-9 h-9 rounded-full ${item.innerBg} flex items-center justify-center text-white shadow-2xs`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    {/* Step Number Badge */}
                    <span className={`absolute -top-1 -right-1 text-white text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-xs transition-colors ${
                      isExpanded ? 'bg-[#146EF5]' : 'bg-[#0F2A56]'
                    }`}>
                      {item.step}
                    </span>
                  </div>

                  {/* Step Title & Subtitle */}
                  <h3 className={`text-xs font-bold tracking-wide uppercase transition-colors ${
                    isExpanded ? 'text-[#146EF5]' : 'text-[#0F2A56]'
                  }`}>
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-1">
                    {item.desc}
                  </p>

                  {/* Active Indicator Chevron / Dot */}
                  <div className="mt-2">
                    {isExpanded ? (
                      <span className="text-[10px] font-bold text-[#146EF5] bg-blue-100/80 px-2 py-0.5 rounded-full inline-block">
                        Active Stage
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 group-hover:text-[#146EF5] flex items-center gap-0.5 transition-colors">
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Connecting Arrow between Stages on Desktop */}
                  {!isLast && (
                    <div className="hidden lg:block absolute -right-3 top-7.5 z-20 text-slate-300 pointer-events-none">
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* EXPANDED STAGE DETAIL CARD (Visibly expands underneath when clicked, collapses smoothly) */}
        {activeStage !== null && (
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 sm:p-6 shadow-sm transition-all duration-400 ease-out animate-fadeIn">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#0F2A56] text-white text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    Stage {STAGES[activeStage].step} of 7
                  </span>
                  <span className="text-sm font-extrabold text-[#0F2A56] tracking-wide uppercase">
                    {STAGES[activeStage].title} — {STAGES[activeStage].desc}
                  </span>
                  <span className="bg-white text-blue-800 border border-blue-200 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-[#146EF5]" />
                    <span>Role: {STAGES[activeStage].role}</span>
                  </span>
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-normal max-w-4xl">
                  {STAGES[activeStage].detail}
                </p>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <Link
                  to={STAGES[activeStage].link}
                  className="btn-gov-primary text-xs py-2 px-4 shadow-2xs group inline-flex items-center space-x-1.5"
                >
                  <span>Explore Workflow</span>
                  <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
                </Link>
                <button
                  onClick={() => setActiveStage(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-md hover:bg-white border border-transparent hover:border-slate-300 transition-colors"
                >
                  Collapse
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
