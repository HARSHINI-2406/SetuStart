import React, { useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { PublicStats } from '../types';
import { Activity, CheckCircle2, ShieldCheck } from 'lucide-react';

export const PublicStatsWidget: React.FC = () => {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    publicApi.getStats().then(setStats).catch(console.error);
  }, []);

  if (!stats) return <div className="text-slate-500 text-xs py-6 text-center">Loading Public Transparency Metrics...</div>;

  return (
    <div className="gov-panel p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Public Transparency Portal</h2>
            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">Live Audit</span>
          </div>
          <p className="text-xs text-slate-600 mt-0.5">Aggregate non-sensitive public value metrics governed by SetuStart Platform.</p>
        </div>
        <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-300 font-mono font-semibold">
          Avg Pilot SLA: {stats.metrics.average_time_to_pilot_days} Days
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs text-slate-600 font-medium">Published Challenges</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.metrics.total_challenges_published}</p>
        </div>
        <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200">
          <p className="text-xs text-blue-800 font-medium">Active Innovation Pilots</p>
          <p className="text-2xl font-extrabold text-blue-700 mt-1">{stats.metrics.active_innovation_pilots}</p>
        </div>
        <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200">
          <p className="text-xs text-emerald-800 font-medium">Procured & Scaled Solutions</p>
          <p className="text-2xl font-extrabold text-emerald-700 mt-1">{stats.metrics.procured_and_scaled_solutions}</p>
        </div>
        <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200">
          <p className="text-xs text-amber-800 font-medium">Verified Eligible Startups</p>
          <p className="text-2xl font-extrabold text-amber-700 mt-1">{stats.metrics.registered_eligible_startups}</p>
        </div>
      </div>

      {/* Guarantees */}
      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Core Governance Guarantees</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {stats.governance_guarantees.map((g, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
