import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { procurementApi, reuseApi, contractsApi } from '../services/api';
import { ProcurementRecord, ReuseRecommendation, Contract } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { UserCheck, Sparkles, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ProcurementScalePage: React.FC = () => {
  const { user } = useAuth();
  const [procurements, setProcurements] = useState<ProcurementRecord[]>([]);
  const [approvalGates, setApprovalGates] = useState<any[]>([]);
  const [reuseRecs, setReuseRecs] = useState<ReuseRecommendation[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Contract Modal State
  const [contractModalProc, setContractModalProc] = useState<ProcurementRecord | null>(null);
  const [contractTerms, setContractTerms] = useState<string>('');
  const [totalValue, setTotalValue] = useState<number>(12000000);
  const [contractError, setContractError] = useState<string | null>(null);
  const [contractSuccess, setContractSuccess] = useState<string | null>(null);
  const [submittingContract, setSubmittingContract] = useState<boolean>(false);

  const fetchData = () => {
    Promise.all([
      procurementApi.getAll(),
      procurementApi.getApprovalGates(),
      reuseApi.getAll(),
      contractsApi.getAll()
    ]).then(([pData, gData, rData, cData]) => {
      setProcurements(pData);
      setApprovalGates(gData);
      setReuseRecs(rData);
      setContracts(cData);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActionGate = async (gateId: number, statusStr: string) => {
    await procurementApi.actionApprovalGate(gateId, statusStr, `Sign-off ${statusStr.toLowerCase()} by department head.`);
    fetchData();
  };

  const handleActionReuse = async (recId: number, statusStr: string) => {
    await reuseApi.action(recId, statusStr);
    fetchData();
  };

  const handleOpenContractModal = (p: ProcurementRecord) => {
    setContractModalProc(p);
    setContractTerms("Standard Public Procurement Innovation Contract governing milestone deliverables, payment escrow, AES-256 data boundary compliance, and outcome-based disbursement.");
    setTotalValue(12000000);
    setContractError(null);
    setContractSuccess(null);
  };

  const handleSubmitContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractModalProc) return;

    setContractError(null);
    setContractSuccess(null);
    setSubmittingContract(true);

    try {
      const createdContract = await contractsApi.create({
        pilot_id: contractModalProc.pilot_id,
        startup_id: contractModalProc.startup_id,
        contract_terms: contractTerms,
        total_value: Number(totalValue)
      });

      setContractSuccess(`Contract #${createdContract.id} created successfully (Value: ₹${(createdContract.total_value / 100000).toFixed(1)} Lakhs)!`);
      fetchData();
      setTimeout(() => {
        setContractModalProc(null);
        setContractSuccess(null);
      }, 1500);
    } catch (err: any) {
      const detail = err?.response?.data?.detail || err?.message || 'Failed to create contract.';
      setContractError(detail);
    } finally {
      setSubmittingContract(false);
    }
  };

  const canCreateContract = user?.role === 'Government Department' || user?.role === 'Administrator';

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Public Sector Scaling</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Procurement, Approval Gates & Cross-Dept Reuse</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">Multi-stage approval gates + similarity recommendations for scaling validated solutions.</p>
          </div>
        </div>

        <span className="text-xs bg-blue-50 text-blue-800 font-bold px-3 py-1.5 rounded border border-blue-200 self-start sm:self-auto">
          Governed Approval Gates Active
        </span>
      </div>

      {/* Cross-Department Reuse Engine */}
      {reuseRecs.length > 0 && (
        <div className="gov-panel p-6 space-y-4 border-l-4 border-l-emerald-700 bg-emerald-50/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-slate-900 text-base">Cross-Department Solution Reuse Recommendations</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reuseRecs.map(r => (
              <div key={r.id} className="p-4 rounded-lg bg-white border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{r.target_department_name}</span>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs">
                    {r.similarity_score}% Match
                  </span>
                </div>
                <p className="text-slate-600">{r.rationale}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Status: <strong className="text-slate-800">{r.status}</strong></span>
                  {r.status === 'Suggested' && (
                    <button onClick={() => handleActionReuse(r.id, 'Approved')} className="btn-accent text-[11px] py-1 px-3 shadow-xs">
                      Notify Target Dept
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Procurement Records & Approval Gates */}
      <div className="gov-panel p-6 space-y-6">
        <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Procurement Records & Approval Stage Sign-offs</h3>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading procurement records...</p>
        ) : (
          <div className="space-y-4">
            {procurements.map(p => {
              const existingContract = contracts.find(c => c.pilot_id === p.pilot_id);
              const pGates = approvalGates.filter(g => g.entity_id === p.id);
              const allGatesApproved = pGates.length > 0 && pGates.every(g => g.status === 'Approved');
              const isFullyApproved = allGatesApproved || p.approval_status === 'Final Approved';

              return (
                <div key={p.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{p.pilot_name}</h4>
                      <p className="text-slate-600 text-[11px]">
                        Startup: <strong className="text-slate-800">{p.startup_name}</strong> • Evidence Score: {p.evidence_score !== null && p.evidence_score !== undefined ? <strong className="text-slate-800">{p.evidence_score}%</strong> : <span className="italic text-slate-500 font-medium">Pending Audit Data</span>} • KPI Achievement: {p.kpi_achievement !== null && p.kpi_achievement !== undefined ? <strong className="text-slate-800">{p.kpi_achievement}%</strong> : <span className="italic text-slate-500 font-medium">Pending KPI Telemetry</span>}
                      </p>
                    </div>
                    <StatusBadge status={p.procurement_status} />
                  </div>

                  {/* Associated Approval Gates */}
                  <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-800">Multi-Stage Approval Gates:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {pGates.map(g => (
                        <div key={g.id} className="p-2.5 rounded bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-800 block text-xs">{g.gate_name}</span>
                            <span className="text-[10px] text-slate-500">{g.status} {g.approved_by && `by ${g.approved_by}`}</span>
                          </div>
                          {g.status === 'Pending' && canCreateContract && (
                            <button onClick={() => handleActionGate(g.id, 'Approved')} className="btn-primary text-[10px] py-1 px-2.5">
                              Sign Off
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action Row: Create Contract */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-slate-600 font-medium text-[11px]">
                      Approval Stage: <strong className="text-slate-900">{p.approval_status}</strong>
                    </span>
                    
                    {existingContract ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                        <FileText className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Contract Active (₹{(existingContract.total_value / 100000).toFixed(1)} Lakhs)</span>
                      </span>
                    ) : isFullyApproved && canCreateContract ? (
                      <button 
                        onClick={() => handleOpenContractModal(p)}
                        className="btn-accent text-[11px] py-1 px-3 shadow-xs font-bold inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Create Contract</span>
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Contract Creation Modal */}
      {contractModalProc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xl p-6 w-full max-w-lg space-y-4 shadow-xl overflow-y-auto max-h-[90vh]">
            <div className="border-b border-slate-200 pb-2 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Execute Governed Innovation Contract</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Pilot #{contractModalProc.pilot_id} • Startup #{contractModalProc.startup_id}
                </p>
              </div>
            </div>

            {contractError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{contractError}</span>
              </div>
            )}

            {contractSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span>{contractSuccess}</span>
              </div>
            )}

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Target Pilot:</span>
                <p className="font-bold text-slate-900">{contractModalProc.pilot_name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11.5px]">
                <div>
                  <span className="text-slate-500 font-medium">Startup:</span>
                  <p className="font-bold text-slate-800">{contractModalProc.startup_name}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-medium">Approval Status:</span>
                  <p className="font-bold text-emerald-800">Final Approved (Gate 1 & 2)</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitContract} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Contract Total Value (₹ INR)</label>
                <input
                  type="number"
                  required
                  step="100000"
                  value={totalValue}
                  onChange={e => setTotalValue(Number(e.target.value))}
                  className="input-field text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Contract Terms & SLA Scope</label>
                <textarea
                  rows={4}
                  required
                  value={contractTerms}
                  onChange={e => setContractTerms(e.target.value)}
                  className="input-field text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  disabled={submittingContract}
                  onClick={() => setContractModalProc(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingContract}
                  className="btn-accent text-xs flex items-center space-x-1 font-bold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{submittingContract ? 'Executing...' : 'Confirm Contract Execution'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
