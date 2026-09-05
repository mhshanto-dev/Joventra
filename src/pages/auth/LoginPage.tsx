import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { Briefcase, Lock, Mail, ArrowRight, Eye, EyeOff, ShieldCheck, Copy, CheckCheck } from 'lucide-react';

// Google SVG icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showAdminCreds, setShowAdminCreds] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter your email and password');
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}! 🎉`);
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(`/dashboard/${user.role}`, { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Build the backend base URL by stripping /api from VITE_API_URL
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverBase = apiBase.replace(/\/api\/?$/, '');
    window.location.href = `${serverBase}/api/auth/google`;
  };

  const handleLogoClick = () => {
    const next = adminClickCount + 1;
    setAdminClickCount(next);
    if (next >= 5) {
      setShowAdminCreds(prev => !prev);
      setAdminClickCount(0);
    }
  };

  const demoAccounts = [
    { role: 'Seeker', email: 'alex@example.com', password: 'password123', color: 'emerald' },
    { role: 'Recruiter', email: 'sarah@techcorp.io', password: 'password123', color: 'purple' },
  ];

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    // Auto-submit the login form with the demo credentials
    try {
      setIsLoading(true);
      const response = await apiClient.post('/auth/login', { email: demoEmail, password: demoPass });
      if (response.data.success) {
        const { token, user } = response.data.data;
        setAuth(user, token);
        toast.success(`Welcome back, ${user.name}! 🎉`);
        const from = (location.state as any)?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(`/dashboard/${user.role}`, { replace: true });
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Demo login failed. Please try manually.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/30">

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 cursor-pointer select-none"
              onClick={handleLogoClick}
            >
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              <span className="text-slate-900 dark:text-white">Joven</span>
              <span className="text-brand-600 dark:text-brand-400">tra</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight pt-1">
            Welcome back
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to access your applications, jobs, or admin console
          </p>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-all shadow-sm"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-700" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 font-medium">or sign in with email</span>
          </div>
        </div>

        {/* Demo Accounts Panel */}
        <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Demo Accounts — Click "Use" to fill form
            </p>
          </div>
          <div className="p-3 space-y-2">
            {demoAccounts.map((acc) => (
              <div
                key={acc.role}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-3 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${
                    acc.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'
                  }`}>{acc.role}</p>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate">{acc.email}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{acc.password}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${acc.email} / ${acc.password}`, acc.role)}
                      className="p-0.5 rounded text-slate-400 hover:text-brand-500 transition-colors"
                      title="Copy credentials"
                    >
                      {copied === acc.role ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors"
                >
                  Use
                </button>
              </div>
            ))}

            {/* Secret Admin Credentials — only shown after 5 logo clicks */}
            {showAdminCreds && (
              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800 p-3 flex items-center justify-between gap-3 animate-fade-in">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Admin</p>
                    <span className="text-[9px] bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded-full font-bold">PRIVATE</span>
                  </div>
                  <p className="text-xs font-mono text-slate-700 dark:text-slate-200 truncate">admin@joventra.com</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs font-mono text-slate-500 dark:text-slate-400">admin123</p>
                    <button
                      type="button"
                      onClick={() => handleCopy('admin@joventra.com / admin123', 'admin')}
                      className="p-0.5 rounded text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      {copied === 'admin' ? <CheckCheck className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { handleQuickLogin('admin@joventra.com', 'admin123'); setShowAdminCreds(false); }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                >
                  Use
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm pl-10 pr-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-10 pr-11 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 dark:focus:border-brand-400 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Register for Free
          </Link>
        </div>

      </div>
    </div>
  );
};
