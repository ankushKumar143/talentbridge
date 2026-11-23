import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  GraduationCap,
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const initialRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'student';
  const [role, setRole] = useState(initialRole);

  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    degree: '',
    batch: '2027',
  });

  const [recruiterForm, setRecruiterForm] = useState({
    name: '',
    email: '',
    password: '',
    company: '',
    title: '',
    industry: 'Technology & Software',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setSearchParams({ role: selectedRole });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (role === 'student') {
      if (!studentForm.name || !studentForm.email || !studentForm.password) {
        setError('Please complete all required fields.');
        return;
      }

      const newStudentUser = {
        id: 'student-' + Date.now(),
        name: studentForm.name.trim(),
        first: studentForm.name.trim().split(' ')[0],
        email: studentForm.email.trim(),
        password: studentForm.password,
        role: 'student',
        avatar: studentForm.name.trim().slice(0, 2).toUpperCase(),
        college: studentForm.college.trim(),
        degree: studentForm.degree.trim(),
        batch: studentForm.batch,
        phone: '',
        headline: `${studentForm.degree || 'Computer Science'} Undergrad (${studentForm.batch})`,
        about: '',
        resume: null,
        skills: [],
        certifications: [],
        education: [
          {
            institution: studentForm.college.trim(),
            degree: studentForm.degree.trim(),
            duration: `2023 - ${studentForm.batch}`,
            score: ''
          }
        ],
        projects: []
      };

      setSubmitting(true);
      try {
        await register('student', newStudentUser);
        showToast(`Welcome to TalentBridge, ${newStudentUser.name}!`, 'success');
        navigate('/student/overview');
      } catch (err) { setError(err.message || 'Could not create your account.'); }
      finally { setSubmitting(false); }
    } else {
      if (!recruiterForm.name || !recruiterForm.email || !recruiterForm.password || !recruiterForm.company) {
        setError('Please complete all required recruiter fields.');
        return;
      }

      const newRecruiterUser = {
        id: 'recruiter-' + Date.now(),
        name: recruiterForm.name.trim(),
        first: recruiterForm.name.trim().split(' ')[0],
        email: recruiterForm.email.trim(),
        password: recruiterForm.password,
        role: 'recruiter',
        avatar: recruiterForm.name.trim().slice(0, 2).toUpperCase(),
        company: recruiterForm.company.trim(),
        companyLogo: recruiterForm.company.trim().slice(0, 2).toUpperCase(),
        title: recruiterForm.title || 'Technical Talent Acquisition',
        industry: recruiterForm.industry,
        website: 'https://' + recruiterForm.company.toLowerCase().replace(/\s+/g, '') + '.com',
        location: 'Bengaluru, India',
        phone: '',
        description: `${recruiterForm.company} is actively recruiting through TalentBridge.`,
        teamSize: '50 - 200 employees'
      };

      setSubmitting(true);
      try {
        await register('recruiter', newRecruiterUser);
        showToast(`Recruiter account registered for ${newRecruiterUser.company}!`, 'success');
        navigate('/recruiter/overview');
      } catch (err) { setError(err.message || 'Could not create your account.'); }
      finally { setSubmitting(false); }
    }
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
          Create Your TalentBridge Account
        </h2>
        <p className="mt-1 text-xs text-mute">
          Connecting Talent with Opportunity â€¢ Join the Campus Placement SaaS
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
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
              <span>Student Account</span>
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
              <span>Recruiter Account</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'student' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Sharma"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Student Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. aarav@college.edu"
                      value={studentForm.email}
                      onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Create Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={studentForm.password}
                      onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">College / University</label>
                    <input
                      type="text"
                      placeholder="e.g. NIT Bengaluru"
                      value={studentForm.college}
                      onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Degree & Major</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech Computer Science"
                      value={studentForm.degree}
                      onChange={(e) => setStudentForm({ ...studentForm, degree: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Recruiter Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Neha Verma"
                      value={recruiterForm.name}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Corporate Work Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. neha@technova.com"
                      value={recruiterForm.email}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-mute absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. TechNova Solutions"
                      value={recruiterForm.company}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, company: e.target.value })}
                      className="w-full h-10 pl-9 pr-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Talent Acquisition Lead"
                      value={recruiterForm.title}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, title: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink mb-1">Create Password</label>
                    <input
                      type="password"
                      required
                      placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                      value={recruiterForm.password}
                      onChange={(e) => setRecruiterForm({ ...recruiterForm, password: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {error && (
              <p role="alert" className="text-xs text-err bg-red-50 p-2.5 rounded-xl border border-red-200">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className={`w-full h-11 text-sm font-semibold justify-center shadow-sm ${
                role === 'recruiter' ? 'bg-ink hover:bg-slate-800' : ''
              }`}
            >
              {submitting ? 'Creating account…' : 'Create Account'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Account details */}
          <div className="mt-6 pt-5 border-t border-line text-center text-xs text-mute">
            <p>
              Already registered?{' '}
              <Link
                to={`/login?role=${role}`}
                className="text-p font-semibold hover:underline"
              >
                Sign In to {role === 'student' ? 'Student' : 'Recruiter'} Portal
              </Link>
            </p>
            <p className="mt-2 text-[11px] text-mute/80 flex items-center justify-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-mute" />
              Your account is securely created and stored by TalentBridge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}










