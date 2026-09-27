import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchingApi } from '../services/api';
import { Sparkles, Building2, MapPin, ArrowRight, CheckCircle2, Info } from 'lucide-react';

export interface RecommendedOpportunity {
  challenge_id: number;
  challenge_title: string;
  category: string;
  department_name: string;
  budget_range: string;
  location: string;
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

export const RecommendedOpportunities: React.FC = () => {
  const [recommendations, setRecommendations] = useState<RecommendedOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    matchingApi.getRecommendedOpportunities()
      .then(data => {
        setRecommendations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching recommended opportunities:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="gov-panel p-6 space-y-4 border-l-4 border-l-emerald-700 bg-emerald-50/20">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <span>Recommended Opportunities for Your Profile</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            100-point capability relevance matching based on your registered tech specs and solution experience.
          </p>
        </div>
        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded border border-emerald-200">
          Relevance Discovery Engine
        </span>
      </div>

      {/* Governance Disclaimer */}
      <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900 flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span><strong>Match Score = Relevance</strong> (AI assists relevance discovery; human committee handles selection).</span>
      </div>

      {loading ? (
        <div className="text-xs text-slate-500 text-center py-6">
          Calculating profile match scores against government challenges...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-xs text-slate-500 text-center py-6">
          No matching government challenges found for your profile.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map(rec => (
            <div
              key={rec.challenge_id}
              className="p-4 rounded-lg bg-white border border-slate-200 space-y-3 hover:border-emerald-400 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {rec.category}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {rec.department_name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-700 text-white font-bold text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{rec.total_score}% Match Score</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors">
                  {rec.challenge_title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 font-mono text-[11px]">
                  Matching Factors: {rec.breakdown_notes}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-3 text-slate-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {rec.location}
                  </span>
                  <span className="font-bold text-emerald-700">
                    {rec.budget_range}
                  </span>
                </div>

                <Link
                  to={`/challenges/${rec.challenge_id}`}
                  className="btn-secondary text-xs py-1.5 px-3 flex items-center space-x-1 text-slate-800 hover:bg-slate-100"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
