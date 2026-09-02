import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from '../../lib/api-client';
import { toast } from 'sonner';
import { 
  User, 
  FileText, 
  Lock, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  Download, 
  Globe, 
  Github, 
  Linkedin,
  ShieldCheck
} from 'lucide-react';

export const SeekerSettingsPage: React.FC = () => {
  const { user, setUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'resume' | 'skills' | 'security'>('profile');

  // Profile info state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Seeker skills & bio state
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [socialLinks, setSocialLinks] = useState({ linkedin: '', github: '', portfolio: '' });

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['seeker-profile-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/users/seeker-profile');
      return res.data.data;
    },
  });

  useEffect(() => {
    if (profile) {
      setHeadline(profile.headline || '');
      setBio(profile.bio || '');
      setSkills(profile.skills || []);
      setSocialLinks({
        linkedin: profile.socialLinks?.linkedin || '',
        github: profile.socialLinks?.github || '',
        portfolio: profile.socialLinks?.portfolio || '',
      });
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.put('/users/profile', { name, email, avatarUrl });
      if (res.data.success) {
        setUser({ ...user!, name, email, avatarUrl });
        toast.success('Personal profile updated successfully!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    try {
      const res = await apiClient.put('/users/profile', {
        currentPassword,
        newPassword,
      });
      if (res.data.success) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleUpdateSkills = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.put('/users/seeker-profile', {
        headline,
        bio,
        skills,
        socialLinks,
      });
      if (res.data.success) {
        toast.success('Skills and bio updated successfully!');
        refetchProfile();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update seeker profile');
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeFile) {
      toast.error('Please select a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const res = await apiClient.post('/users/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success('Resume PDF uploaded successfully!');
        setResumeFile(null);
        refetchProfile();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Resume upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Account Settings</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Seeker Profile & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Maintain your public resume, target skills, contact information, and security preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Personal Profile
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'skills'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" /> Skills & Headline
        </button>

        <button
          onClick={() => setActiveTab('resume')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'resume'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" /> Resume PDF
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'security'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" /> Security & Password
        </button>
      </div>

      {/* Tab 1: Personal Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Avatar Photo URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Skills & Headline */}
      {activeTab === 'skills' && (
        <form onSubmit={handleUpdateSkills} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Skills & Career Bio
          </h3>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Professional Headline</label>
              <input
                type="text"
                placeholder="e.g. Senior Full Stack Engineer | React, Node.js, Cloud Architect"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 focus:bg-white"
              />
            </div>

            {/* Skills Tag Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Key Skills (Press Enter to add)</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. TypeScript, React, Docker..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  className="flex-1 text-sm p-2.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
                >
                  Add
                </button>
              </div>

              {/* Skills Tags Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-brand-400 hover:text-brand-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">About / Short Bio</label>
              <textarea
                rows={4}
                placeholder="Share a short summary of your background, passions, and achievements..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
              />
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-blue-600" /> LinkedIn
                </label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-slate-900" /> GitHub
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/..."
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" /> Portfolio
                </label>
                <input
                  type="url"
                  placeholder="https://myportfolio.dev"
                  value={socialLinks.portfolio}
                  onChange={(e) => setSocialLinks({ ...socialLinks, portfolio: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all"
            >
              Save Skills & Bio
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Resume PDF */}
      {activeTab === 'resume' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Candidate Resume Management
          </h3>

          {/* Current Resume Info */}
          {profile?.resumeUrl ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-950">
                    {profile.resumeOriginalName || 'Resume.pdf'}
                  </p>
                  <p className="text-[11px] text-emerald-700">Uploaded and active for 1-click applications</p>
                </div>
              </div>

              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                View PDF
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
              No PDF resume uploaded yet. Upload your resume so recruiters can review your full background.
            </div>
          )}

          {/* Upload Form */}
          <form onSubmit={handleResumeUpload} className="space-y-4 pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Upload / Replace Resume (PDF format, max 10MB)
            </label>

            <div className="border-2 border-dashed border-slate-200 hover:border-brand-500/50 rounded-3xl p-8 text-center space-y-3 bg-slate-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-brand-600 file:text-white hover:file:bg-brand-700 cursor-pointer"
              />
              {resumeFile && (
                <p className="text-xs font-bold text-brand-600">Selected: {resumeFile.name}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!resumeFile || isUploading}
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Save & Upload Resume'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Security */}
      {activeTab === 'security' && (
        <form onSubmit={handleUpdatePassword} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Change Account Password
          </h3>

          <div className="space-y-4 max-w-md">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/30 transition-all"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
