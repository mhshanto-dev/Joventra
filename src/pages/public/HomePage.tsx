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
  ArrowRight, 
  Sparkles,
  Zap,
  Bookmark,
  DollarSign,
  Compass,
  CheckCircle,
  MessageSquare
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
    <div className="space-y-20 sm:space-y-32 pb-24">
      
      {/* 1. Hero Section */}
      <section className="relative pt-16 sm:pt-28 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[30rem] bg-gradient-to-tr from-brand-300/20 via-blue-200/20 to-purple-300/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold tracking-wide uppercase shadow-sm mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            The Modern Job Hunting Portal
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-[5.5rem] font-extrabold tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.05] mb-6 drop-shadow-sm">
            Land your next <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600">dream opportunity</span> with zero friction.
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Joventra connects elite software engineers, designers, and innovators with high-impact startups and verified global enterprises. No spam, no ghosting.
          </p>

          {/* Search Box Card */}
          <form 
            onSubmit={handleSearch}
            className="max-w-4xl mx-auto bg-white p-2.5 sm:p-3 rounded-2xl shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col md:flex-row items-center gap-2.5 transition-all focus-within:border-brand-500/80 focus-within:ring-4 focus-within:ring-brand-500/10"
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
              className="w-full md:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-600/30 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:-translate-y-0.5"
            >
              Search Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick filter pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-500">
            <span className="font-semibold text-slate-600 mr-1">Trending Searches:</span>
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
                className="px-3 py-1 rounded-full bg-white hover:bg-brand-50 hover:text-brand-600 transition-colors font-medium border border-slate-200/60 shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 pt-10">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by innovative teams worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Simulated company logos */}
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Vercel</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Stripe</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-1"><Zap className="w-5 h-5 fill-slate-800" /> Linear</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">OpenAI</span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Notion</span>
        </div>
      </section>

      {/* 2. Live Platform Statistics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-14 shadow-2xl shadow-slate-900/10 border border-slate-800 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-800 relative z-10">
            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-brand-400 mb-3">
                <Briefcase className="w-8 h-8" />
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">1,500+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Active Verified Jobs</p>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-blue-400 mb-3">
                <Building2 className="w-8 h-8" />
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">450+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Approved Companies</p>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-emerald-400 mb-3">
                <Users className="w-8 h-8" />
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">28k+</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Registered Seekers</p>
            </div>
            <div className="space-y-2 pt-4 sm:pt-0">
              <div className="flex items-center justify-center text-amber-400 mb-3">
                <TrendingUp className="w-8 h-8" />
              </div>
              <p className="text-4xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm">99.4%</p>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">Placement Success</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Joventra Works
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg">
            We've simplified the recruitment pipeline so you can focus on what matters: finding the perfect fit.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-12 -z-10" />

          {[
            { step: '01', title: 'Create a Profile', desc: 'Sign up in seconds. Upload your resume and let our system automatically parse your skills.' },
            { step: '02', title: 'Discover Matches', desc: 'Browse curated roles from verified employers with upfront salary data and requirements.' },
            { step: '03', title: 'Apply & Track', desc: 'Apply with one click. Use our Kanban dashboard to track interview stages and offers.' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-xl mb-6 shadow-md shadow-slate-900/20 group-hover:bg-brand-600 transition-colors">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-slate-50 rounded-[3rem] p-10 sm:p-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 fill-brand-600" /> Hand-picked Listings
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Opportunities
            </h2>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-700 hover:text-brand-600 hover:border-brand-200 transition-all group"
          >
            Explore all jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-white rounded-3xl animate-pulse shadow-sm"></div>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" /> Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need in a modern job search
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Smart Search</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Find matching roles instantly with smart keyword discovery, category filters, and workplace preferences.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Salary Insights</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Transparent, upfront compensation ranges for all job postings so you never waste time on lowball offers.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Top Companies</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Direct access to approved companies from AI, Fintech, Developer Tools, and high-growth sectors.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 hover:border-brand-500/40 hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Bookmark className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Saved Jobs Tracker</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bookmark favorite listings with one click and track status changes directly from your personal dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-slate-900 rounded-[3rem] p-10 sm:p-20 text-center relative overflow-hidden">
          <MessageSquare className="w-24 h-24 text-slate-800 absolute top-10 left-10 -rotate-12 opacity-50" />
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="flex justify-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => <Sparkles key={i} className="w-5 h-5 fill-amber-400" />)}
            </div>
            <h3 className="text-2xl sm:text-4xl font-semibold text-white leading-snug">
              "Joventra completely transformed how we hire. We scaled our engineering team from 10 to 50 in three months without ever dealing with spam applications."
            </h3>
            <div>
              <p className="text-brand-400 font-bold text-lg">Sarah Jenkins</p>
              <p className="text-slate-400 text-sm">VP of Talent, TechCorp Inc.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Employer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-800 text-white p-10 sm:p-20 overflow-hidden shadow-2xl shadow-brand-700/30 border border-brand-500/30">
          
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-white/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md uppercase tracking-wider border border-white/20">
              <Building2 className="w-4 h-4" /> For Recruiters & Founders
            </span>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Scale your team with top tier talent today.
            </h2>
            <p className="text-brand-100 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
              Post up to 3 active jobs completely free. Upgrade anytime to Growth or Enterprise for advanced candidate analytics and unlimited slots.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-brand-700 font-extrabold text-base shadow-xl hover:bg-brand-50 hover:scale-[1.02] transition-all flex justify-center"
              >
                Post a Job for Free
              </Link>
              <Link
                to="/pricing"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-800/60 hover:bg-brand-800 text-white font-bold text-base border border-white/20 transition-all flex justify-center"
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
