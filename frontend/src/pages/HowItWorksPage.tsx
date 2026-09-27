import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, Compass, Award, Cpu, FileCheck, UserCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: "01",
      title: t('howItWorks.step1Title'),
      desc: t('howItWorks.step1Desc'),
      role: t('howItWorks.step1Role'),
      icon: Compass
    },
    {
      step: "02",
      title: t('howItWorks.step2Title'),
      desc: t('howItWorks.step2Desc'),
      role: t('howItWorks.step2Role'),
      icon: ShieldCheck
    },
    {
      step: "03",
      title: t('howItWorks.step3Title'),
      desc: t('howItWorks.step3Desc'),
      role: t('howItWorks.step3Role'),
      icon: Award
    },
    {
      step: "04",
      title: t('howItWorks.step4Title'),
      desc: t('howItWorks.step4Desc'),
      role: t('howItWorks.step4Role'),
      icon: Cpu
    },
    {
      step: "05",
      title: t('howItWorks.step5Title'),
      desc: t('howItWorks.step5Desc'),
      role: t('howItWorks.step5Role'),
      icon: FileCheck
    },
    {
      step: "06",
      title: t('howItWorks.step6Title'),
      desc: t('howItWorks.step6Desc'),
      role: t('howItWorks.step6Role'),
      icon: UserCheck
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">{t('howItWorks.badge')}</span>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('howItWorks.title')}</h1>
        <p className="text-slate-600 text-xs max-w-2xl mx-auto leading-relaxed">
          {t('howItWorks.subtitle')}
        </p>
      </div>

      {/* Steps List */}
      <div className="space-y-4">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="gov-panel p-6 flex flex-col md:flex-row items-start gap-5 hover:border-blue-300 transition-colors">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-extrabold text-base shrink-0">
                {s.step}
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-blue-700" />
                    <span>{s.title}</span>
                  </h3>
                  <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-300 self-start sm:self-auto">
                    {s.role}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Core Principle Callout */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center text-xs text-slate-800 font-semibold space-y-1">
        <p className="text-blue-900 font-bold uppercase tracking-wider text-[11px]">{t('howItWorks.principleTitle')}</p>
        <p>{t('howItWorks.principleDesc')}</p>
      </div>

      <div className="text-center pt-2">
        <Link to="/challenges" className="btn-primary text-xs px-6 py-3 inline-flex items-center space-x-2">
          <span>{t('howItWorks.exploreBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
