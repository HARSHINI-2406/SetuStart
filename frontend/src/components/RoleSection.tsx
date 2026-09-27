import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Rocket, Award, ShieldCheck, ArrowRight, CheckCircle2, FileText, Cpu, Lock, Landmark
} from 'lucide-react';

export const RoleSection: React.FC = () => {
  const [activeRole, setActiveRole] = useState<'govt' | 'startup' | 'evaluator'>('govt');
  const [animating, setAnimating] = useState(false);

  const handleRoleChange = (role: 'govt' | 'startup' | 'evaluator') => {
    if (role === activeRole) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveRole(role);
      setAnimating(false);
    }, 150);
  };

  const rolesData = {
    govt: {
      label: 'Government Department',
      icon: Landmark,
      badge: 'Public Sector Departments & Agencies',
      title: 'Outcome-Based Challenge Formulation & Governed Procurement',
      desc: 'Formulate precision problem statements using structured templates, review 100-point explainable applicant matches, and supervise bounded regulatory sandbox pilots with real-time milestone telemetry.',
      points: [
        'Challenge Studio: Author outcome-based problem statements with pre-defined KPI benchmarks',
        'Explainable Matching: Review algorithmic capability scores assisting human committee selection',
        'Bound Sandbox Oversight: Monitor real-time operational milestones, SLA tracking, and risk heatmaps',
        'Compliant Procurement: Execute multi-stage approval gates and cross-department reuse scale'
      ],
      primaryBtn: { text: 'Explore Department Workflows', link: '/how-it-works' },
      secondaryBtn: { text: 'Browse Challenges', link: '/challenges' }
    },
    startup: {
      label: 'Startup',
      icon: Rocket,
      badge: 'Innovators & DPIIT Recognized Startups',
      title: 'Public Demand Discovery & Governed Regulatory Sandbox Testing',
      desc: 'Discover live government procurement demand through the Demand Radar, submit verified solution proposals with rule-based eligibility waivers, and validate your technology in real environments.',
      points: [
        'Demand Radar: Discover high-priority departmental problem signals matching your domain',
        'Rule-Based Waiver Engine: Apply for turnover and prior experience waivers with DPIIT recognition',
        'Controlled Sandbox: Test in real operational environments with defined data boundary protections',
        'Guaranteed Invoicing: Milestone-based contract tracking with statutory 21-day payment SLAs'
      ],
      primaryBtn: { text: 'Register Your Startup', link: '/register' },
      secondaryBtn: { text: 'Explore Opportunities', link: '/challenges' }
    },
    evaluator: {
      label: 'Evaluator / Validator',
      icon: Award,
      badge: 'Evaluation Committees & Independent Validators',
      title: 'Deterministic Scoring Audit & Objective Evidence Validation',
      desc: 'Evaluate applicant proposals against transparent 100-point criteria, inspect empirical telemetry logs from sandbox pilots, and issue immutable validation certificates for national procurement adoption.',
      points: [
        'Deterministic Scoring Rules: Audit mathematical breakdowns across eligibility, technical fit, and impact',
        'Empirical Evidence Inspection: Verify raw KPI data packs, field logs, and operational telemetry',
        'Immutable Audit Trail: Deliver tamper-evident evaluation findings for public accountability',
        'Scale Certification: Issue standardized validation packs enabling cross-department adoption'
      ],
      primaryBtn: { text: 'Review Validation Standards', link: '/public-transparency' },
      secondaryBtn: { text: 'Platform Guidelines', link: '/platform-guidelines' }
    }
  };

  const current = rolesData[activeRole];
  const CurrentIcon = current.icon;

  return (
    <section className="w-full bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8 border-b border-[#DCE6F2]">
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Tailored Public Sector Workflows
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F2A56] tracking-tight">
            Designed for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Institutional workspaces connecting government buyers, innovative startups, and independent evaluators.
          </p>
        </div>

        {/* 3 Role Navigation Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-200/80 p-1 rounded-xl border border-slate-300/80 shadow-2xs gap-1">
            {(['govt', 'startup', 'evaluator'] as const).map((key) => {
              const item = rolesData[key];
              const Icon = item.icon;
              const isActive = activeRole === key;

              return (
                <button
                  key={key}
                  onClick={() => handleRoleChange(key)}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-250 cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#0F2A56] border-b-2 border-[#146EF5] shadow-xs scale-[1.01]'
                      : 'text-slate-600 hover:text-[#0F2A56] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#146EF5]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Role Content Panel */}
        <div className="max-w-4xl mx-auto bg-white border border-[#DCE6F2] rounded-2xl p-6 sm:p-8 shadow-sm">
          <div
            className={`transition-all duration-300 ease-out space-y-5 ${
              animating ? 'opacity-0 translate-x-3' : 'opacity-100 translate-x-0'
            }`}
          >
            {/* Top row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#146EF5] shadow-2xs shrink-0">
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#146EF5] uppercase tracking-wider block">
                    {current.badge}
                  </span>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F2A56]">
                    {current.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {current.desc}
            </p>

            {/* Key Capabilities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {current.points.map((pt, i) => (
                <div 
                  key={i} 
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{pt}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <Link
                to={current.primaryBtn.link}
                className="btn-gov-primary group text-xs py-2 px-4 shadow-2xs"
              >
                <span>{current.primaryBtn.text}</span>
                <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Link>
              <Link
                to={current.secondaryBtn.link}
                className="btn-gov-secondary group text-xs py-2 px-4"
              >
                <span>{current.secondaryBtn.text}</span>
                <ArrowRight className="w-3.5 h-3.5 btn-arrow" />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
