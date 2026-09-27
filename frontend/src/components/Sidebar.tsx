import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, FileText, Compass, Award, Cpu, FileCheck, 
  CreditCard, ShieldAlert, History, Bell, Settings, UserCheck, Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  const getNavItems = () => {
    const role = user.role;

    if (role === 'Government Department') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Government Challenges', path: '/challenges', icon: FileText },
        { name: 'Challenge Studio', path: '/challenge-studio', icon: Compass },
        { name: 'Submitted Applications', path: '/procurement-scale', icon: UserCheck },
        { name: 'Pilot Sandbox', path: '/pilot-sandbox', icon: Cpu },
        { name: 'Contracts & Payments', path: '/contracts-payments', icon: CreditCard },
        { name: 'Audit Trail', path: '/audit-trail', icon: History },
      ];
    }

    if (role === 'Startup') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Government Challenges', path: '/challenges', icon: FileText },
        { name: 'Demand Radar', path: '/demand-radar', icon: Sparkles },
        { name: 'Startup Profile', path: '/startup-profile', icon: Settings },
        { name: 'Pilot Sandbox', path: '/pilot-sandbox', icon: Cpu },
        { name: 'Invoices & Payments', path: '/contracts-payments', icon: CreditCard },
        { name: 'Evidence Submission', path: '/evidence-validation', icon: FileCheck },
      ];
    }

    if (role === 'Evaluator') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Assigned Evaluations', path: '/evaluation-workspace', icon: Award },
        { name: 'Pilot Results', path: '/pilot-sandbox', icon: Cpu },
      ];
    }

    if (role === 'Independent Validator') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Assigned Validations', path: '/evidence-validation', icon: FileCheck },
        { name: 'Pilot Sandbox', path: '/pilot-sandbox', icon: Cpu },
      ];
    }

    // Administrator
    return [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'User & Role Oversight', path: '/audit-trail', icon: ShieldAlert },
      { name: 'Audit Logs', path: '/audit-trail', icon: History },
      { name: 'System Monitoring', path: '/pilot-sandbox', icon: Cpu },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        
        {/* User Role Badge */}
        <div className="p-3 bg-slate-850 rounded-lg border border-slate-800">
          <p className="text-xs text-slate-400 font-medium">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
          <span className="inline-block mt-1 px-2 py-0.5 text-[11px] font-medium bg-blue-900/60 text-blue-300 rounded border border-blue-700/40">
            {user.role}
          </span>
        </div>

        {/* Sidebar Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Footer Branding */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
        <p className="font-semibold text-slate-400">SetuStart Platform</p>
        <p>Governed Innovation Procurement</p>
      </div>
    </aside>
  );
};
