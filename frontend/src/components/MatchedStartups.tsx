import React, { useEffect, useState } from 'react';
import { matchingApi } from '../services/api';
import { Sparkles, Building, CheckCircle2, Cpu, Info } from 'lucide-react';

export interface MatchedStartupItem {
  startup_id: number;
  startup_name: string;
  solution_category: string;
  industry: string;
  technology: string;
  total_score: number;
  breakdown: {
    eligibility: number;
    requirement_match: number;
    technical_fit: number;
    impact_potential: number;
    implementation_readiness: number;
    relevant_experience: number;
  };
  breakdown_notes: string;
}

interface MatchedStartupsProps {
  challengeId: number;
}

export const MatchedStartups: React.FC<MatchedStartupsProps> = ({ challengeId }) => {
  const [matchedStartups, setMatchedStartups] = useState<MatchedStartupItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    matchingApi.getMatchedStartups(challengeId)
      .then(data => {
        setMatchedStartups(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching matched startups:", err);
        setLoading(false);
      });
  }, [challengeId]);

  return (
    <div className="gov-panel p-6 space-y-4 border-l-4 border-l-blue-700">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-700" />
            <span>Matched Startups (Capability & Relevance Engine)</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            100-point explainable capability matching. AI assists by identifying relevance; human evaluation committee decides procurement outcomes.
          </p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-800 font-semibold px-2.5 py-1 rounded border border-blue-200">
          Match Discovery Engine
        </span>
      </div>

      {/* Governance Disclaimer Callout */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Match Score = Capability Relevance</strong> (Not an evaluation score, winner selection, or procurement award).
        </div>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 text-center py-6">
          Calculating startup relevance match scores...
        </div>
      ) : matchedStartups.length === 0 ? (
        <div className="text-xs text-slate-500 text-center py-6">
          No registered startups currently match this challenge.
        </div>
      ) : (
        <div className="space-y-4">
          {matchedStartups.map(item => (
            <div
              key={item.startup_id}
              className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 hover:border-blue-400 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-blue-100 text-blue-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    {item.startup_name}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-white text-blue-800 border border-slate-200">
                    {item.industry} • {item.solution_category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-700 text-white font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{item.total_score}% Match Score</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700">
                <Cpu className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Tech Stack: <strong className="text-slate-900">{item.technology}</strong></span>
              </div>

              <p className="text-xs text-slate-600 font-mono text-[11px] pt-1.5 border-t border-slate-200">
                Matching Breakdown: {item.breakdown_notes}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
