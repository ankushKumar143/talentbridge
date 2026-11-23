import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import StudentSidebar from '../components/layout/StudentSidebar';
import Header from '../components/layout/Header';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { useToast } from '../context/ToastContext';

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certInput, setCertInput] = useState('');

  const { studentProfile, updateStudentProfile, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useApplications();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out successfully');
    navigate('/login?role=student');
  };

  const handleAddCertSubmit = (e) => {
    e.preventDefault();
    const cert = certInput.trim();
    if (!cert) return;

    const currentCerts = studentProfile.certifications || [];
    if (currentCerts.includes(cert)) {
      showToast('Certification is already listed', 'warning');
      return;
    }

    const updated = [...currentCerts, cert];
    updateStudentProfile({
      certifications: updated,
      certs: updated,
    });

    setCertInput('');
    setIsCertModalOpen(false);
    showToast(`Added "${cert}" to profile`, 'success');
  };

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col selection:bg-lav selection:text-p">
      {/* Student Sidebar */}
      <StudentSidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
        student={studentProfile}
        onLogout={handleLogout}
        onToast={(msg) => showToast(msg)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-[250px] flex-1 flex flex-col min-w-0">
        <Header
          q={searchQuery}
          setQ={setSearchQuery}
          setOpenSidebar={setSidebarOpen}
          user={studentProfile}
          notifications={notifications}
          onClearNotifications={markNotificationsAsRead}
          onLogout={handleLogout}
          onToast={(msg) => showToast(msg)}
          role="student"
        />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto flex-1">
          <Outlet context={{ isCertModalOpen, setIsCertModalOpen, searchQuery, setSearchQuery }} />
        </main>
      </div>

      {/* Add Certification Modal Accessible Globally in Student Layout */}
      {isCertModalOpen && (
        <Modal
          title="Add a Certification"
          onClose={() => setIsCertModalOpen(false)}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddCertSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Certification Name
              </label>
              <input
                autoFocus
                type="text"
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                placeholder="e.g. Meta Front-End Developer Professional"
                className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!certInput.trim()}
            >
              Add Certification
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
