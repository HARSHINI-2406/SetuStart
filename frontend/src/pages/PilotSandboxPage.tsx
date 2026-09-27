import React, { useEffect, useState } from 'react';
import { pilotsApi } from '../services/api';
import { Pilot } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { Cpu, ShieldCheck, Plus, Calendar } from 'lucide-react';

export const PilotSandboxPage: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [selectedPilotId, setSelectedPilotId] = useState<number | null>(null);
  const [pilotDetail, setPilotDetail] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // New Milestone Form
  const [msName, setMsName] = useState<string>('');
  const [msDesc, setMsDesc] = useState<string>('');
  const [msDueDate, setMsDueDate] = useState<string>('2026-09-30');

  useEffect(() => {
    pilotsApi.getAll().then(data => {
      setPilots(data);
      if (data.length > 0) setSelectedPilotId(data[0].id);
      setLoading(false);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedPilotId) {
      pilotsApi.getById(selectedPilotId).then(setPilotDetail).catch(console.error);
    }
  }, [selectedPilotId]);

  const handleUpdateMilestone = async (msId: number, statusStr: string, pct: number) => {
    await pilotsApi.updateMilestoneStatus(msId, statusStr, pct);
    pilotsApi.getById(selectedPilotId!).then(setPilotDetail);
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPilotId) return;
    await pilotsApi.addMilestone(selectedPilotId, { name: msName, description: msDesc, due_date: msDueDate });
    setMsName(''); setMsDesc('');
    pilotsApi.getById(selectedPilotId).then(setPilotDetail);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="gov-panel p-6 border-l-4 border-l-emerald-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Governed Pilot Environment</span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-700" />
            <span>Regulatory Pilot Sandbox</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1">Controlled testing environment with explicit data boundaries & SLA tracking.</p>
        </div>

        <select 
          value={selectedPilotId || ''} 
          onChange={e => setSelectedPilotId(Number(e.target.value))}
          className="select-field text-xs sm:w-64"
        >
          {pilots.map(p => <option key={p.id} value={p.id}>{p.pilot_name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500 text-xs">Loading pilot sandbox details...</div>
      ) : pilotDetail && (
        <div className="space-y-6">
          
          {/* Regulatory Sandbox Constraint Card */}
          {pilotDetail.sandbox_constraint && (
            <div className="gov-panel p-5 space-y-3 border-l-4 border-l-amber-500 bg-amber-50/40">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Regulatory Sandbox Constraint Framework</span>
                </h3>
                <span className="text-xs text-slate-600 font-medium">Reviewed by: {pilotDetail.sandbox_constraint.reviewed_by}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Data Boundary:</span>
                  <p className="text-slate-600">{pilotDetail.sandbox_constraint.data_boundary}</p>
                </div>
                <div className="p-3 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Permitted Environment:</span>
                  <p className="text-slate-600">{pilotDetail.sandbox_constraint.permitted_environment}</p>
                </div>
                <div className="p-3 rounded bg-white border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Compliance Notes:</span>
                  <p className="text-slate-600">{pilotDetail.sandbox_constraint.compliance_notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Milestones & KPIs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Pilot Milestones */}
            <div className="gov-panel p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Pilot Milestones & SLA</h3>
              <div className="space-y-3">
                {pilotDetail.milestones?.map((ms: any) => (
                  <div key={ms.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{ms.name}</span>
                      <StatusBadge status={ms.status} />
                    </div>
                    <p className="text-slate-600 text-[11px]">{ms.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-mono text-[11px]">Due: {ms.due_date}</span>
                      <div className="flex items-center space-x-1">
                        <button onClick={() => handleUpdateMilestone(ms.id, 'In Progress', 50)} className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold text-[10px]">In Progress</button>
                        <button onClick={() => handleUpdateMilestone(ms.id, 'Completed', 100)} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-semibold text-[10px]">Complete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Milestone Form */}
              <form onSubmit={handleAddMilestone} className="pt-4 border-t border-slate-200 space-y-2 text-xs">
                <p className="font-bold text-slate-800">Add New Milestone</p>
                <input type="text" value={msName} onChange={e => setMsName(e.target.value)} placeholder="New Milestone Name" className="input-field text-xs" required />
                <input type="text" value={msDesc} onChange={e => setMsDesc(e.target.value)} placeholder="Milestone Description" className="input-field text-xs" required />
                <button type="submit" className="btn-secondary text-xs w-full flex items-center justify-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Milestone</span>
                </button>
              </form>
            </div>

            {/* KPIs */}
            <div className="gov-panel p-6 space-y-4">
              <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Live Pilot KPIs</h3>
              <div className="space-y-3">
                {pilotDetail.kpis?.map((kpi: any) => (
                  <div key={kpi.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{kpi.name}</span>
                      <StatusBadge status={kpi.status} />
                    </div>
                    <p className="text-slate-600 text-xs">
                      Current: <strong className="text-emerald-700 font-extrabold">{kpi.current_value} {kpi.unit}</strong> / Target: {kpi.target_value} {kpi.unit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Cross Pilot Risk Heatmap */}
      <RiskHeatmap />

    </div>
  );
};
