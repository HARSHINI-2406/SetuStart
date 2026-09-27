import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { ShieldCheck, LogIn, Lock, Mail, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from;

  const roleOptions: UserRole[] = [
    'Government Department',
    'Startup',
    'Evaluator',
    'Independent Validator'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Please select your role.');
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.login({ email, password });
      // Store token temporarily to fetch user profile for role comparison
      localStorage.setItem('setustart_token', data.access_token);
      const user = await authApi.getMe();

      // Verify selected role against actual authenticated user role
      if (user.role !== selectedRole) {
        localStorage.removeItem('setustart_token');
        setError(`Selected role does not match this account. Please select ${user.role}.`);
        setLoading(false);
        return;
      }

      login(data.access_token, user);
      
      const getTargetPath = (from: any): string => {
        if (!from) return '/challenges';
        if (typeof from === 'string') return from;
        if (typeof from === 'object' && from.pathname) {
          return from.pathname + (from.search || '') + (from.hash || '');
        }
        return '/challenges';
      };
      
      const targetPath = getTargetPath(fromLocation);
      console.log("[DEBUG LOGIN] fromLocation:", JSON.stringify(fromLocation), "targetPath:", targetPath);
      (window as any).__LAST_TARGET_PATH__ = targetPath;
      navigate(targetPath, { replace: true });
    } catch (err: any) {
      localStorage.removeItem('setustart_token');
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-900 border border-blue-700 mx-auto flex items-center justify-center text-white shadow-xs">
            <ShieldCheck className="w-7 h-7 text-blue-200" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sign in to explore opportunities</h1>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            Access government innovation challenges, discover relevant opportunities, and participate in the SetuStart ecosystem.
          </p>
        </div>

        <div className="gov-panel p-6 space-y-4">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* 1. Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Authorized Email Address
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 shrink-0" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-field h-10 text-xs w-full" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="name@organization.gov.in"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* 2. Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 shrink-0" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field h-10 text-xs w-full" 
                  style={{ paddingLeft: '40px' }}
                  placeholder="Enter account password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* 3. Select Role Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Your Role
              </label>
              <select 
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value)}
                className="select-field h-10 text-xs w-full cursor-pointer"
                required
              >
                <option value="" disabled>Select your role</option>
                {roleOptions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* 4. Sign In Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full h-10 py-2.5 text-xs font-bold flex items-center justify-center space-x-2 shadow-xs mt-2"
            >
              {loading ? <span>Signing In...</span> : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

        </div>

        <p className="text-center text-xs text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            state={{ from: fromLocation }}
            className="text-blue-700 hover:underline font-bold"
          >
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
};