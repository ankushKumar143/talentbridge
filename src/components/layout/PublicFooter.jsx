import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Shield, Github, Linkedin, Twitter } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-white border-t border-line text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2.5 font-bold text-lg text-ink">
              <span className="w-8 h-8 rounded-lg bg-p text-white grid place-items-center">
                <Briefcase className="w-4 h-4" />
              </span>
              <span className="tracking-tight">TalentBridge</span>
            </Link>
            <p className="text-xs text-mute leading-relaxed">
              Connecting Talent with Opportunity. The unified campus placement management SaaS for engineering institutions, colleges, and enterprise recruiters.
            </p>
            <div className="flex items-center gap-3 pt-2 text-mute">
              <a href="#" className="hover:text-p transition-colors" aria-label="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-p transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-p transition-colors" aria-label="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-mute">
              <li>
                <a href="#features" className="hover:text-p transition-colors">Features Overview</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-p transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#role-selection" className="hover:text-p transition-colors">Role Portals</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-p transition-colors">Demo Credentials</Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              For Students
            </h4>
            <ul className="space-y-2 text-xs text-mute">
              <li>
                <Link to="/login?role=student" className="hover:text-p transition-colors">Student Login</Link>
              </li>
              <li>
                <Link to="/register?role=student" className="hover:text-p transition-colors">Student Registration</Link>
              </li>
              <li>
                <Link to="/student/overview" className="hover:text-p transition-colors">Live Student Dashboard</Link>
              </li>
              <li>
                <Link to="/student/jobs" className="hover:text-p transition-colors">Explore Campus Jobs</Link>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-3">
              For Recruiters
            </h4>
            <ul className="space-y-2 text-xs text-mute">
              <li>
                <Link to="/login?role=recruiter" className="hover:text-p transition-colors">Recruiter Login</Link>
              </li>
              <li>
                <Link to="/register?role=recruiter" className="hover:text-p transition-colors">Recruiter Registration</Link>
              </li>
              <li>
                <Link to="/recruiter/overview" className="hover:text-p transition-colors">Recruiter Dashboard</Link>
              </li>
              <li>
                <Link to="/recruiter/jobs/new" className="hover:text-p transition-colors">Post Open Positions</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-mute">
          <p>© {new Date().getFullYear()} TalentBridge SaaS. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-lav/50 text-p px-3 py-1.5 rounded-full border border-lav">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium text-[11px]">
              Prototype Mode: Client-Side State & LocalStorage Persistence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
