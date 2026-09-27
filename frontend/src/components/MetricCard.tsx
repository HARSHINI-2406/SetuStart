import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'purple';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, trend, color = 'blue' }) => {
  const colorStyles = {
    blue: 'bg-blue-50/60 border-blue-200 text-blue-700',
    emerald: 'bg-emerald-50/60 border-emerald-200 text-emerald-700',
    amber: 'bg-amber-50/60 border-amber-200 text-amber-700',
    purple: 'bg-purple-50/60 border-purple-200 text-purple-700'
  };

  return (
    <div className="card-gov flex flex-col justify-between hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-md border ${colorStyles[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-600 mt-0.5">{subtitle}</p>}
        {trend && <p className="text-[11px] text-emerald-700 font-semibold mt-2 flex items-center">↑ {trend}</p>}
      </div>
    </div>
  );
};
