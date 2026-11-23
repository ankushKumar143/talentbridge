import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  LayoutDashboard,
  PlusCircle,
  FileCheck2,
  Users,
  Search,
  Building,
  Sliders,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

const RECRUITER_NAV_ITEMS = [
  { path: '/recruiter/overview', label: 'Overview', icon: LayoutDashboard },
  { path: '/recruiter/jobs/new', label: 'Post a New Job', icon: PlusCircle },
  { path: '/recruiter/jobs', label: 'Manage Jobs', icon: Briefcase },
  { path: '/recruiter/applications', label: 'Applications Received', icon: FileCheck2 },
  { path: '/recruiter/candidates', label: 'Candidate Directory', icon: Search },
  { path: '/recruiter/profile', label: 'Company Profile', icon: Building },
  { path: '/recruiter/settings', label: 'Settings', icon: Sliders },
];

export default function RecruiterSidebar({
  open,
  setOpen,
  recruiter,
  onLogout,
  onToast
}) {
  const navigate = useNavigate();

  const handleSupport = () => {
    if (onToast) onToast('Recruiter Desk: enterprise-help@talentbridge.demo (Priority 24/7)');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Recruiter Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[250px] bg-white border-r border-line flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header with Recruiter Badge */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-line/60">
          <div
            onClick={() => {
              navigate('/recruiter/overview');
              setOpen(false);
            }}
            className="flex items-center gap-2.5 font-semibold text-lg text-ink cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-lg bg-ink text-white grid place-items-center shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4 text-p" />
            </span>
            <div className="leading-tight">
              <span className="tracking-tight text-ink block font-bold text-base">TalentBridge</span>
              <span className="text-[10px] text-p font-semibold uppercase tracking-wider block">Recruiter Hub</span>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-mute hover:text-ink p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav aria-label="Recruiter Navigation" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {RECRUITER_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-lav text-p'
                      : 'text-mute hover:bg-bg hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-[18px] h-[18px] ${
                        isActive ? 'text-p' : 'text-mute'
                      }`}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Area */}
        <div className="p-3 border-t border-line space-y-1 bg-white">
          <button
            onClick={handleSupport}
            className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium text-mute hover:bg-bg hover:text-ink transition-colors"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
            Recruiter Support
          </button>

          {/* Recruiter Profile Snippet */}
          <div
            onClick={() => {
              navigate('/recruiter/profile');
              setOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-ink text-white grid place-items-center text-xs font-semibold shrink-0">
              {recruiter?.companyLogo || recruiter?.avatar || 'TN'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">
                {recruiter?.name || 'Neha Verma'}
              </p>
              <p className="text-xs text-mute truncate">
                {recruiter?.company || 'TechNova Solutions'}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium text-err hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Log out
          </button>
        </div>
      </aside>
    </>
  );
}
