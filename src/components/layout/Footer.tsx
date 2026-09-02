import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, Globe, Mail, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 dark:border-slate-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Joven<span className="text-brand-400">tra</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              The modern hiring intelligence platform connecting ambitious talent with hyper-growth companies worldwide. Smart search, verified recruiters, and transparent workflows.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/60 text-brand-300 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 text-brand-400" /> Verified Companies
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
                <Globe className="w-3.5 h-3.5 text-emerald-400" /> Global Opportunities
              </span>
            </div>
          </div>

          {/* Column 1: For Job Seekers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/jobs" className="hover:text-brand-400 transition-colors">Browse Remote Jobs</Link></li>
              <li><Link to="/jobs?category=Technology+%26+Engineering" className="hover:text-brand-400 transition-colors">Tech & Engineering</Link></li>
              <li><Link to="/companies" className="hover:text-brand-400 transition-colors">Explore Companies</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Seeker Pro Plans</Link></li>
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Create Free Profile</Link></li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-brand-400 transition-colors">Post a Job (Free 3 Posts)</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Recruiter Subscriptions</Link></li>
              <li><Link to="/companies" className="hover:text-brand-400 transition-colors">Company Directory</Link></li>
              <li><Link to="/login" className="hover:text-brand-400 transition-colors">Recruiter Portal</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Enterprise Solutions</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/pricing" className="hover:text-brand-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/jobs" className="hover:text-brand-400 transition-colors">Salary Insights</Link></li>
              <li><Link to="/" className="hover:text-brand-400 transition-colors">System Security</Link></li>
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Joventra. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for the modern workforce.
          </p>
        </div>
      </div>
    </footer>
  );
};
