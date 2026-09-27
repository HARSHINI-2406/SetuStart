import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { evidenceApi, validationApi, pilotsApi, procurementApi } from '../services/api';
import { Evidence, IndependentValidation, Pilot, ProcurementRecord } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { FileCheck, ShieldCheck, CheckCircle2, Plus, Award, AlertTriangle } from 'lucide-react';

export const EvidenceValidationPage: React.FC = () => {
  const { user } = useAuth();
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [validations, setValidations] = useState<IndependentValidation[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [procurements, setProcurements] = useState<ProcurementRecord[]>([]);
  const [selectedPilotId, setSelectedPilotId] = useState<number | ''>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // New Evidence Form
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [evidenceType, setEvidenceType] = useState<string>('Audit Report');

  // Independent Validation Form Modal State
  const [selectedEvId, setSelectedEvId] = useState<number | null>(null);
  const [valResult, setValResult] = useState<string>('Validated');
  const [valReport, setValReport] = useState<string>('Independent on-site inspection confirmed physical hardware mounting and continuous telemetry log integrity.');
  const [valError, setValError] = useState<string>('');

  // Procurement Nomination Modal State
  const [procurementModalEv, setProcurementModalEv] = useState<Evidence | null>(null);
  const [procurementModalPilot, setProcurementModalPilot] = useState<Pilot | null>(null);
  const [procurementModalVal, setProcurementModalVal] = useState<IndependentValidation | null>(null);
  const [decisionReason, setDecisionReason] = useState<string>('');
  const [procurementError, setProcurementError] = useState<string | null>(null);
  const [procurementSuccess, setProcurementSuccess] = useState<string | null>(null);
  const [submittingProcurement, setSubmittingProcurement] = useState<boolean>(false);

  const fetchData = () => {
    Promise.all([
      evidenceApi.getAll(),
      validationApi.getAll(),
      pilotsApi.getAll(),
      procurementApi.getAll()
    ]).then(([eData, vData, pData, prData]) => {
      setEvidenceList(eData);
      setValidations(vData);
      setPilots(pData);
      setProcurements(prData);
      if (pData.length > 0 && selectedPilotId === '') {
        setSelectedPilotId(pData[0].id);
      }
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!selectedPilotId) {
      setSubmitError('Please select a valid pilot sandbox.');
      return;
    }

    try {
      await evidenceApi.submit({
        pilot_id: Number(selectedPilotId),
        title,
        description,
        evidence_type: evidenceType
      });
      setTitle('');
      setDescription('');
      fetchData();
    } catch (err: any) {
      setSubmitError(err.response?.data?.detail || 'Failed to submit evidence pack');
    }
  };

  const handleSubmitValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvId) return;
    setValError('');

    try {
      await validationApi.submit({
        evidence_id: selectedEvId,
        validation_result: valResult,
        detailed_report: valReport
      });
      setSelectedEvId(null);
      fetchData();
    } catch (err: any) {
      setValError(err.response?.data?.detail || 'Validation failed due to role segregation policy.');
    }
  };

  const handleOpenProcurementModal = (ev: Evidence, pilot: Pilot | undefined, validation: IndependentValidation | undefined) => {
    if (!pilot) return;
    setProcurementModalEv(ev);
    setProcurementModalPilot(pilot);
    setProcurementModalVal(validation || null);
    setDecisionReason(`Pilot '${pilot.pilot_name}' achieved verified evidence validation (${ev.validation_status}). Recommended for scale-up procurement.`);
    setProcurementError(null);
    setProcurementSuccess(null);
  };

  const handleSubmitProcurement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!procurementModalPilot) return;

    setProcurementError(null);
    setProcurementSuccess(null);
    setSubmittingProcurement(true);

    try {
      const createdRec = await procurementApi.createRecommendation({
        pilot_id: procurementModalPilot.id,
        startup_id: procurementModalPilot.startup_id,
        decision_reason: decisionReason
      });

      setProcurementSuccess(`Nominated for Procurement successfully (Status: ${createdRec.procurement_status}, ${createdRec.approval_status})!`);
      fetchData();
      setTimeout(() => {
        setProcurementModalEv(null);
        setProcurementModalPilot(null);
        setProcurementModalVal(null);
        setProcurementSuccess(null);
      }, 1500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Failed to nominate for procurement.';
      setProcurementError(detail);
    } finally {
      setSubmittingProcurement(false);
    }
  };

  const canSubmitEvidence = user?.role === 'Startup' || user?.role === 'Administrator';
  const canAuditValidation = user?.role === 'Independent Validator' || user?.role === 'Administrator';
  const canNominateProcurement = user?.role === 'Government Department' || user?.role === 'Administrator';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-200">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Independent Audit Framework</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Evidence & Independent Validation Workspace</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">Post-pilot evidence auditing by Independent Validators (strictly segregated from application evaluators).</p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Role Segregation Enforced</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Submit Evidence Form (Startup only) */}
        {canSubmitEvidence && (
          <div className="gov-panel p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Submit Pilot Evidence Pack</h3>
            
            {submitError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">
                {submitError}
              </div>
            )}

            <form onSubmit={handleAddEvidence} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Pilot Sandbox</label>
                {pilots.length === 0 ? (
                  <div className="p-2.5 rounded bg-slate-100 border border-slate-200 text-slate-500 italic text-xs">
                    No active pilots available for evidence submission.
                  </div>
                ) : (
                  <select
                    value={selectedPilotId}
                    onChange={e => setSelectedPilotId(Number(e.target.value))}
                    className="select-field text-xs"
                    required
                  >
                    <option value="" disabled>-- Select Pilot Sandbox --</option>
                    {pilots.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.pilot_name} ({p.status})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Evidence Pack Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="input-field text-xs" placeholder="e.g. 90-Day Telemetry Log & Field Audit" required />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Evidence Artifact Type</label>
                <select value={evidenceType} onChange={e => setEvidenceType(e.target.value)} className="select-field text-xs">
                  <option value="Audit Report">Audit Report</option>
                  <option value="Performance Metric">Performance Metric</option>
                  <option value="User Feedback">User Feedback</option>
                  <option value="System Logs">System Logs</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Methodology</label>
                <textarea rows={3} value={description} onChange={e => setDescription(e.target.value)} className="input-field text-xs" required />
              </div>
              <button type="submit" className="btn-primary text-xs w-full py-2.5 font-bold flex items-center justify-center space-x-1">
                <Plus className="w-4 h-4" />
                <span>Submit Evidence Pack</span>
              </button>
            </form>
          </div>
        )}

        {/* Evidence List & Independent Audit Action */}
        <div className={`${canSubmitEvidence ? 'lg:col-span-2' : 'lg:col-span-3'} gov-panel p-6 space-y-4`}>
          <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Submitted Evidence Packs & Audit Findings</h3>
          
          {loading ? (
            <p className="text-xs text-slate-500 py-6 text-center">Loading evidence packs...</p>
          ) : evidenceList.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center border border-dashed border-slate-300 rounded-lg">No evidence packs submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {evidenceList.map(ev => {
                const pilot = pilots.find(p => p.id === ev.pilot_id);
                const validation = validations.find(v => v.evidence_id === ev.id || v.pilot_id === ev.pilot_id);
                const existingProcurement = procurements.find(pr => pr.pilot_id === ev.pilot_id);
                const isValidated = ev.validation_status === 'Validated' || ev.validation_status === 'Partially Validated';

                return (
                  <div key={ev.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{ev.title}</span>
                      <StatusBadge status={ev.validation_status} />
                    </div>
                    <p className="text-slate-600">{ev.description}</p>
                    {pilot && (
                      <p className="text-[11.5px] text-slate-500">
                        Pilot: <strong className="text-slate-800">{pilot.pilot_name}</strong> • Startup: <strong className="text-slate-800">{pilot.startup_name}</strong>
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px]">
                      <span className="text-slate-500 font-medium">Submitted by: <strong className="text-slate-800">{ev.submitted_by}</strong></span>
                      
                      {existingProcurement ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                          <Award className="w-3.5 h-3.5 text-blue-700" />
                          <span>Procurement: {existingProcurement.procurement_status} ({existingProcurement.approval_status})</span>
                        </span>
                      ) : isValidated && canNominateProcurement ? (
                        <button 
                          onClick={() => handleOpenProcurementModal(ev, pilot, validation)}
                          className="btn-accent text-[11px] py-1 px-3 shadow-xs font-bold inline-flex items-center gap-1"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Nominate for Procurement</span>
                        </button>
                      ) : ev.validation_status === 'Not Validated' && canAuditValidation ? (
                        <button 
                          onClick={() => setSelectedEvId(ev.id)}
                          className="btn-accent text-[11px] py-1 px-3 shadow-xs font-semibold"
                        >
                          Audit & Validate
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Independent Audit Validation Modal */}
      {selectedEvId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-2">Independent Audit Submission (Evidence #{selectedEvId})</h3>
            
            {valError && <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs font-semibold">{valError}</div>}

            <form onSubmit={handleSubmitValidation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Independent Validation Result</label>
                <select value={valResult} onChange={e => setValResult(e.target.value)} className="select-field text-xs">
                  <option value="Validated">Validated (100% Verified)</option>
                  <option value="Partially Validated">Partially Validated</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Audit Findings & Field Report</label>
                <textarea rows={4} value={valReport} onChange={e => setValReport(e.target.value)} className="input-field text-xs" required />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setSelectedEvId(null)} className="btn-secondary text-xs">Cancel</button>
                <button type="submit" className="btn-accent text-xs flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Submit Independent Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Procurement Nomination Modal */}
      {procurementModalPilot && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-700" />
                  <span>Nominate for Public Sector Procurement</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilot #{procurementModalPilot.id} • Startup #{procurementModalPilot.startup_id}
                </p>
              </div>
            </div>

            {procurementError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{procurementError}</span>
              </div>
            )}

            {procurementSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{procurementSuccess}</span>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Target Pilot Sandbox:</span>
                <p className="font-bold text-slate-900">{procurementModalPilot.pilot_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                <div>
                  <span className="text-slate-500 font-medium">Startup:</span>
                  <p className="font-bold text-slate-800">{procurementModalPilot.startup_name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Challenge:</span>
                  <p className="font-bold text-slate-800">{procurementModalPilot.challenge_title}</p>
                </div>
              </div>
              {procurementModalVal && (
                <div className="pt-2 border-t border-slate-200 text-[11.5px]">
                  <span className="text-slate-500 font-medium">Independent Audit Result:</span>
                  <p className="font-bold text-emerald-800">{procurementModalVal.validation_result}</p>
                  <p className="text-slate-600 text-[11px] italic mt-0.5">{procurementModalVal.detailed_report}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitProcurement} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Procurement Nomination Justification</label>
                <textarea
                  rows={3}
                  required
                  value={decisionReason}
                  onChange={e => setDecisionReason(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={submittingProcurement}
                  onClick={() => {
                    setProcurementModalEv(null);
                    setProcurementModalPilot(null);
                    setProcurementModalVal(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProcurement}
                  className="btn-accent text-xs flex items-center space-x-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{submittingProcurement ? 'Submitting...' : 'Confirm Procurement Nomination'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
