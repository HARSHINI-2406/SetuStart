import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UtilityBar } from './UtilityBar';
import { PublicHeader } from './PublicHeader';
import { 
  LayoutDashboard, FileText, Compass, UserCheck, Cpu, CreditCard, History, 
  Sparkles, Settings, FileCheck, Award, ShieldAlert
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getRoleNavItems = () => {
    if (!user) return [];
    const role = user.role;

    if (role === 'Government Department') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Government Challenges', path: '/challenges', icon: FileText },
        { name: 'Challenge Studio', path: '/challenge-studio', icon: Compass },
        { name: 'Applications & Scale', path: '/procurement-scale', icon: UserCheck },
        { name: 'Pilot Sandbox', path: '/pilot-sandbox', icon: Cpu },
        { name: 'Contracts & Payments', path: '/contracts-payments', icon: CreditCard },
        { name: 'Audit Trail', path: '/audit-trail', icon: History },
      ];
    }

    if (role === 'Startup') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Opportunities', path: '/challenges', icon: FileText },
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
        { name: 'Evaluation Queue', path: '/evaluation-workspace', icon: Award },
        { name: 'Pilot Results', path: '/pilot-sandbox', icon: Cpu },
      ];
    }

    if (role === 'Independent Validator') {
      return [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Validation Queue', path: '/evidence-validation', icon: FileCheck },
        { name: 'Pilot Evidence', path: '/pilot-sandbox', icon: Cpu },
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

  const roleNavItems = getRoleNavItems();
  const isWorkspaceRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/pilot-sandbox') ||
                           location.pathname.startsWith('/challenge-studio') ||
                           location.pathname.startsWith('/demand-radar') ||
                           location.pathname.startsWith('/evaluation-workspace') ||
                           location.pathname.startsWith('/evidence-validation') ||
                           location.pathname.startsWith('/contracts-payments') ||
                           location.pathname.startsWith('/procurement-scale') ||
                           location.pathname.startsWith('/audit-trail');

  return (
    <div className="w-full">
      {/* 1. COMPACT DARK NAVY UTILITY BAR */}
      <UtilityBar />

      {/* 2. WHITE PRIMARY HEADER */}
      <PublicHeader />

      {/* 3. SECONDARY HORIZONTAL WORKSPACE ROLE NAVIGATION (FOR AUTHENTICATED WORKSPACE ROUTES) */}
      {isAuthenticated && isWorkspaceRoute && roleNavItems.length > 0 && (
        <div className="bg-[#F8FAFC] border-b border-[#DCE6F2] shadow-2xs">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center space-x-1 overflow-x-auto py-1.5 scrollbar-none">
              <span className="text-[11px] font-bold text-[#0F2A56] uppercase tracking-wider pr-3 py-1.5 border-r border-[#DCE6F2] shrink-0 hidden sm:inline">
                {user?.role} Workspace
              </span>
              {roleNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                      active 
                        ? 'bg-[#146EF5] text-white shadow-2xs' 
                        : 'text-slate-700 hover:bg-white hover:text-[#146EF5]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
