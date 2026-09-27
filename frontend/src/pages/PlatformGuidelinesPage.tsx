import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, FileText, CheckCircle2, UserCheck, Scale, Cpu, 
  FileCheck, AlertTriangle, ArrowRight, Lock, Eye
} from 'lucide-react';

export const PlatformGuidelinesPage: React.FC = () => {
  const { t } = useLanguage();

  const guidelineSections = [
    {
      id: 'human-governance',
      title: t('platformGuidelines.sec1Title'),
      icon: Scale,
      color: 'border-blue-200 bg-blue-50/50',
      content: [
        {
          heading: t('platformGuidelines.sec1Item1Heading'),
          text: t('platformGuidelines.sec1Item1Text')
        },
        {
          heading: t('platformGuidelines.sec1Item2Heading'),
          text: t('platformGuidelines.sec1Item2Text')
        },
        {
          heading: t('platformGuidelines.sec1Item3Heading'),
          text: t('platformGuidelines.sec1Item3Text')
        }
      ]
    },
    {
      id: 'challenge-creation',
      title: t('platformGuidelines.sec2Title'),
      icon: FileText,
      color: 'border-slate-200 bg-[#F8FAFC]',
      content: [
        {
          heading: t('platformGuidelines.sec2Item1Heading'),
          text: t('platformGuidelines.sec2Item1Text')
        },
        {
          heading: t('platformGuidelines.sec2Item2Heading'),
          text: t('platformGuidelines.sec2Item2Text')
        },
        {
          heading: t('platformGuidelines.sec2Item3Heading'),
          text: t('platformGuidelines.sec2Item3Text')
        }
      ]
    },
    {
      id: 'startup-applications',
      title: t('platformGuidelines.sec3Title'),
      icon: UserCheck,
      color: 'border-slate-200 bg-[#F8FAFC]',
      content: [
        {
          heading: t('platformGuidelines.sec3Item1Heading'),
          text: t('platformGuidelines.sec3Item1Text')
        },
        {
          heading: t('platformGuidelines.sec3Item2Heading'),
          text: t('platformGuidelines.sec3Item2Text')
        },
        {
          heading: t('platformGuidelines.sec3Item3Heading'),
          text: t('platformGuidelines.sec3Item3Text')
        }
      ]
    },
    {
      id: 'pilot-sandbox',
      title: t('platformGuidelines.sec4Title'),
      icon: Cpu,
      color: 'border-slate-200 bg-[#F8FAFC]',
      content: [
        {
          heading: t('platformGuidelines.sec4Item1Heading'),
          text: t('platformGuidelines.sec4Item1Text')
        },
        {
          heading: t('platformGuidelines.sec4Item2Heading'),
          text: t('platformGuidelines.sec4Item2Text')
        },
        {
          heading: t('platformGuidelines.sec4Item3Heading'),
          text: t('platformGuidelines.sec4Item3Text')
        }
      ]
    },
    {
      id: 'evidence-validation',
      title: t('platformGuidelines.sec5Title'),
      icon: FileCheck,
      color: 'border-slate-200 bg-[#F8FAFC]',
      content: [
        {
          heading: t('platformGuidelines.sec5Item1Heading'),
          text: t('platformGuidelines.sec5Item1Text')
        },
        {
          heading: t('platformGuidelines.sec5Item2Heading'),
          text: t('platformGuidelines.sec5Item2Text')
        },
        {
          heading: t('platformGuidelines.sec5Item3Heading'),
          text: t('platformGuidelines.sec5Item3Text')
        }
      ]
    },
    {
      id: 'procurement-scale',
      title: t('platformGuidelines.sec6Title'),
      icon: Lock,
      color: 'border-slate-200 bg-[#F8FAFC]',
      content: [
        {
          heading: t('platformGuidelines.sec6Item1Heading'),
          text: t('platformGuidelines.sec6Item1Text')
        },
        {
          heading: t('platformGuidelines.sec6Item2Heading'),
          text: t('platformGuidelines.sec6Item2Text')
        }
      ]
    }
  ];

  const roleOverview = [
    { role: t('platformGuidelines.roleGovt'), task: t('platformGuidelines.roleGovtTask') },
    { role: t('platformGuidelines.roleStartup'), task: t('platformGuidelines.roleStartupTask') },
    { role: t('platformGuidelines.roleEval'), task: t('platformGuidelines.roleEvalTask') },
    { role: t('platformGuidelines.roleValidator'), task: t('platformGuidelines.roleValidatorTask') },
    { role: t('platformGuidelines.roleAdmin'), task: t('platformGuidelines.roleAdminTask') }
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 text-slate-900">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full text-xs font-bold text-[#146EF5]">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('platformGuidelines.badge')}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F2A56]">{t('platformGuidelines.title')}</h1>
        <p className="text-xs text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('platformGuidelines.subtitle')}
        </p>
      </div>

      {/* Core Principle Banner */}
      <div className="p-5 rounded-xl bg-[#0F2A56] text-white space-y-2 border border-slate-800 shadow-md">
        <div className="flex items-center space-x-2 text-amber-400 font-extrabold uppercase text-xs tracking-wider">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{t('platformGuidelines.principleHeader')}</span>
        </div>
        <p className="text-sm font-bold text-slate-100">
          {t('platformGuidelines.principleFormula')}
        </p>
        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {t('platformGuidelines.principleDesc')}
        </p>
      </div>

      {/* Guidelines Sections */}
      <div className="space-y-6">
        {guidelineSections.map(sec => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.id}
              className={`p-6 rounded-xl border ${sec.color} space-y-4 shadow-2xs`}
            >
              <h3 className="text-base font-bold text-[#0F2A56] flex items-center gap-2.5 border-b border-slate-200 pb-3">
                <Icon className="w-5 h-5 text-[#146EF5] shrink-0" />
                <span>{sec.title}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sec.content.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 space-y-1.5 shadow-2xs">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.heading}</span>
                    </h4>
                    <p className="text-[11.5px] text-slate-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Responsibilities Grid */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE6F2] space-y-4 shadow-2xs">
        <h3 className="text-base font-bold text-[#0F2A56] flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#146EF5]" />
          <span>{t('platformGuidelines.roleTitle')}</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {roleOverview.map((r, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-[#0F2A56] block">{r.role}</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">{r.task}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-50 border border-[#DCE6F2] rounded-xl text-xs">
        <div className="text-slate-600 font-medium">
          {t('platformGuidelines.footerQuestion')}
        </div>
        <div className="flex items-center space-x-3">
          <Link to="/help-faqs" className="btn-secondary text-xs px-4 py-2">
            {t('platformGuidelines.viewFaqsBtn')}
          </Link>
          <Link to="/contact-support" className="btn-primary text-xs px-4 py-2 flex items-center space-x-1">
            <span>{t('platformGuidelines.contactSupportBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

    </div>
  );
};
