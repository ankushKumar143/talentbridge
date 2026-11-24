import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';
  const [role, setRole] = useState(initialRole);

  const [email, setEmail] = useState(
    ''
  );
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setSearchParams({ role: selectedRole });
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please provide both email and password.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const sessionUser = await login(role, email.trim(), password);
      showToast(`Welcome back, ${sessionUser.name}!`, 'success');
      navigate(role === 'student' ? '/student/overview' : '/recruiter/overview');
    } catch (err) { setError(err.message || 'Login failed. Please check your details.'); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-lav selection:text-p">
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 font-bold text-2xl text-ink group"
        >
          <span className="w-10 h-10 rounded-xl bg-p text-white grid place-items-center shadow-sm group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </span>
          <span className="tracking-tight">TalentBridge</span>
        </Link>
        <h2 className="mt-4 text-2xl font-bold text-ink tracking-tight">
          Sign In to TalentBridge
        </h2>
        <p className="mt-1 text-xs text-mute">
          Connecting Talent with Opportunity · Campus Placement Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-3xl border border-line">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-bg rounded-2xl border border-line mb-6">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                role === 'student'
                  ? 'bg-white text-p shadow-sm border border-line/60'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('recruiter')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                role === 'recruiter'
                  ? 'bg-white text-ink shadow-sm border border-line/60'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Recruiter Login</span>
            </button>
          </div>

          <div className="mb-6 p-3.5 bg-lav/40 rounded-2xl border border-lav text-xs text-mute">Sign in with the email and password you used when registering.</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mute absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === 'student'
                      ? 'student@example.com'
                      : 'recruiter@example.com'
                  }
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-ink">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-mute absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="········"
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-p focus:ring-p border-line"
                />
                <span className="text-xs text-mute font-medium">Remember me</span>
              </label>

              <span className="text-xs text-ok font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Account login
              </span>
            </div>

            {error && (
              <p role="alert" className="text-xs text-err bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={submitting}
              variant="primary"
              className={`w-full h-11 text-sm font-semibold justify-center shadow-sm ${
                role === 'recruiter' ? 'bg-ink hover:bg-slate-800' : ''
              }`}
            >
              {submitting ? 'Signing in...' : `Sign In as ${role === 'student' ? 'Student' : 'Recruiter'}`}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Account details */}
          <div className="mt-6 pt-5 border-t border-line text-center text-xs text-mute">
            <p>
              Don't have an account?{' '}
              <Link
                to={`/register?role=${role}`}
                className="text-p font-semibold hover:underline"
              >
                Register as {role === 'student' ? 'Student' : 'Recruiter'}
              </Link>
            </p>
            <p className="mt-2 text-[11px] text-mute/80 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-mute" />
              Sign in uses your TalentBridge account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}








