import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 animate-fade-in">
        
        {/* Visual Icon */}
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight block">
            404
          </span>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page you are looking for may have been moved, renamed, or no longer exists.
          </p>
        </div>

        {/* Action buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5 transition-all"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            to="/jobs"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Jobs
          </Link>
        </div>

      </div>
    </div>
  );
};
