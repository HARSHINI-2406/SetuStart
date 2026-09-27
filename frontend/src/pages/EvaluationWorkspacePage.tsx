import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsApi, evaluationsApi, challengesApi, waiversApi, pilotsApi } from '../services/api';
import { Challenge, Application, EligibilityWaiver, Pilot } from '../types';
import { Award, AlertTriangle, CheckCircle2, Rocket, ShieldCheck } from 'lucide-react';

export const EvaluationWorkspacePage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [selectedChallengeId, setSelectedChallengeId] = useState<number>(0);
  const [applications, setApplications] = useState<Application[]>([]);
  const [waivers, setWaivers] = useState<EligibilityWaiver[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Evaluation Form State
  const [selectedAppId, setSelectedAppId] = useState<number | null>(null);
  const [techScore, setTechScore] = useState<number>(18.0);
  const [impactScore, setImpactScore] = useState<number>(14.0);
  const [readinessScore, setReadinessScore] = useState<number>(9.0);
  const [expScore, setExpScore] = useState<number>(8.0);
  const [comments, setComments] = useState<string>('Evaluated proposal: strong technical architecture and clear pilot implementation roadmap.');
  const [recommendation, setRecommendation] = useState<string>('Recommend');

  // Pilot Sandbox Launch Form State
  const [pilotModalApp, setPilotModalApp] = useState<Application | null>(null);
  const [pilotName, setPilotName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [objectives, setObjectives] = useState<string>('');
  const [dataBoundary, setDataBoundary] = useState<string>('');
  const [complianceNotes, setComplianceNotes] = useState<string>('');
  const [permittedEnv, setPermittedEnv] = useState<string>('');
  const [pilotError, setPilotError] = useState<string | null>(null);
  const [pilotSuccess, setPilotSuccess] = useState<string | null>(null);
  const [submittingPilot, setSubmittingPilot] = useState<boolean>(false);

  const loadApplications = (challengeId: number) => {
    applicationsApi.getAll(challengeId).then(setApplications).catch(console.error);
  };

  const loadPilots = () => {
    pilotsApi.getAll().then(setPilots).catch(console.error);
  };

  useEffect(() => {
    Promise.all([
      challengesApi.getAll(),
      waiversApi.getAll(),
      pilotsApi.getAll()
    ]).then(([cData, wData, pData]) => {
      setChallenges(cData);
      setWaivers(wData);
      setPilots(pData);
      if (cData.length > 0) {
        setSelectedChallengeId(cData[0].id);
        loadApplications(cData[0].id);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedChallengeId) {
      loadApplications(selectedChallengeId);
    }
  }, [selectedChallengeId]);

  const handleReviewWaiver = async (waiverId: number, statusStr: string) => {
    await waiversApi.review(waiverId, statusStr, `Waiver ${statusStr.toLowerCase()} by authorized officer.`);
    waiversApi.getAll().then(setWaivers);
    if (selectedChallengeId) {
      loadApplications(selectedChallengeId);
    }
  };

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppId) return;

    await evaluationsApi.submit({
      application_id: selectedAppId,
      technical_score: techScore,
      impact_score: impactScore,
      readiness_score: readinessScore,
      experience_score: expScore,
      comments: comments,
      recommendation: recommendation
    });

    alert("Human evaluation submitted successfully! Application status updated.");
    setSelectedAppId(null);
    if (selectedChallengeId) {
      loadApplications(selectedChallengeId);
    }
    loadPilots();
  };

  const handleOpenPilotModal = (app: Application) => {
    const currentChallenge = challenges.find(c => c.id === app.challenge_id);
    const today = new Date().toISOString().split('T')[0];
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const endDateStr = sixMonthsLater.toISOString().split('T')[0];

    setPilotModalApp(app);
    setPilotName(`${currentChallenge?.title || 'Challenge'} - Sandbox Pilot`);
    setStartDate(today);
    setEndDate(endDateStr);
    setObjectives(app.proposal_summary || 'Execute proof-of-concept sandbox pilot.');
    setDataBoundary('Isolated synthetic test data only; no live citizen PII.');
    setComplianceNotes('Compliant with Section 18a Innovation Sandbox protocol.');
    setPermittedEnv('Sandboxed Test Cluster');
    setPilotError(null);
    setPilotSuccess(null);
  };

  const handleSubmitPilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pilotModalApp) return;

    setPilotError(null);
    setPilotSuccess(null);
    setSubmittingPilot(true);

    try {
      const createdPilot = await pilotsApi.create({
        pilot_name: pilotName,
        challenge_id: pilotModalApp.challenge_id,
        startup_id: pilotModalApp.startup_id,
        start_date: startDate,
        end_date: endDate,
        objectives: objectives,
        sandbox_constraint: {
          data_boundary: dataBoundary,
          compliance_notes: complianceNotes,
          permitted_environment: permittedEnv
        }
      });

      setPilotSuccess(`Pilot Sandbox '${createdPilot.pilot_name}' created successfully (Status: ${createdPilot.status || 'Active'})!`);
      loadPilots();
      if (selectedChallengeId) {
        loadApplications(selectedChallengeId);
      }
      setTimeout(() => {
        setPilotModalApp(null);
        setPilotSuccess(null);
      }, 1500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Failed to create pilot sandbox.';
      setPilotError(detail);
    } finally {
      setSubmittingPilot(false);
    }
  };

  const isAuthorizedToManage = user?.role === 'Government Department' || user?.role === 'Evaluator' || user?.role === 'Administrator';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Independent Committee Review</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Human Evaluation Workspace</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Independent expert scoring & review. AI assists with relevance discovery; committee decides pilot shortlists.
            </p>
          </div>
        </div>

        <select 
          value={selectedChallengeId} 
          onChange={e => setSelectedChallengeId(Number(e.target.value))}
          className="select-field text-xs sm:w-64"
        >
          {challenges.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* Pending Eligibility Waiver Requests */}
      {waivers.filter(w => w.status === 'Pending Review').length > 0 && (
        <div className="gov-panel p-5 space-y-3 border-l-4 border-l-amber-500 bg-amber-50/30">
          <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Pending Eligibility Waiver Requests</span>
          </h3>
          <div className="space-y-2">
            {waivers.filter(w => w.status === 'Pending Review').map(w => (
              <div key={w.id} className="p-3 rounded-lg bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                <div>
                  <p className="font-bold text-slate-900">Application #{w.application_id} • Criterion Failed: {w.criteria_failed}</p>
                  <p className="text-slate-600 text-[11.5px] mt-0.5">Justification: {w.justification}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button onClick={() => handleReviewWaiver(w.id, 'Approved')} className="btn-accent text-[11px] px-3 py-1 font-semibold">Approve Waiver</button>
                  <button onClick={() => handleReviewWaiver(w.id, 'Rejected')} className="btn-secondary text-[11px] px-3 py-1 font-semibold text-red-700 border-red-200 hover:bg-red-50">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Applications Table */}
      <div className="gov-panel p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Submitted Proposals for Evaluation</h3>

        {applications.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No applications submitted for this challenge yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">App ID</th>
                  <th className="p-3">Proposal Approach</th>
                  <th className="p-3">Expected Impact</th>
                  <th className="p-3">Proposal Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {applications.map((app) => {
                  const existingPilot = pilots.find(
                    p => p.challenge_id === app.challenge_id && p.startup_id === app.startup_id
                  );
                  const isEligibleForPilot = app.status === 'Shortlisted' || app.status === 'Selected';

                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-bold text-slate-900 font-mono">
                        #{app.id}
                      </td>
                      <td className="p-3 text-slate-700 max-w-xs truncate">{app.proposal_summary}</td>
                      <td className="p-3 text-slate-600 text-[11.5px] max-w-xs truncate">{app.expected_impact}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {existingPilot ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Pilot {existingPilot.status || 'Active'}</span>
                          </span>
                        ) : isEligibleForPilot ? (
                          isAuthorizedToManage ? (
                            <button
                              onClick={() => handleOpenPilotModal(app)}
                              className="btn-accent text-[11px] py-1 px-3 shadow-xs inline-flex items-center gap-1"
                            >
                              <Rocket className="w-3.5 h-3.5" />
                              <span>Launch Pilot Sandbox</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">Shortlisted</span>
                          )
                        ) : isAuthorizedToManage ? (
                          <button 
                            onClick={() => setSelectedAppId(app.id)}
                            className="btn-primary text-[11px] py-1 px-3 shadow-xs"
                          >
                            Evaluate Proposal
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-500 font-medium">Read Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Human Evaluation Modal */}
      {selectedAppId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">Committee Evaluation Form (Proposal #{selectedAppId})</h3>
            
            <form onSubmit={handleSubmitEvaluation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Technical Fit (max 20)</label>
                  <input type="number" step="0.5" value={techScore} onChange={e => setTechScore(Number(e.target.value))} className="input-field text-xs" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Impact Potential (max 15)</label>
                  <input type="number" step="0.5" value={impactScore} onChange={e => setImpactScore(Number(e.target.value))} className="input-field text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Readiness (max 10)</label>
                  <input type="number" step="0.5" value={readinessScore} onChange={e => setReadinessScore(Number(e.target.value))} className="input-field text-xs" />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Experience (max 10)</label>
                  <input type="number" step="0.5" value={expScore} onChange={e => setExpScore(Number(e.target.value))} className="input-field text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Committee Recommendation</label>
                <select value={recommendation} onChange={e => setRecommendation(e.target.value)} className="select-field text-xs">
                  <option value="Recommend">Recommend for Sandbox Pilot</option>
                  <option value="Needs Review">Needs Further Review</option>
                  <option value="Do Not Recommend">Do Not Recommend</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Evaluation Comments & Rationale</label>
                <textarea rows={3} value={comments} onChange={e => setComments(e.target.value)} className="input-field text-xs" />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setSelectedAppId(null)} className="btn-secondary text-xs">Cancel</button>
                <button type="submit" className="btn-primary text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Evaluation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Launch Pilot Sandbox Modal */}
      {pilotModalApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-emerald-600" />
                  <span>Launch Pilot Sandbox</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Proposal #{pilotModalApp.id} • Challenge #{pilotModalApp.challenge_id} • Startup #{pilotModalApp.startup_id}
                </p>
              </div>
            </div>

            {pilotError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{pilotError}</span>
              </div>
            )}

            {pilotSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{pilotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitPilot} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Pilot Name</label>
                <input
                  type="text"
                  required
                  value={pilotName}
                  onChange={e => setPilotName(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Pilot Objectives</label>
                <textarea
                  rows={3}
                  required
                  value={objectives}
                  onChange={e => setObjectives(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 text-[11px] block border-b border-slate-200 pb-1">
                  Sandbox Governance & Constraints (Section 18a)
                </span>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Data Boundary</label>
                  <input
                    type="text"
                    required
                    value={dataBoundary}
                    onChange={e => setDataBoundary(e.target.value)}
                    className="input-field text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Compliance Notes</label>
                  <input
                    type="text"
                    required
                    value={complianceNotes}
                    onChange={e => setComplianceNotes(e.target.value)}
                    className="input-field text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Permitted Environment</label>
                  <input
                    type="text"
                    required
                    value={permittedEnv}
                    onChange={e => setPermittedEnv(e.target.value)}
                    className="input-field text-xs bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={submittingPilot}
                  onClick={() => setPilotModalApp(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPilot}
                  className="btn-accent text-xs flex items-center space-x-1"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>{submittingPilot ? 'Launching...' : 'Confirm Launch Pilot'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

