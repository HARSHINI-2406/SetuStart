import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { challengesApi, startupsApi, applicationsApi, waiversApi } from '../services/api';
import { Challenge, StartupSolution } from '../types';
import { Send, AlertTriangle } from 'lucide-react';

export const ApplyChallengePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [solutions, setSolutions] = useState<StartupSolution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<number>(0);
  const [proposalSummary, setProposalSummary] = useState<string>('');
  const [implementationPlan, setImplementationPlan] = useState<string>('');
  const [expectedImpact, setExpectedImpact] = useState<string>('');

  // Waiver State
  const [needWaiver, setNeedWaiver] = useState<boolean>(false);
  const [criteriaFailed, setCriteriaFailed] = useState<string>('Prior turnover requirement of ₹2.5M');
  const [justification, setJustification] = useState<string>('Our team possesses specialized technology and research institute recommendations.');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      challengesApi.getById(Number(id)).then(setChallenge).catch(console.error);
      startupsApi.getSolutions().then(data => {
        setSolutions(data);
        if (data.length > 0) setSelectedSolution(data[0].id);
      }).catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSolution) {
      setError("Please select a solution from your catalog.");
      return;
    }
    setSubmitting(true);
    setError('');

    try {
      const app = await applicationsApi.submit({
        challenge_id: Number(id),
        solution_id: selectedSolution,
        proposal_summary: proposalSummary,
        implementation_plan: implementationPlan,
        expected_impact: expectedImpact
      });

      if (needWaiver) {
        await waiversApi.request({
          application_id: app.id,
          criteria_failed: criteriaFailed,
          justification: justification
        });
      }

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit application');
      setSubmitting(false);
    }
  };

  if (!challenge) return <div className="text-center py-16 text-slate-500 text-xs">Loading challenge...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex items-center space-x-3">
        <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Solution Submission Workflow</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5">Submit Challenge Proposal</h1>
          <p className="text-xs text-slate-600">Applying to: <strong className="text-slate-900">{challenge.title}</strong></p>
        </div>
      </div>

      <div className="gov-panel p-6 space-y-6">
        
        {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-800 font-bold mb-1">Select Solution Profile from Your Catalog</label>
            <select 
              value={selectedSolution} 
              onChange={e => setSelectedSolution(Number(e.target.value))}
              className="select-field text-xs"
              required
            >
              {solutions.map(s => <option key={s.id} value={s.id}>{s.solution_name} ({s.deployment_readiness})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">Proposal Approach Summary</label>
            <textarea 
              rows={3} 
              value={proposalSummary} 
              onChange={e => setProposalSummary(e.target.value)} 
              className="input-field text-xs" 
              placeholder="Detail your technical and operational approach to this challenge..." 
              required 
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">Implementation & Deployment Plan</label>
            <textarea 
              rows={3} 
              value={implementationPlan} 
              onChange={e => setImplementationPlan(e.target.value)} 
              className="input-field text-xs" 
              placeholder="Phase 1, Phase 2 timeline, hardware deployment, and pilot sandbox rollout..." 
              required 
            />
          </div>

          <div>
            <label className="block text-slate-800 font-bold mb-1">Targeted Public Impact & KPI Alignment</label>
            <textarea 
              rows={2} 
              value={expectedImpact} 
              onChange={e => setExpectedImpact(e.target.value)} 
              className="input-field text-xs" 
              placeholder="Quantifiable KPI target reductions or performance gains..." 
              required 
            />
          </div>

          {/* Eligibility Waiver Section */}
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={needWaiver} 
                onChange={e => setNeedWaiver(e.target.checked)} 
                className="rounded border-slate-300 text-blue-700 focus:ring-0" 
              />
              <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>File Eligibility Waiver Request (Rule-Based Waiver Engine)</span>
              </span>
            </label>

            {needWaiver && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Criterion Failed (e.g. Prior Turnover / Operating Years)</label>
                  <input 
                    type="text" 
                    value={criteriaFailed} 
                    onChange={e => setCriteriaFailed(e.target.value)} 
                    className="input-field text-xs" 
                  />
                </div>
                <div>
                  <label className="block text-slate-800 font-bold mb-1">Justification & Supporting IP / Track Record</label>
                  <textarea 
                    rows={2} 
                    value={justification} 
                    onChange={e => setJustification(e.target.value)} 
                    className="input-field text-xs" 
                  />
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={submitting} className="btn-primary text-xs w-full py-2.5 font-bold shadow-sm">
            {submitting ? 'Submitting Application Proposal...' : 'Submit Proposal & Score Capability'}
          </button>

        </form>

      </div>

    </div>
  );
};
