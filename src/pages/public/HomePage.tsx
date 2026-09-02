import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../lib/api-client';
import { Job } from '../../types';
import { JobCard } from '../../components/jobs/JobCard';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Zap,
  Bookmark,
  DollarSign,
  Compass
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const { data: featuredJobs = [], isLoading } = useQuery<Job[]>({
    queryKey: ['featured-jobs'],
    queryFn: async () => {
      const response = await apiClient.get('/jobs/featured');
      return response.data.data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.append('search', keyword.trim());
    if (location.trim()) params.append('location', location.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  const quickTags = ['Remote', 'Engineering', 'Fintech', 'Design', 'AI', 'Marketing'];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-300/20 via-blue-200/20 to-purple-300/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Super title pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold tracking-wide uppercase shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            The Modern Job Hunting Portal
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1] mb-6">
            Land your next <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">dream opportunity</span> with zero friction.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            HireLoop connects elite software engineers, designers, and innovators with high-impact startups and verified global enterprises.
          </p>

          {/* Search Box Card */}
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 flex flex-col md:flex-row items-center gap-2.5 transition-all focus-within:border-brand-500/80 focus-within:ring-4 focus-within:ring-brand-500/10"
          >
            <div className="flex items-center gap-3 px-3.5 py-2 w-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full text-sm sm:text-base outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3 px-3.5 py-2 w-full md:w-5/12">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="City, country, or 'Remote'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm sm:text-base outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02]"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 mr-1">Popular:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  if (tag === 'Remote') {
                    navigate('/jobs?isRemote=true');
                  } else {
                    navigate(`/jobs?search=${tag}`);
                  }
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-brand-50 hover:text-brand-600 transition-colors font-medium border border-slate-200/60"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 2. Live Platform Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-900/10 border border-slate-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            
            <div className="space-y-1.5 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-brand-400 mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">1,500+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Active Verified Jobs</p>
            </div>

            <div className="space-y-1.5 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-blue-400 mb-2">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">450+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Approved Companies</p>
            </div>

            <div className="space-y-1.5 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-emerald-400 mb-2">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">28,000+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Registered Job Hunters</p>
            </div>

            <div className="space-y-1.5 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-amber-400 mb-2">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">99.4%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Satisfaction Rate</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
              <Zap className="w-3.5 h-3.5 fill-brand-600" /> Hand-picked Listings
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            Explore all jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-slate-200/70 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id || job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Platform Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" /> Built for speed & transparency
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need in a modern job search
          </h2>
          <p className="text-slate-600 mt-3 text-base sm:text-lg">
            Say goodbye to endless spam and ghosting. HireLoop puts candidates and hiring teams on the same page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-brand-500/40 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Smart Search</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find matching roles instantly with smart keyword discovery, category filters, and workplace preferences.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-brand-500/40 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Salary Insights</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent, upfront compensation ranges for all job postings so you never waste time on lowball offers.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-brand-500/40 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Top Companies</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Direct access to approved companies from AI, Fintech, Developer Tools, and high-growth sectors.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 hover:border-brand-500/40 hover:shadow-lg transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Saved Jobs Tracker</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bookmark favorite listings with one click and track status changes directly from your personal dashboard.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Employer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-brand-700 via-brand-600 to-indigo-700 text-white p-8 sm:p-14 overflow-hidden shadow-xl shadow-brand-700/20">
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-brand-200" /> For Recruiters & Founders
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Scale your team with top tier talent today.
            </h2>
            <p className="text-brand-100 text-base sm:text-lg">
              Post up to 3 active jobs completely free. Upgrade anytime to Growth or Enterprise for advanced candidate analytics.
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="px-6 py-3.5 rounded-xl bg-white text-brand-700 font-extrabold text-sm shadow-lg hover:bg-brand-50 transition-all"
              >
                Post a Job for Free
              </Link>
              <Link
                to="/pricing"
                className="px-6 py-3.5 rounded-xl bg-brand-800/60 hover:bg-brand-800 text-white font-bold text-sm border border-white/20 transition-all"
              >
                View Recruiter Plans
              </Link>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
