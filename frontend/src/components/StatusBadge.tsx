import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'challenge' | 'pilot' | 'payment' | 'validation' | 'procurement' | 'waiver';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Published':
      case 'Active':
      case 'Validated':
      case 'Approved':
      case 'Paid':
      case 'Scaled':
      case 'Achieved':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
      
      case 'Under Evaluation':
      case 'In Progress':
      case 'Shortlisted':
      case 'Invoiced':
      case 'Recommended':
      case 'Pending Review':
      case 'On Track':
        return 'bg-blue-50 text-blue-800 border-blue-300 font-bold';

      case 'Draft':
      case 'Not Started':
      case 'Pending':
      case 'Under Review':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';

      case 'Partially Validated':
      case 'At Risk':
      case 'Delayed':
        return 'bg-orange-50 text-orange-800 border-orange-300 font-bold';

      case 'Rejected':
      case 'Cancelled':
      case 'Non-Compliant':
      case 'Disputed':
        return 'bg-red-50 text-red-800 border-red-300 font-bold';

      default:
        return 'bg-slate-100 text-slate-800 border-slate-300 font-medium';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {status}
    </span>
  );
};
