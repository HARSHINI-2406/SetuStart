import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, ShieldCheck, Scale, FileText, UserCheck, ArrowRight, ArrowDown, ChevronRight, CheckCircle2, Info
} from 'lucide-react';

export const MatchingGovernanceSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scoringWeights = [
    { label: 'Eligibility', achieved: 18, weight: 20, pct: 90 },
    { label: 'Requirement Match', achieved: 21, weight: 25, pct: 84 },
    { label: 'Technical Fit', achieved: 16, weight: 20, pct: 80 },
    { label: 'Impact', achieved: 13, weight: 15, pct: 86.6 },
    { label: 'Readiness', achieved: 7, weight: 10, pct: 70 },
    { label: 'Experience', achieved: 7, weight: 10, pct: 70 },
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'AI Requirement Understanding',
      desc: 'Parses published problem statements and operational constraints to identify relevant startup capability domains.',
      icon: FileText,
      delay: 200,
    },
    {
      num: '02',
      title: 'Deterministic Scoring',
      desc: 'Applies rigid, rule-based mathematical criteria across all 100 points without subjective algorithmic bias.',
      icon: Scale,
      delay: 500,
    },
    {
      num: '03',
      title: 'Evidence Compilation',
      desc: 'Aggregates objective telemetry logs, sandbox KPI records, and independent validator verification packs.',
      icon: ShieldCheck,
      delay: 800,
    },
    {
      num: '04',
      title: 'Human Review & Approval',
      desc: 'Evaluation committees and department heads inspect audit trails to make all final procurement and award decisions.',
      icon: UserCheck,
      delay: 1100,
    },
  ];

  return (
    <section 
      ref={sectionRef} 
      className="w-full bg-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6F2] overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto space-y-10">
        
        {/* =========================================================
            SECTION 11: EXPLAINABLE MATCHING ENGINE (ANIMATED VISUAL)
           ========================================================= */}
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DCE6F2] pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Explainable Matching Engine
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">Deterministic 100-Point Scoring</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2A56] tracking-tight mt-1">
                Transparent 100-Point Match Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Every applicant score is fully decomposed into verifiable criteria. No black-box decisions.
              </p>
            </div>

            <Link
              to="/public-transparency"
              className="text-xs font-bold text-[#146EF5] hover:text-blue-800 flex items-center space-x-1 shrink-0 py-1.5 px-3 rounded-md hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-colors"
            >
              <span>Audit Architecture</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Scoring Engine Interactive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Left: Overall Score Dial / Badge (82 / 100) */}
            <div className="lg:col-span-4 bg-slate-50 border border-[#DCE6F2] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 shadow-2xs">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Exemplar Candidate Match
              </span>
              <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-blue-100 bg-white shadow-xs">
                <div className="text-center">
                  <div className="text-4xl font-black text-[#0F2A56] tracking-tight leading-none">
                    82
                  </div>
                  <div className="text-xs font-bold text-[#146EF5] mt-1">
                    / 100
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <span className="inline-block bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3 py-0.5 rounded-full">
                  High Relevance Match
                </span>
                <p className="text-[11px] text-slate-500 max-w-[240px] leading-snug">
                  Recommendation generated deterministically against published challenge requirements.
                </p>
              </div>
            </div>

            {/* Right: Animated Scoring Bars */}
            <div className="lg:col-span-8 bg-white border border-[#DCE6F2] rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between text-xs font-bold text-[#0F2A56] border-b border-slate-100 pb-2">
                <span>Evaluation Criteria</span>
                <span>Component Score & Weight</span>
              </div>

              <div className="space-y-3.5">
                {scoringWeights.map((item, idx) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span>{item.label} — {item.weight}%</span>
                      <span className="font-bold text-[#0F2A56]">
                        {item.achieved} / {item.weight} pts ({Math.round(item.pct)}%)
                      </span>
                    </div>

                    {/* Clean Horizontal Scoring Bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                      <div
                        style={{
                          width: isVisible ? `${item.pct}%` : '0%',
                          transition: `width 800ms cubic-bezier(0.16, 1, 0.3, 1) ${idx * 100}ms`
                        }}
                        className="h-full rounded-full bg-gradient-to-r from-[#146EF5] to-[#0284C7]"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-[#146EF5]" />
                  <span>Rule-based formula: Sum of all 6 components = Total Match Score (82/100)</span>
                </span>
                <span className="font-bold text-[#0F2A56]">Total: 100% Weight</span>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================
            SECTION 12: AI + HUMAN GOVERNANCE FLOW
           ========================================================= */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-1">
            <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Institutional Governance Pipeline
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0F2A56] tracking-tight">
              AI Assists. Rules Evaluate. Humans Decide.
            </h2>
            <p className="text-xs text-slate-500">
              Automated assistance accelerates discovery, but statutory procurement authority remains strictly human.
            </p>
          </div>

          {/* 4 Connected Sequential Governance Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {workflowSteps.map((step, idx) => {
              const StepIcon = step.icon;
              const isLast = idx === workflowSteps.length - 1;

              return (
                <div key={step.title} className="relative flex flex-col justify-between">
                  <div
                    style={{
                      transitionDelay: isVisible ? `${step.delay}ms` : '0ms'
                    }}
                    className={`bg-slate-50 border border-[#DCE6F2] rounded-xl p-5 space-y-3 transition-all duration-500 ease-out h-full shadow-2xs hover:shadow-xs hover:border-blue-300 ${
                      isVisible 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-4'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs">
                        <StepIcon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-black text-slate-400 font-mono">
                        {step.num}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#0F2A56] leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Connecting Arrow for Desktop */}
                  {!isLast && (
                    <div 
                      style={{
                        transitionDelay: isVisible ? `${step.delay + 150}ms` : '0ms'
                      }}
                      className={`hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#146EF5] transition-opacity duration-300 ${
                        isVisible ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  )}

                  {/* Connecting Arrow for Mobile */}
                  {!isLast && (
                    <div className="md:hidden flex justify-center py-1 text-[#146EF5]">
                      <ArrowDown className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Principle Callout Banner */}
          <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl p-4 text-center shadow-2xs">
            <p className="text-xs sm:text-sm font-bold text-[#0F2A56] tracking-wide">
              "AI recommends • Evidence explains • Humans decide"
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Strict audit isolation ensures no artificial intelligence agent can approve budgets, select finalists, or disburse public funds.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
