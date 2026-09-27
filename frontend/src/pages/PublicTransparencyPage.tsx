import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { PublicStatsWidget } from '../components/PublicStatsWidget';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const PublicTransparencyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('publicTransparency.badge')}</span>
        <h1 className="text-3xl font-extrabold text-slate-900">{t('publicTransparency.title')}</h1>
        <p className="text-slate-600 text-xs max-w-2xl mx-auto leading-relaxed">
          {t('publicTransparency.subtitle')}
        </p>
      </div>

      <PublicStatsWidget />

      <div className="p-6 gov-panel space-y-3">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-700" />
          <span>{t('publicTransparency.archTitle')}</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          {t('publicTransparency.archDesc')}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('publicTransparency.auditLogs')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('publicTransparency.scoringRules')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
