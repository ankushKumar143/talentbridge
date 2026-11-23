import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FileText,
  Users,
  Award,
  Layers,
  Clock,
  ShieldCheck
} from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';
import PublicFooter from '../components/layout/PublicFooter';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-lav selection:text-p">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-white via-white to-bg border-b border-line">
        {/* Decorative soft glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-lav/70 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lav border border-p2/30 text-p text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Connecting Talent with Opportunity
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight max-w-4xl mx-auto leading-[1.15]">
            The Modern Campus <span className="text-p">Placement Management</span> Platform
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-mute max-w-2xl mx-auto font-normal leading-relaxed">
            TalentBridge bridges the gap between ambitious students and forward-thinking corporate recruiters. Manage job drives, automated match scores, verified resumes, and live applicant pipelines in one unified SaaS portal.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Button
              variant="primary"
              size="lg"
              icon={GraduationCap}
              onClick={() => navigate('/login?role=student')}
            >
              Enter as Student
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={Building2}
              onClick={() => navigate('/login?role=recruiter')}
            >
              Enter as Recruiter
            </Button>
          </div>

          {/* Account access */}
          <p className="mt-8 text-sm text-mute">New to TalentBridge? Choose your role above, then create an account to continue.</p>

          {/* Interactive UI Preview Showcase Card */}
          <div className="mt-14 max-w-5xl mx-auto bg-white rounded-3xl border border-line shadow-card p-4 sm:p-6 lg:p-8 text-left relative">
            <div className="flex items-center justify-between pb-4 border-b border-line mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-xs text-mute font-medium ml-2 hidden sm:inline">
                  TalentBridge Placement SaaS Dashboard Preview
                </span>
              </div>
              <Badge variant="success">Active Placement Season 2026</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-lav/40 border border-lav">
                <div className="flex items-center justify-between text-xs text-p font-semibold">
                  <span>Match Intelligence</span>
                  <span>92% Fit</span>
                </div>
                <h4 className="text-sm font-bold text-ink mt-2">Frontend Developer Intern</h4>
                <p className="text-xs text-mute mt-0.5">TechNova Solutions â€¢ Remote</p>
                <div className="flex gap-1.5 mt-3">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-line">React.js</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-line">JavaScript</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/50">
                <div className="flex items-center justify-between text-xs text-ok font-semibold">
                  <span>Recruiter Milestone</span>
                  <span>Shortlisted</span>
                </div>
                <h4 className="text-sm font-bold text-ink mt-2">Aarav Sharma</h4>
                <p className="text-xs text-mute mt-0.5">B.Tech CSE â€¢ 8.7 CGPA</p>
                <p className="text-[11px] text-mute mt-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-ok" /> Technical interview round scheduled
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-line">
                <div className="flex items-center justify-between text-xs text-mute font-semibold">
                  <span>Verified Resume</span>
                  <span>ATS Passed</span>
                </div>
                <h4 className="text-sm font-bold text-ink mt-2">Aarav_Sharma_Resume.pdf</h4>
                <p className="text-xs text-mute mt-0.5">Uploaded Yesterday â€¢ 182 KB</p>
                <span className="inline-block mt-3 text-[11px] font-semibold text-p">
                  Instant Recruiter Download â†’
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics / Intro */}
      <section className="py-12 bg-white border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-p">98%</p>
              <p className="text-xs sm:text-sm text-mute mt-1 font-medium">Drive Placement Rate</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-ink">500+</p>
              <p className="text-xs sm:text-sm text-mute mt-1 font-medium">Hiring Tech Partners</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-p">10,000+</p>
              <p className="text-xs sm:text-sm text-mute mt-1 font-medium">Student Matches</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-ink">&lt; 24h</p>
              <p className="text-xs sm:text-sm text-mute mt-1 font-medium">Shortlisting Response</p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="role-selection" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-p uppercase tracking-wider bg-lav px-3 py-1 rounded-full">
            Choose Your Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-3">
            Tailored Experiences for Students & Recruiters
          </h2>
          <p className="text-mute text-sm sm:text-base mt-2">
            Select your role to access dedicated dashboards, personalized workflows, and tools built specifically for campus recruitment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Student Card */}
          <Card
            hoverable
            className="p-8 flex flex-col justify-between border-line relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-lav/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-lav text-p grid place-items-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <GraduationCap className="w-7 h-7" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-ink">For Students</h3>
                <Badge variant="primary">Job Seekers</Badge>
              </div>

              <p className="text-sm text-mute leading-relaxed mb-6">
                Build your verified academic portfolio, upload ATS resumes, explore AI-recommended openings, and track your application milestones from submission to offer.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  '1-Click job applications with verified profile',
                  'Dynamic % match scores based on your technical skills',
                  'Live application status tracking (Shortlisted, Accepted, Under Review)',
                  'Curated learning roadmaps to close skill gaps',
                  'Drag-and-drop resume manager with format checks',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-xs text-ink/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-ok shrink-0 stroke-[2.5]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-line">
              <Button
                variant="primary"
                className="w-full text-sm font-semibold justify-center h-11"
                onClick={() => navigate('/login?role=student')}
              >
                Student Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-sm justify-center h-10"
                onClick={() => navigate('/register?role=student')}
              >
                New Student? Register Here
              </Button>
            </div>
          </Card>

          {/* Recruiter Card */}
          <Card
            hoverable
            className="p-8 flex flex-col justify-between border-line relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div>
              <div className="w-14 h-14 rounded-2xl bg-ink text-white grid place-items-center mb-6 group-hover:scale-105 transition-transform shadow-sm">
                <Building2 className="w-7 h-7" />
              </div>

              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold text-ink">For Recruiters</h3>
                <Badge variant="neutral">Talent Acquisition</Badge>
              </div>

              <p className="text-sm text-mute leading-relaxed mb-6">
                Post full-time and internship openings, discover qualified students with verified CGPAs, review resumes, and manage your hiring pipeline effortlessly.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  'Intuitive job posting form with instant live publishing',
                  'Real-time candidate inbox with status pipeline management',
                  'Shortlist, accept, reject, or request review in one click',
                  'Search candidates by skills, degree, and verified CGPA',
                  'Company brand profile & recruitment analytics',
                ].map((feat) => (
                  <li key={feat} className="flex items-center gap-2.5 text-xs text-ink/90 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-ok shrink-0 stroke-[2.5]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-line">
              <Button
                variant="primary"
                className="w-full text-sm font-semibold justify-center h-11 bg-ink hover:bg-slate-800"
                onClick={() => navigate('/login?role=recruiter')}
              >
                Recruiter Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="ghost"
                className="w-full text-sm justify-center h-10"
                onClick={() => navigate('/register?role=recruiter')}
              >
                New Recruiter? Register Here
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-line scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold text-p uppercase tracking-wider bg-lav px-3 py-1 rounded-full">
              Engineered For Results
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-3">
              Everything You Need for Campus Hiring
            </h2>
            <p className="text-mute text-sm sm:text-base mt-2">
              Designed from the ground up to replace messy spreadsheets, scattered emails, and disconnected campus hiring portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'Smart Match Intelligence',
                desc: 'Intelligent algorithms compare student skill proficiencies against job prerequisites to score compatibility from 0% to 100%.'
              },
              {
                icon: Layers,
                title: 'Live Shared State Synchronization',
                desc: 'When a recruiter publishes a job or changes an applicant status, students see the updates instantly without page reload delays.'
              },
              {
                icon: FileText,
                title: 'ATS Resume Parsing & Manager',
                desc: 'Upload, validate, and download resumes in PDF or Word formats. Strict size and format checks ensure seamless recruiter delivery.'
              },
              {
                icon: Users,
                title: 'Applicant Review Pipeline',
                desc: 'Recruiters can move applications between Under Review, Shortlisted, Accepted, and Rejected with one click.'
              },
              {
                icon: Award,
                title: 'Skills & Learning Roadmaps',
                desc: 'Students receive personalized learning modules for prerequisite gaps detected across current market openings.'
              },
              {
                icon: ShieldCheck,
                title: 'Verified Academic Credentials',
                desc: 'Standardized CGPA, graduation batch, projects, and degree records ensure recruiters evaluate accurate qualifications.'
              }
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-line bg-bg/30 hover:bg-white hover:border-p2 hover:shadow-card transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-lav text-p grid place-items-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-ink">{f.title}</h3>
                  <p className="text-xs text-mute mt-2 leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-p uppercase tracking-wider bg-lav px-3 py-1 rounded-full">
            Transparent Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight mt-3">
            How TalentBridge Works
          </h2>
          <p className="text-mute text-sm sm:text-base mt-2">
            A seamless four-step recruitment cycle connecting students directly to employer hiring desks.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Create Verified Profile',
              desc: 'Students curate academic stats and technical skills; recruiters establish verified corporate hubs.'
            },
            {
              step: '02',
              title: 'Publish & Match',
              desc: 'Recruiters post open positions with criteria; students discover openings with calculated % match scores.'
            },
            {
              step: '03',
              title: 'One-Click Apply',
              desc: 'Students apply using their active ATS resume. Prevention guards stop accidental duplicate applications.'
            },
            {
              step: '04',
              title: 'Pipeline & Selection',
              desc: 'Recruiters review resumes, shortlist talent, and dispatch offers with instant status synchronization.'
            }
          ].map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-white border border-line relative shadow-sm"
            >
              <span className="text-3xl font-extrabold text-lav block mb-3 font-mono">
                {item.step}
              </span>
              <h3 className="text-base font-semibold text-ink">{item.title}</h3>
              <p className="text-xs text-mute mt-2 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-p to-p2 rounded-3xl p-8 sm:p-12 text-white text-center shadow-card relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Placement Season?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-lav/90 max-w-2xl mx-auto font-normal leading-relaxed">
            Join hundreds of colleges and tech recruiters using TalentBridge to streamline hiring and find the perfect match.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/register?role=student')}
            >
              Sign Up as Student
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              onClick={() => navigate('/register?role=recruiter')}
            >
              Sign Up as Recruiter
            </Button>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}



