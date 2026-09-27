import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { challengesApi } from '../services/api';
import { Challenge } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { MapPin, Calendar, ArrowRight, Landmark, ChevronRight } from 'lucide-react';
import { MatchedStartups } from '../components/MatchedStartups';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'matching'>('overview');

  useEffect(() => {
    if (id) {
      challengesApi.getById(Number(id)).then(data => {
        setChallenge(data);
        setLoading(false);
      }).catch(console.error);
    }
  }, [id]);

  if (loading) return <div className="text-center py-16 text-slate-500 text-xs">Loading challenge details...</div>;
  if (!challenge) return <div className="text-center py-16 text-slate-500 text-xs">Challenge not found.</div>;

  return (
    <div className="space-y-6">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-blue-700">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/challenges" className="hover:text-blue-700">Opportunities Catalog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-semibold text-slate-800 truncate max-w-xs">{challenge.title}</span>
      </nav>

      {/* Header Banner Card */}
      <div className="gov-panel p-6 space-y-4 border-l-4 border-l-blue-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-blue-800 border border-blue-200">
            {challenge.category}
          </span>
          <StatusBadge status={challenge.status} />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900">{challenge.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-200">
          <span className="flex items-center gap-1.5 font-medium">
            <Landmark className="w-4 h-4 text-slate-400" />
            <strong className="text-slate-800">{challenge.department_name}</strong>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{challenge.location}</span>
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{challenge.timeline}</span>
          </span>
          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Budget: {challenge.budget_range}
          </span>
        </div>

        <div className="pt-2 flex justify-end">
          <Link to={`/challenges/${challenge.id}/apply`} className="btn-primary text-xs px-5 py-2.5 font-semibold flex items-center space-x-1.5 shadow-sm">
            <span>Apply Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-bold text-xs transition-colors ${
              activeTab === 'overview' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Overview & Problem Statement
          </button>
          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-2 px-1 border-b-2 font-bold text-xs transition-colors ${
              activeTab === 'requirements' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Functional & Technical Requirements
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`py-2 px-1 border-b-2 font-bold text-xs transition-colors ${
              activeTab === 'matching' ? 'border-blue-700 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Matched Startup Capabilities
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gov-panel p-6 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-blue-700">Problem Statement</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{challenge.problem_statement}</p>
          </div>

          <div className="gov-panel p-6 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-indigo-700">Desired Outcome</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{challenge.desired_outcome}</p>
          </div>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="gov-panel p-6 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-emerald-700">Functional Requirements</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{challenge.functional_requirements}</p>
          </div>

          <div className="gov-panel p-6 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-purple-700">Technical Requirements</h3>
            <p className="text-xs text-slate-700 leading-relaxed">{challenge.technical_requirements}</p>
          </div>
        </div>
      )}

      {activeTab === 'matching' && (
        <MatchedStartups challengeId={challenge.id} />
      )}

    </div>
  );
};
