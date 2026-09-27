import React, { useEffect, useState } from 'react';
import { auditApi } from '../services/api';
import { AuditLog } from '../types';
import { History, ShieldCheck } from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    auditApi.getLogs().then(data => {
      setLogs(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-blue-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-700 border border-blue-200">
            <History className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Public Sector Accountability</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>System Audit Trail Ledger</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">Immutable audit record of all challenge creations, evaluations, waivers, payments, and approvals.</p>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Audited Audit Log</span>
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="gov-panel p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">System Activity Audit Log</h3>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading audit events...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Actor / Role</th>
                  <th className="p-3">Entity Reference</th>
                  <th className="p-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-500 font-sans text-xs">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="p-3 font-bold text-blue-700 font-sans text-xs">{log.action}</td>
                    <td className="p-3 text-slate-800 font-sans text-xs">{log.user_role || 'SYSTEM'} (ID: {log.user_id || 'sys'})</td>
                    <td className="p-3 text-slate-600">{log.entity_type} #{log.entity_id}</td>
                    <td className="p-3 text-slate-800 font-sans text-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
