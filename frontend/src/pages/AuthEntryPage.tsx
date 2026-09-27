import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogIn, UserPlus, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export const AuthEntryPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const fromLocation = location.state?.from;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-950 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  // If already logged in, redirect directly to intended target or challenges page
  if (isAuthenticated) {
    const getTargetPath = (from: any): string => {
      if (!from) return '/challenges';
      if (typeof from === 'string') return from;
      if (typeof from === 'object' && from.pathname) {
        return from.pathname + (from.search || '') + (from.hash || '');
      }
      return '/challenges';
    };
    const targetPath = getTargetPath(fromLocation);
    return <Navigate to={targetPath} replace />;
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl space-y-6">
        
        {/* Gateway Card Header */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-900 border border-blue-700 mx-auto flex items-center justify-center text-white shadow-sm">
            <ShieldCheck className="w-8 h-8 text-blue-200" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Access SetuStart Opportunities
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Sign in to explore government innovation challenges, discover relevant opportunities, and participate in the SetuStart ecosystem.
          </p>
        </div>

        {/* Main Selection Box */}
        <div className="gov-panel p-6 sm:p-8 space-y-6 bg-white shadow-md border border-slate-200 rounded-xl">
          
          <div className="space-y-4">
            {/* Option 1: Sign In */}
            <Link
              to="/login"
              state={{ from: fromLocation }}
              className="btn-primary w-full py-3.5 px-6 text-sm font-bold flex items-center justify-between group shadow-sm transition-all"
            >
              <div className="flex items-center space-x-3">
                <LogIn className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
                <span>Already registered? Sign In</span>
              </div>
              <span className="text-xs bg-blue-800/60 text-blue-100 py-1 px-2.5 rounded font-semibold">
                Sign In &rarr;
              </span>
            </Link>

            {/* Option 2: Create Account */}
            <Link
              to="/register"
              state={{ from: fromLocation }}
              className="btn-secondary w-full py-3.5 px-6 text-sm font-bold flex items-center justify-between group shadow-sm transition-all"
            >
              <div className="flex items-center space-x-3">
                <UserPlus className="w-5 h-5 text-slate-600 group-hover:scale-110 transition-transform" />
                <span>New to SetuStart? Create Account</span>
              </div>
              <span className="text-xs bg-slate-200 text-slate-700 py-1 px-2.5 rounded font-semibold">
                Register &rarr;
              </span>
            </Link>
          </div>

          {/* Key Benefits / Ecosystem Trust Markers */}
          <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start space-x-2 text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs font-medium">Verified Sector Challenges</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-xs font-medium">Direct Government Procurement</span>
            </div>
            <div className="flex items-start space-x-2 text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span className="text-xs font-medium">AI Matchmaking & Sandbox</span>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            &larr; Return to SetuStart Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AuthEntryPage;
