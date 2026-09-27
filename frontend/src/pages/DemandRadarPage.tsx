import React, { useEffect, useState } from 'react';
import { startupsApi } from '../services/api';
import { DemandSignal } from '../types';
import { Sparkles, Calendar, Eye, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DemandRadarPage: React.FC = () => {
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    startupsApi.getDemandRadar().then(data => {
      setSignals(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">

      <div className="gov-panel p-6 border-l-4 border-l-amber-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-700">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Early Pipeline Visibility</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Startup Demand Radar</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Anonymized pipeline of upcoming government challenge categories published prior to formal RFP release.
            </p>
          </div>
        </div>

        <span className="text-xs bg-amber-50 text-amber-800 font-bold px-3 py-1.5 rounded border border-amber-200 self-start sm:self-auto">
          Upcoming Pipeline Signals
        </span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">
          Loading upcoming demand signals...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {signals.map(s => (
            <div
              key={s.id}
              className="card-gov space-y-4 border-l-4 border-l-amber-500 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {s.category} • {s.sector}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Est: {s.estimated_timeline}</span>
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
                    <span>{s.department_name} Pipeline Signal</span>
                    <Eye className="w-4 h-4 text-slate-400" />
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Signal Status: <strong className="text-slate-800">{s.status}</strong>
                </span>

                <Link
                  to="/startup-profile"
                  className="text-blue-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Prepare Solution Profile</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};