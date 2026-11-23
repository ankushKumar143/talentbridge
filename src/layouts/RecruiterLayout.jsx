import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import RecruiterSidebar from '../components/layout/RecruiterSidebar';
import Header from '../components/layout/Header';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { useToast } from '../context/ToastContext';

export default function RecruiterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { recruiterProfile, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useApplications();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully');
    navigate('/login?role=recruiter');
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-lav selection:text-p">
      {/* Recruiter Sidebar */}
      <RecruiterSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        recruiter={recruiterProfile}
        onLogout={handleLogout}
        onToast={(msg) => showToast(msg)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[250px] flex-1 flex flex-col min-w-0">
        <Header
          q={searchQuery}
          setQ={setSearchQuery}
          setOpenSidebar={setSidebarOpen}
          user={recruiterProfile}
          notifications={notifications}
          onClearNotifications={markNotificationsAsRead}
          onLogout={handleLogout}
          onToast={(msg) => showToast(msg)}
          role="recruiter"
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto flex-1">
          <Outlet context={{ searchQuery, setSearchQuery }} />
        </main>
      </div>
    </div>
  );
}
