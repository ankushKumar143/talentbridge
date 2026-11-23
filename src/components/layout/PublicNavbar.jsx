import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import Button from '../common/Button';

export default function PublicNavbar({ onQuickLogin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold text-xl text-ink group"
          >
            <span className="w-9 h-9 rounded-xl bg-p text-white grid place-items-center shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </span>
            <div className="leading-tight">
              <span className="text-ink tracking-tight font-bold">TalentBridge</span>
              <span className="text-[10px] text-p block font-semibold uppercase tracking-wider">Placement SaaS</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-mute hover:text-p transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-mute hover:text-p transition-colors"
            >
              How It Works
            </a>
            <a
              href="#role-selection"
              className="text-sm font-medium text-mute hover:text-p transition-colors"
            >
              For Students
            </a>
            <a
              href="#role-selection"
              className="text-sm font-medium text-mute hover:text-p transition-colors"
            >
              For Recruiters
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="md"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-ink hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in fade-in">
          <div className="space-y-1">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink hover:bg-lav hover:text-p rounded-xl transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink hover:bg-lav hover:text-p rounded-xl transition-colors"
            >
              How It Works
            </a>
            <a
              href="#role-selection"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-ink hover:bg-lav hover:text-p rounded-xl transition-colors"
            >
              Role Selection
            </a>
          </div>

          <div className="pt-3 border-t border-line space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/register');
              }}
            >
              Create Account
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
