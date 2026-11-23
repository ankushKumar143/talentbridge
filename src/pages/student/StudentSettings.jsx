import React, { useState } from 'react';
import { Sliders, Bell, Lock, Shield, RotateCcw } from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function StudentSettings() {
  const { studentProfile, resetDemoData } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    jobMatches: true,
    statusUpdates: true,
    newsletter: false,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleToggle = (key) => {
    setNotifications((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      showToast('Notification preference updated');
      return updated;
    });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showToast('Password updated successfully (frontend simulation)', 'success');
  };

  const handleReset = () => {
    resetDemoData();
    showToast('Demo data reset to initial values');
    window.location.reload();
  };

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
          Account Settings <Sliders className="w-5 h-5 text-p" />
        </h1>
        <p className="text-mute text-sm mt-0.5">
          Configure notification preferences, security, and placement privacy controls.
        </p>
      </div>

      {/* Notification Preferences */}
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-p" /> Notification Preferences
          </span>
        </CardHeader>

        <div className="space-y-4 pt-2">
          {[
            {
              key: 'statusUpdates',
              label: 'Application Status Alerts',
              desc: 'Get immediate notifications when recruiters shortlist, accept, or update your status.'
            },
            {
              key: 'jobMatches',
              label: 'Daily Recommended Job Matches',
              desc: 'Receive alerts whenever a new job posting has an 80%+ match with your verified skills.'
            },
            {
              key: 'emailAlerts',
              label: 'Email Notifications',
              desc: `Send interview schedules and company updates to ${studentProfile?.email || 'student@talentbridge.demo'}.`
            },
            {
              key: 'newsletter',
              label: 'Campus Placement Newsletter',
              desc: 'Weekly digests with coding interview questions and placement prep resources.'
            }
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-xl border border-line bg-bg/40 hover:bg-bg transition-colors"
            >
              <div className="min-w-0 pr-4">
                <p className="text-sm font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-mute mt-0.5">{item.desc}</p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={notifications[item.key]}
                onClick={() => handleToggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-p ${
                  notifications[item.key] ? 'bg-p' : 'bg-slate-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    notifications[item.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Security & Password */}
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-p" /> Security & Password
          </span>
        </CardHeader>

        <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">New Password</label>
              <input
                type="password"
                placeholder="At least 8 characters"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" size="md">
            Update Password
          </Button>
        </form>
      </Card>

      {/* Demo Credentials Reference & Reset Data */}
      <Card className="p-6 border-lav bg-lav/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              <Shield className="w-4 h-4 text-p" /> Prototype Demonstration Controls
            </h3>
            <p className="text-xs text-mute mt-1">
              Test accounts: <code>student@talentbridge.demo</code> | <code>recruiter@talentbridge.demo</code>
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            icon={RotateCcw}
            onClick={handleReset}
          >
            Reset Demo Data
          </Button>
        </div>
      </Card>
    </div>
  );
}
