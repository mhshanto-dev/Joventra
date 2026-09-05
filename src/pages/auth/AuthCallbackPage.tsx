import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchCurrentUser, user } = useAuthStore();
  const token = searchParams.get('token');

  useEffect(() => {
    const handleAuth = async () => {
      if (token) {
        localStorage.setItem('Joventra_token', token);
        const success = await fetchCurrentUser();
        if (success) {
          toast.success('Successfully logged in with Google');
        } else {
          toast.error('Failed to load user profile');
          navigate('/login');
        }
      } else {
        navigate('/login?error=no_token');
      }
    };
    
    if (!user) {
        handleAuth();
    }
  }, [token, fetchCurrentUser, navigate, user]);

  useEffect(() => {
    if (user) {
      if (user.role === 'seeker') navigate('/dashboard/seeker');
      else if (user.role === 'recruiter') navigate('/dashboard/recruiter');
      else if (user.role === 'admin') navigate('/dashboard/admin');
      else navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Completing authentication...</p>
      </div>
    </div>
  );
};
