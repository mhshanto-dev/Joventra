import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  Briefcase,
  Building2,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  PlusCircle,
  Users,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Search,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  LayoutDashboard
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'seeker':
        return [
          { name: 'Dashboard Overview', path: '/dashboard/seeker', icon: LayoutDashboard, end: true },
          { name: 'Browse & Apply', path: '/dashboard/seeker/jobs', icon: Search },
          { name: 'Saved Bookmarks', path: '/dashboard/seeker/saved', icon: Bookmark },
          { name: 'My Applications', path: '/dashboard/seeker/applications', icon: FileText },
          { name: 'Billing & Plan', path: '/dashboard/seeker/billing', icon: CreditCard },
          { name: 'Profile Settings', path: '/dashboard/seeker/settings', icon: Settings },
        ];
      case 'recruiter':
        return [
          { name: 'Recruiter Home', path: '/dashboard/recruiter', icon: LayoutDashboard, end: true },
          { name: 'My Company', path: '/dashboard/recruiter/company', icon: Building2 },
          { name: 'Manage Jobs', path: '/dashboard/recruiter/jobs', icon: Briefcase },
          { name: 'Post a New Job', path: '/dashboard/recruiter/jobs/new', icon: PlusCircle },
          { name: 'Billing & Quota', path: '/dashboard/recruiter/billing', icon: CreditCard },
          { name: 'Settings', path: '/dashboard/recruiter/settings', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Admin Overview', path: '/dashboard/admin', icon: LayoutDashboard, end: true },
          { name: 'Manage Users', path: '/dashboard/admin/users', icon: Users },
          { name: 'Manage Companies', path: '/dashboard/admin/companies', icon: Building2 },
          { name: 'Job Moderation', path: '/dashboard/admin/jobs', icon: Briefcase },
          { name: 'Revenue & Payments', path: '/dashboard/admin/payments', icon: CreditCard },
          { name: 'Admin Settings', path: '/dashboard/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const roleLabels: Record<string, { label: string; color: string }> = {
    seeker: { label: 'Job Seeker', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    recruiter: { label: 'Employer / Recruiter', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    admin: { label: 'Platform Administrator', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  const currentRoleMeta = roleLabels[user.role] || roleLabels.seeker;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* 1. Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white border-r border-slate-200/90 h-screen sticky top-0 z-30 justify-between">
        
        {/* Top Header & User Card */}
        <div className="p-5 space-y-5 overflow-y-auto">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Hire<span className="text-brand-600">Loop</span>
            </span>
          </Link>

          {/* User Info Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
            <img
              src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover border border-brand-500/30 bg-white"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border mt-1 ${currentRoleMeta.color}`}>
                {currentRoleMeta.label}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Dashboard Navigation
            </p>
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`
                }
              >
                <link.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{link.name}</span>
              </NavLink>
            ))}
          </div>

          {/* Public Quick Links */}
          <div className="pt-4 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Public Portal
            </p>
            <Link
              to="/"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Home Page
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Browse Public Jobs
            </Link>
            <Link
              to="/companies"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5" />
              Companies Directory
            </Link>
            <Link
              to="/pricing"
              className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Pricing & Plans
            </Link>
          </div>

        </div>

        {/* Bottom Logout Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* 2. Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Navbar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">HireLoop</span>
          </Link>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Slide-out Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setSidebarOpen(false)}
            />

            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white animate-slide-up h-full justify-between">
              
              <div className="p-5 space-y-5 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-extrabold text-slate-900">Dashboard</span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User card in mobile drawer */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center gap-3">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover bg-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>

                {/* Mobile Links */}
                <div className="space-y-1">
                  {navLinks.map((link) => (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      end={link.end}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                          isActive
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`
                      }
                    >
                      <link.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </NavLink>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <Link
                    to="/"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900"
                  >
                    <Home className="w-3.5 h-3.5" /> Home Page
                  </Link>
                  <Link
                    to="/jobs"
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-slate-600 hover:text-slate-900"
                  >
                    <Search className="w-3.5 h-3.5" /> Browse Jobs
                  </Link>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic Nested Content */}
        <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
};
