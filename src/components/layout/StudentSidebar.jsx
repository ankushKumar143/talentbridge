import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Home,
  User,
  FileText,
  Search,
  Star,
  Send,
  Bookmark,
  BookOpen,
  Sliders,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/student/overview', label: 'Overview', icon: Home },
  { path: '/student/profile', label: 'My Profile', icon: User },
  { path: '/student/resume', label: 'My Resume', icon: FileText },
  { path: '/student/jobs', label: 'Find Jobs', icon: Search },
  { path: '/student/recommended', label: 'Recommended Jobs', icon: Star },
  { path: '/student/applications', label: 'My Applications', icon: Send },
  { path: '/student/saved', label: 'Saved Jobs', icon: Bookmark },
  { path: '/student/skills', label: 'Skills & Learning', icon: BookOpen },
  { path: '/student/settings', label: 'Settings', icon: Sliders },
];

export default function StudentSidebar({
  open,
  setOpen,
  student,
  onLogout,
  onToast
}) {
  const navigate = useNavigate();

  const handleSupport = () => {
    if (onToast) onToast('Support desk: support@talentbridge.demo (Response time < 2 hours)');
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

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[250px] bg-white border-r border-line flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-line/60">
          <div
            onClick={() => {
              navigate('/student/overview');
              setOpen(false);
            }}
            className="flex items-center gap-2.5 font-semibold text-lg text-ink cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-lg bg-p text-white grid place-items-center shadow-sm group-hover:scale-105 transition-transform">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="tracking-tight">TalentBridge</span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-mute hover:text-ink p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav aria-label="Student Navigation" className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
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
                        isActive ? 'text-p' : 'text-mute group-hover:text-ink'
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
            Help & Support
          </button>

          {/* Student Profile snippet */}
          <div
            onClick={() => {
              navigate('/student/profile');
              setOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-bg cursor-pointer transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-p2 text-white grid place-items-center text-xs font-semibold shrink-0">
              {student?.avatar || 'AS'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">{student?.name || 'Aarav Sharma'}</p>
              <p className="text-xs text-mute capitalize">{student?.role || 'Student'}</p>
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
