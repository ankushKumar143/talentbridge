import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ChevronDown, Menu, Check } from 'lucide-react';

function useOutsideClick(callback) {
  const ref = useRef(null);
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        callback();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);
  return ref;
}

export default function Header({
  q = '',
  setQ,
  setOpenSidebar,
  user,
  notifications = [],
  onClearNotifications,
  onLogout,
  onToast,
  role = 'student'
}) {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useOutsideClick(() => setShowNotifs(false));
  const profileRef = useOutsideClick(() => setShowProfile(false));

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (role === 'student') {
      navigate('/student/jobs');
    } else {
      navigate('/recruiter/candidates');
    }
  };

  return (
    <header className="sticky top-0 z-20 h-[72px] bg-bg/95 backdrop-blur-md flex items-center gap-3 px-4 lg:px-8 border-b border-line">
      {/* Mobile Drawer Toggle */}
      <button
        aria-label="Open menu"
        className="lg:hidden w-10 h-10 grid place-items-center rounded-xl border border-line bg-white text-ink hover:bg-slate-50 transition-colors"
        onClick={() => setOpenSidebar(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Global Search Input */}
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-xl relative"
      >
        <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
        <input
          aria-label="Search jobs, skills, or companies"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={
            role === 'student'
              ? 'Search jobs, companies, or skills...'
              : 'Search candidates, skills, or colleges...'
          }
          className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-sm placeholder:text-mute focus:border-p focus:outline-none transition-colors shadow-sm"
        />
      </form>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Notification Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={showNotifs}
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative w-10 h-10 grid place-items-center rounded-xl border border-line bg-white hover:bg-lav transition-colors"
          >
            <Bell className="w-[18px] h-[18px] text-ink" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-err ring-2 ring-white" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-line rounded-2xl shadow-card p-3 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-line mb-1">
                <span className="text-xs font-semibold text-ink uppercase tracking-wider">
                  Notifications
                </span>
                {notifications.length > 0 && (
                  <button
                    onClick={() => {
                      if (onClearNotifications) onClearNotifications();
                      if (onToast) onToast('Notifications marked as read');
                    }}
                    className="text-xs text-p hover:underline font-medium inline-flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Mark read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-mute text-center py-4">No notifications yet</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id || n.t}
                      className="px-3 py-2.5 rounded-xl hover:bg-bg transition-colors"
                    >
                      <p className="text-sm font-medium text-ink leading-snug">{n.t}</p>
                      <p className="text-xs text-mute mt-0.5">{n.w}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div ref={profileRef} className="relative">
          <button
            type="button"
            aria-expanded={showProfile}
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 h-10 pl-1.5 pr-2.5 rounded-xl border border-line bg-white hover:bg-lav transition-colors"
          >
            <span className="w-7 h-7 rounded-lg bg-p2 text-white grid place-items-center text-xs font-semibold">
              {user?.avatar || (user?.name ? user.name.slice(0, 2).toUpperCase() : 'TB')}
            </span>
            <span className="hidden md:block text-sm font-medium text-ink truncate max-w-[120px]">
              {user?.first || user?.name || 'Account'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-mute" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-line rounded-2xl shadow-card p-1.5 z-30 animate-in fade-in slide-in-from-top-1">
              <div className="px-3 py-2 border-b border-line mb-1">
                <p className="text-sm font-semibold text-ink truncate">{user?.name || 'Demo User'}</p>
                <p className="text-xs text-mute truncate">{user?.email || 'user@talentbridge.demo'}</p>
              </div>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate(role === 'student' ? '/student/profile' : '/recruiter/profile');
                }}
                className="w-full text-left px-3 h-9 rounded-xl text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                My Profile
              </button>

              <button
                onClick={() => {
                  setShowProfile(false);
                  navigate(role === 'student' ? '/student/settings' : '/recruiter/settings');
                }}
                className="w-full text-left px-3 h-9 rounded-xl text-sm font-medium text-ink hover:bg-bg transition-colors"
              >
                Settings
              </button>

              <div className="my-1 border-t border-line" />

              <button
                onClick={() => {
                  setShowProfile(false);
                  if (onLogout) onLogout();
                }}
                className="w-full text-left px-3 h-9 rounded-xl text-sm font-medium text-err hover:bg-red-50 transition-colors"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
