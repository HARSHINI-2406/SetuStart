import React from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface PaymentSLAIndicatorProps {
  status: string;
  slaDaysOverdue: number;
}

export const PaymentSLAIndicator: React.FC<PaymentSLAIndicatorProps> = ({ status, slaDaysOverdue }) => {
  if (status === 'Paid') {
    return (
      <span className="inline-flex items-center text-xs text-emerald-400 font-semibold gap-1">
        <CheckCircle2 className="w-4 h-4" />
        <span>Paid (SLA Met)</span>
      </span>
    );
  }

  if (status === 'Invoiced' && slaDaysOverdue > 0) {
    return (
      <span className="inline-flex items-center text-xs text-red-400 font-semibold px-2 py-0.5 rounded bg-red-950/60 border border-red-800 animate-pulse gap-1">
        <AlertCircle className="w-4 h-4 text-red-400" />
        <span>Overdue by {slaDaysOverdue} Day(s)</span>
      </span>
    );
  }

  if (status === 'Invoiced') {
    return (
      <span className="inline-flex items-center text-xs text-amber-400 font-medium gap-1">
        <Clock className="w-4 h-4 text-amber-400" />
        <span>Invoiced (Within 7-Day SLA)</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center text-xs text-slate-400 gap-1">
      <Clock className="w-3.5 h-3.5" />
      <span>Pending Invoice</span>
    </span>
  );
};
