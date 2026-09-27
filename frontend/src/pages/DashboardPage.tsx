import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { PaymentSLAIndicator } from '../components/PaymentSLAIndicator';
import { RiskHeatmap } from '../components/RiskHeatmap';
import { AITransparencyModal } from '../components/AITransparencyModal';
import { challengesApi, pilotsApi, paymentsApi, applicationsApi, waiversApi } from '../services/api';
import { Challenge, Pilot, PaymentMilestone, Application, EligibilityWaiver } from '../types';
import { FileText, Cpu, CreditCard, Award, Sparkles, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle, ArrowRight, Building2, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecommendedOpportunities } from '../components/RecommendedOpportunities';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [payments, setPayments] = useState<PaymentMilestone[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [waivers, setWaivers] = useState<EligibilityWaiver[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      challengesApi.getAll(),
      pilotsApi.getAll(),
      paymentsApi.getAll(),
      applicationsApi.getAll(),
      waiversApi.getAll()
    ]).then(([cData, pData, pmData, aData, wData]) => {
      setChallenges(cData);
      setPilots(pData);
      setPayments(pmData);
      setApplications(aData);
      setWaivers(wData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (!user) return null;

  const role = user.role;

  return (
    <div className="space-y-6">
      
      {/* Role Banner & Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-700 font-bold uppercase tracking-wider">
            <span>SetuStart Governed Operations Workspace</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Welcome back, {user.full_name}</h1>
          <p className="text-xs text-slate-600 mt-1">
            Role: <strong className="text-slate-800 font-semibold">{role}</strong> • Organization: <strong className="text-slate-800 font-semibold">{user.organization_id ? 'Verified Unit' : 'Independent Unit'}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsAIModalOpen(true)}
            className="btn-secondary text-xs flex items-center space-x-1.5 text-blue-700 border-blue-300 hover:bg-blue-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* Role Tailored Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {role === 'Government Department' && (
          <>
            <MetricCard title="Active Challenges" value={challenges.length} subtitle="Governed problem statements" icon={<FileText className="w-5 h-5 text-blue-700" />} color="blue" />
            <MetricCard title="Innovation Pilots" value={pilots.filter(p => p.status === 'Active').length} subtitle="Sandboxed test environments" icon={<Cpu className="w-5 h-5 text-emerald-700" />} color="emerald" />
            <MetricCard title="Waiver Requests" value={waivers.filter(w => w.status === 'Pending Review').length} subtitle="Pending rule-based review" icon={<AlertTriangle className="w-5 h-5 text-amber-700" />} color="amber" />
            <MetricCard title="Overdue Invoices" value={payments.filter(pm => pm.sla_days_overdue > 0).length} subtitle="Flagged by Payment SLA Engine" icon={<CreditCard className="w-5 h-5 text-purple-700" />} color="purple" />
          </>
        )}

        {role === 'Startup' && (
          <>
            <MetricCard title="Available Challenges" value={challenges.length} subtitle="Open for solution proposals" icon={<FileText className="w-5 h-5 text-blue-700" />} color="blue" />
            <MetricCard title="Active Sandboxes" value={pilots.filter(p => p.status === 'Active').length} subtitle="Live test environments" icon={<Cpu className="w-5 h-5 text-emerald-700" />} color="emerald" />
            <MetricCard title="Submitted Proposals" value={applications.length} subtitle="Proposals under review" icon={<Award className="w-5 h-5 text-amber-700" />} color="amber" />
            <MetricCard title="Payment Milestones" value={payments.length} subtitle="Contracted invoice tracking" icon={<CreditCard className="w-5 h-5 text-purple-700" />} color="purple" />
          </>
        )}

        {role === 'Evaluator' && (
          <>
            <MetricCard title="Proposals to Evaluate" value={applications.length} subtitle="Assigned startup proposals" icon={<Award className="w-5 h-5 text-blue-700" />} color="blue" />
            <MetricCard title="Shortlisted Proposals" value={applications.filter(a => a.status === 'Shortlisted').length} subtitle="Recommended for pilot" icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />} color="emerald" />
            <MetricCard title="Active Challenges" value={challenges.length} subtitle="Under evaluation phase" icon={<FileText className="w-5 h-5 text-amber-700" />} color="amber" />
            <MetricCard title="Pilots Under Review" value={pilots.length} subtitle="Validated solution outcomes" icon={<Cpu className="w-5 h-5 text-purple-700" />} color="purple" />
          </>
        )}

        {role === 'Independent Validator' && (
          <>
            <MetricCard title="Active Pilots for Audit" value={pilots.filter(p => p.status === 'Active').length} subtitle="Sandboxed test environments" icon={<Cpu className="w-5 h-5 text-blue-700" />} color="blue" />
            <MetricCard title="Evidence Packs" value={pilots.length} subtitle="Post-pilot evidence submissions" icon={<CheckCircle2 className="w-5 h-5 text-emerald-700" />} color="emerald" />
            <MetricCard title="Completed Audits" value={pilots.filter(p => p.status === 'Completed').length} subtitle="Independent audit reports" icon={<UserCheck className="w-5 h-5 text-amber-700" />} color="amber" />
            <MetricCard title="Risk Boundary Flags" value={pilots.filter(p => p.sandbox_constraint).length} subtitle="Enforced sandbox constraints" icon={<ShieldAlert className="w-5 h-5 text-purple-700" />} color="purple" />
          </>
        )}

        {role === 'Administrator' && (
          <>
            <MetricCard title="Total Platform Challenges" value={challenges.length} subtitle="Governed problem statements" icon={<FileText className="w-5 h-5 text-blue-700" />} color="blue" />
            <MetricCard title="Active Innovation Pilots" value={pilots.filter(p => p.status === 'Active').length} subtitle="Live sandbox deployments" icon={<Cpu className="w-5 h-5 text-emerald-700" />} color="emerald" />
            <MetricCard title="Pending Waivers" value={waivers.filter(w => w.status === 'Pending Review').length} subtitle="System rule overrides" icon={<AlertTriangle className="w-5 h-5 text-amber-700" />} color="amber" />
            <MetricCard title="Flagged Payments" value={payments.filter(pm => pm.sla_days_overdue > 0).length} subtitle="SLA violation alerts" icon={<CreditCard className="w-5 h-5 text-purple-700" />} color="purple" />
          </>
        )}
      </div>

      {/* Recommended Opportunities for Startup Role */}
      {role === 'Startup' && (
        <RecommendedOpportunities />
      )}

      {/* Role Tailored Tables & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Pilots Overview */}
        <div className={`gov-panel p-6 space-y-4 ${(role === 'Evaluator' || role === 'Independent Validator') ? 'lg:col-span-3' : 'lg:col-span-2'}`}>
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-700" />
              <span>Active Pilot Sandboxes</span>
            </h3>
            <Link to="/pilot-sandbox" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
              <span>View All Sandboxes</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500 py-6 text-center">Loading pilot environments...</p>
          ) : pilots.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No active pilots currently registered.</p>
          ) : (
            <div className="space-y-3">
              {pilots.map(p => (
                <div key={p.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{p.pilot_name}</h4>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-xs text-slate-600">
                    Startup: <strong className="text-slate-800">{p.startup_name}</strong> • Dates: {p.start_date} to {p.end_date}
                  </p>
                  {p.sandbox_constraint && (
                    <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-medium">
                      🔒 Sandbox Boundary: {p.sandbox_constraint.data_boundary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment SLA & Approvals */}
        {(role === 'Government Department' || role === 'Startup' || role === 'Administrator') && (
          <div className="gov-panel p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-700" />
                <span>Payment SLA Monitor</span>
              </h3>
              <Link to="/contracts-payments" className="text-xs font-semibold text-purple-700 hover:underline">
                Details
              </Link>
            </div>

            <div className="space-y-3">
              {payments.slice(0, 4).map(pm => (
                <div key={pm.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{pm.title}</span>
                    <span className="font-bold text-slate-900 font-mono">₹{(pm.amount/100000).toFixed(1)}L</span>
                  </div>
                  <PaymentSLAIndicator status={pm.status} slaDaysOverdue={pm.sla_days_overdue} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Systemic Risk Heatmap Component */}
      <RiskHeatmap />

      {/* AI Modal */}
      <AITransparencyModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} />

    </div>
  );
};
