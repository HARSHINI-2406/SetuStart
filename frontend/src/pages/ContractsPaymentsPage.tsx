import React, { useEffect, useState } from 'react';
import { paymentsApi } from '../services/api';
import { PaymentMilestone } from '../types';
import { PaymentSLAIndicator } from '../components/PaymentSLAIndicator';
import { CreditCard } from 'lucide-react';

export const ContractsPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentMilestone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPayments = () => {
    paymentsApi.getAll().then(data => {
      setPayments(data);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRaiseInvoice = async (id: number) => {
    await paymentsApi.raiseInvoice(id);
    fetchPayments();
  };

  const handleApprovePayment = async (id: number) => {
    await paymentsApi.approveAndPay(id);
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="gov-panel p-6 border-l-4 border-l-purple-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-purple-50 rounded-lg text-purple-700 border border-purple-200">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Governed Milestone Payments</span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-center gap-2">
              <span>Contracts & Payment SLA Monitor</span>
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">Automated Payment SLA tracking with 7-day escalation triggers.</p>
          </div>
        </div>

        <span className="text-xs bg-purple-50 text-purple-800 font-bold px-3 py-1.5 rounded border border-purple-200 self-start sm:self-auto">
          Payment SLA Escrow: Active
        </span>
      </div>

      {/* Invoices Table */}
      <div className="gov-panel p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-base pb-2 border-b border-slate-200">Milestone Tranches & Invoice Status</h3>

        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading payment records...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Tranche Title</th>
                  <th className="p-3">Contract Amount</th>
                  <th className="p-3">Due Condition</th>
                  <th className="p-3">Status & SLA Flag</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {payments.map(pm => (
                  <tr key={pm.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{pm.title}</td>
                    <td className="p-3 font-extrabold text-emerald-700 font-mono">₹{(pm.amount/100000).toFixed(1)} Lakhs</td>
                    <td className="p-3 text-slate-600 text-[11.5px] max-w-xs truncate">{pm.due_condition}</td>
                    <td className="p-3">
                      <PaymentSLAIndicator status={pm.status} slaDaysOverdue={pm.sla_days_overdue} />
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {pm.status === 'Pending' && (
                        <button 
                          onClick={() => handleRaiseInvoice(pm.id)}
                          className="btn-secondary text-[11px] py-1 px-3"
                        >
                          Raise Invoice
                        </button>
                      )}
                      {pm.status === 'Invoiced' && (
                        <button 
                          onClick={() => handleApprovePayment(pm.id)}
                          className="btn-accent text-[11px] py-1 px-3 shadow-xs"
                        >
                          Approve & Pay
                        </button>
                      )}
                      {pm.status === 'Paid' && (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Paid & Disbursed</span>
                      )}
                    </td>
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
