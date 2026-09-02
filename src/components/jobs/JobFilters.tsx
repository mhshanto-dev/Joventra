import React from 'react';
import { JOB_CATEGORIES, JOB_TYPES } from '../../../../Joventra/src/constants/statuses';
import { Filter, RotateCcw, DollarSign, MapPin, Briefcase, Globe } from 'lucide-react';

interface JobFiltersProps {
  category: string;
  setCategory: (val: string) => void;
  jobType: string;
  setJobType: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
  minSalary: string;
  setMinSalary: (val: string) => void;
  isRemote: boolean;
  setIsRemote: (val: boolean) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'All',
  'Technology & Engineering',
  'Design & Creative',
  'Sales & Marketing',
  'Finance & Accounting',
  'Customer Support',
  'Product & Operations',
  'Human Resources',
  'Healthcare'
];

const TYPES = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

export const JobFilters: React.FC<JobFiltersProps> = ({
  category,
  setCategory,
  jobType,
  setJobType,
  location,
  setLocation,
  minSalary,
  setMinSalary,
  isRemote,
  setIsRemote,
  onReset,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-6 shadow-sm sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
          <Filter className="w-4 h-4 text-brand-600" />
          Filter Jobs
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Remote Only Toggle */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Globe className="w-4 h-4 text-emerald-500" />
          Remote Only
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isRemote}
            onChange={(e) => setIsRemote(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600"></div>
        </label>
      </div>

      {/* Category Select */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          Job Category
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full text-sm py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Job Type
        </label>
        <div className="space-y-1.5">
          {TYPES.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2.5 text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <input
                type="radio"
                name="jobType"
                value={type}
                checked={jobType === type}
                onChange={(e) => setJobType(e.target.value)}
                className="text-brand-600 focus:ring-brand-500 h-3.5 w-3.5"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          Location
        </label>
        <input
          type="text"
          placeholder="e.g. San Francisco, London"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-sm py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      {/* Minimum Annual Salary */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-slate-400" />
          Minimum Salary (USD/yr)
        </label>
        <select
          value={minSalary}
          onChange={(e) => setMinSalary(e.target.value)}
          className="w-full text-sm py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          <option value="">Any Salary</option>
          <option value="50000">$50,000+ / year</option>
          <option value="80000">$80,000+ / year</option>
          <option value="100000">$100,000+ / year</option>
          <option value="130000">$130,000+ / year</option>
          <option value="160000">$160,000+ / year</option>
        </select>
      </div>

    </div>
  );
};
