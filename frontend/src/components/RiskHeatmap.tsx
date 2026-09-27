import React, { useEffect, useState } from 'react';
import { pilotsApi } from '../services/api';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export const RiskHeatmap: React.FC = () => {
  const [matrix, setMatrix] = useState<any>(null);

  useEffect(() => {
    pilotsApi.getRiskHeatmap().then(setMatrix).catch(console.error);
  }, []);

  if (!matrix) return <div className="text-slate-400 text-xs">Loading Risk Heatmap...</div>;

  const severities = ['Critical', 'High', 'Medium', 'Low'];
  const probabilities = ['High', 'Medium', 'Low'];

  const getCellColor = (sev: string, prob: string) => {
    if (sev === 'Critical' || (sev === 'High' && prob === 'High')) return 'bg-red-950/60 border-red-800/80 text-red-300';
    if (sev === 'High' || prob === 'High') return 'bg-orange-950/60 border-orange-800/80 text-orange-300';
    if (sev === 'Medium' || prob === 'Medium') return 'bg-amber-950/60 border-amber-800/80 text-amber-300';
    return 'bg-slate-900 border-slate-800 text-slate-400';
  };

  return (
    <div className="glass-panel p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-white text-base">Cross-Pilot Systemic Risk Heatmap</h3>
        </div>
        <span className="text-xs text-slate-400">Severity × Probability Matrix</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-slate-500 font-semibold border-b border-slate-800">Severity ↓ / Probability →</th>
              {probabilities.map(p => (
                <th key={p} className="p-2 text-center text-slate-400 font-semibold border-b border-slate-800">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {severities.map(sev => (
              <tr key={sev}>
                <td className="p-2 font-semibold text-slate-300 border-r border-slate-800">{sev}</td>
                {probabilities.map(prob => {
                  const items = matrix[sev]?.[prob] || [];
                  return (
                    <td key={prob} className={`p-3 border border-slate-800/60 align-top h-24 ${getCellColor(sev, prob)}`}>
                      <div className="font-bold text-[10px] mb-1 opacity-75">{items.length} Risk(s)</div>
                      <div className="space-y-1">
                        {items.map((r: any) => (
                          <div key={r.risk_id} className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-[11px]">
                            <p className="font-medium text-slate-200 truncate">{r.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">Mitigation: {r.mitigation}</p>
                          </div>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
