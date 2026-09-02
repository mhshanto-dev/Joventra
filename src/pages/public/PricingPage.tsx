import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { 
  Check, 
  Sparkles, 
  Zap, 
  Building2, 
  User, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  HelpCircle,
  CreditCard,
  ArrowRight
} from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seeker' | 'recruiter'>('seeker');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handlePlanSelect = async (planId: string, role: 'seeker' | 'recruiter') => {
    if (!isAuthenticated) {
      toast.info('Please create an account or sign in to choose your plan');
      navigate('/register');
      return;
    }

    if (user?.role !== role) {
      toast.error(`This plan is designed for ${role === 'seeker' ? 'Job Seekers' : 'Recruiters'}. Your account role is ${user?.role}.`);
      return;
    }

    if (planId === 'free') {
      toast.info('You are already on the Free starter tier.');
      navigate(`/dashboard/${role}`);
      return;
    }

    try {
      const response = await apiClient.post('/payments/create-checkout', { planId });
      if (response.data.success && response.data.data?.url) {
        window.location.href = response.data.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to initialize checkout');
    }
  };

  const seekerPlans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      period: 'forever',
      description: 'Ideal for casual job seekers beginning their journey.',
      highlight: false,
      features: [
        'Browse & save up to 10 jobs',
        'Apply to up to 3 jobs per month',
        'Basic candidate profile',
        'Standard email alerts',
      ],
      buttonText: 'Current Free Tier',
    },
    {
      id: 'pro',
      name: 'Seeker Pro',
      price: '$19',
      period: 'per month',
      description: 'Accelerate your job hunt with high-volume applications.',
      highlight: true,
      popularBadge: 'Most Popular',
      features: [
        'Apply to up to 30 jobs per month',
        'Unlimited saved bookmarks',
        'Full application tracking timeline',
        'Salary transparency insights',
        'Standard email notifications',
      ],
      buttonText: 'Upgrade to Pro',
    },
    {
      id: 'premium',
      name: 'Seeker Premium',
      price: '$39',
      period: 'per month',
      description: 'Maximum visibility & unlimited applications for top talent.',
      highlight: false,
      features: [
        'Unlimited job applications',
        'Unlimited saved bookmarks',
        'Profile boost to verified recruiters',
        'Early access to newly posted jobs',
        'Priority 24/7 candidate support',
      ],
      buttonText: 'Upgrade to Premium',
    },
  ];

  const recruiterPlans = [
    {
      id: 'free',
      name: 'Starter Recruiter',
      price: '$0',
      period: 'forever',
      description: 'Great for a company’s first year of hiring.',
      highlight: false,
      features: [
        'Up to 3 active job posts',
        'Basic applicant review management',
        'Standard directory listing visibility',
        'Company verification badge',
      ],
      buttonText: 'Get Started Free',
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$49',
      period: 'per month',
      description: 'Scale hiring rapidly across multiple open engineering roles.',
      highlight: true,
      popularBadge: 'Recommended for Startups',
      features: [
        'Up to 10 active job posts at once',
        'Applicant tracking & status updates',
        '30-day candidate analytics charts',
        'Direct applicant email dispatch',
        'Standard email support',
      ],
      buttonText: 'Upgrade to Growth',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$149',
      period: 'per month',
      description: 'High-throughput hiring toolkit for scaling tech organizations.',
      highlight: false,
      features: [
        'Up to 50 active job posts at once',
        'Advanced platform analytics dashboard',
        'Featured job spotlight positioning',
        'Team collaboration & multi-recruiter',
        'Custom branding & priority support',
      ],
      buttonText: 'Upgrade to Enterprise',
    },
  ];

  const faqs = [
    {
      q: 'Can I upgrade or downgrade my subscription plan at any time?',
      a: 'Yes! You can upgrade, downgrade, or cancel your subscription at any time directly from your Billing Dashboard. Changes take effect immediately with prorated billing.',
    },
    {
      q: 'How does the 14-day money-back guarantee work?',
      a: 'If you are unsatisfied with your paid subscription for any reason within the first 14 days, reach out to support and we will issue a full 100% refund with no questions asked.',
    },
    {
      q: 'How do monthly application limits reset for Seekers?',
      a: 'Application limits automatically reset on the 1st day of every calendar month. Upgrading to Pro or Premium immediately increases your limit without waiting.',
    },
    {
      q: 'How many active jobs can a company post for free?',
      a: 'Every approved company can maintain up to 3 active job posts simultaneously completely for free. Once a job is closed or deleted, that slot opens up immediately for a new posting.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We securely process payments using Stripe. We accept all major credit and debit cards (Visa, MasterCard, American Express) as well as Apple Pay and Google Pay.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16 sm:space-y-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" /> Transparent Pricing
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
          Flexible plans tailored for talent & hiring teams
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Zero hidden fees. Start for free and upgrade as your career or hiring pipeline expands.
        </p>

        {/* Role Switcher Tabs */}
        <div className="pt-6 flex items-center justify-center">
          <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-inner">
            <button
              onClick={() => setActiveTab('seeker')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'seeker'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-brand-600" />
              For Job Seekers
            </button>

            <button
              onClick={() => setActiveTab('recruiter')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'recruiter'
                  ? 'bg-white text-slate-900 shadow-md shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-brand-600" />
              For Recruiters & Employers
            </button>
          </div>
        </div>

      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {(activeTab === 'seeker' ? seekerPlans : recruiterPlans).map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
              plan.highlight
                ? 'bg-gradient-to-b from-slate-900 to-slate-850 text-white shadow-2xl shadow-brand-900/20 border-2 border-brand-500 scale-100 md:-translate-y-2'
                : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:shadow-xl'
            }`}
          >
            {plan.popularBadge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-brand-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                {plan.popularBadge}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold">{plan.name}</h3>
                <p className={`text-xs leading-relaxed ${plan.highlight ? 'text-slate-300' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className={`text-xs font-semibold ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                  /{plan.period}
                </span>
              </div>

              {/* Features list */}
              <ul className="space-y-3 pt-4 border-t border-slate-200/40 text-xs sm:text-sm">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className={`p-0.5 rounded-full mt-0.5 ${plan.highlight ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-600'}`}>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className={plan.highlight ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handlePlanSelect(plan.id, activeTab)}
              className={`mt-8 w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                plan.highlight
                  ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/40'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Money-Back Guarantee Trust Callout */}
      <div className="max-w-3xl mx-auto rounded-3xl bg-slate-100/80 border border-slate-200 p-6 sm:p-8 text-center flex flex-col sm:flex-row items-center justify-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div className="text-left space-y-1">
          <h4 className="text-sm font-bold text-slate-900">14-Day Money-Back Guarantee</h4>
          <p className="text-xs text-slate-600">
            Try any paid tier risk-free. If Joventra does not accelerate your pipeline within 14 days, receive a complete refund.
          </p>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto space-y-8 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Have questions about billing, quotas, or cancellation? We have answers.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50/50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
