export type Role = 'seeker' | 'recruiter' | 'admin';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface SeekerProfile {
  _id?: string;
  userId: string;
  headline?: string;
  bio?: string;
  skills: string[];
  resumeUrl?: string;
  resumeOriginalName?: string;
  savedJobs?: (string | Job)[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

export interface Company {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  industry: string;
  website?: string;
  location: {
    city?: string;
    country?: string;
  };
  employeeCount: string;
  logoUrl?: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  recruiterId?: string | User;
  openJobsCount?: number;
  openJobs?: Job[];
  createdAt: string;
}

export interface Job {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  companyId: Company;
  recruiterId?: string;
  category: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  location: {
    city?: string;
    country?: string;
  };
  isRemote: boolean;
  deadline: string;
  responsibilities: string;
  requirements: string;
  benefits?: string;
  status: 'active' | 'closed' | 'draft';
  applicationCount: number;
  createdAt: string;
}

export interface Application {
  _id: string;
  id?: string;
  seekerId: User;
  seekerProfileId?: any;
  jobId: Job;
  companyId: Company;
  coverLetter?: string;
  resumeUrl?: string;
  status: 'applied' | 'under_review' | 'shortlisted' | 'rejected' | 'offered';
  appliedAt: string;
}

export interface Subscription {
  _id?: string;
  userId: string;
  userRole: Role;
  planType: string;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  applicationsUsedThisMonth: number;
}

export interface Payment {
  _id: string;
  id?: string;
  userId: User;
  amount: number;
  currency: string;
  plan: string;
  transactionId: string;
  status: 'succeeded' | 'pending' | 'failed';
  paidAt: string;
}
