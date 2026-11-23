import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_ACTIVITY, INITIAL_NOTIFICATIONS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { apiRequest } from '../api/client';

const ApplicationContext = createContext(null);
const mapApplication = (row) => ({ ...row, jobId: row.job_id, studentId: row.student_id,
  studentName: row.student_name, studentEmail: row.student_email, studentPhone: row.student_phone,
  college: row.college, degree: row.degree, skills: row.skills || [], resumeParsed: row.resume || null,
  resumeText: row.resume_text || '', resumeName: row.resume_name || '', company: row.company,
  role: row.role, appliedDate: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Recently' });

export function ApplicationProvider({ children }) {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useLocalStorage('tb_applications', []);
  const [activities, setActivities] = useLocalStorage('tb_activity', []);
  const [notifications, setNotifications] = useLocalStorage('tb_notifications', []);

  useEffect(() => {
    if (!currentUser) { setApplications([]); setNotifications([]); return; }
    apiRequest('/api/applications/mine').then((rows) => setApplications(rows.map(mapApplication)))
      .catch((err) => console.error('Could not load applications:', err.message));
    apiRequest('/api/notifications').then(setNotifications).catch((err) => console.error('Could not load notifications:', err.message));
  }, [currentUser?.id]);

  const appliedJobIds = useMemo(() => new Set(applications.map((item) => item.jobId)), [applications]);
  const isApplied = (jobId) => appliedJobIds.has(jobId);

  const applyForJob = async (job, studentProfile) => {
    if (appliedJobIds.has(job.id)) return { success: false, reason: 'duplicate', message: 'You have already applied for this opening.' };
    const parsed = studentProfile?.resume?.parsed || null;
    try {
      const saved = await apiRequest(`/api/jobs/${job.id}/apply`, { method: 'POST', body: { resume: {
        ...(parsed || {}), fileName: studentProfile?.resume?.fileName || '', profile: {
          name: studentProfile?.name, email: studentProfile?.email, phone: studentProfile?.phone,
          college: studentProfile?.college, degree: studentProfile?.degree,
          skills: (studentProfile?.skills || []).map((skill) => typeof skill === 'string' ? skill : skill.n),
        },
      } } });
      const application = mapApplication({ ...saved, job_id: job.id, student_id: studentProfile?.id,
        student_name: studentProfile?.name, student_email: studentProfile?.email, student_phone: studentProfile?.phone,
        college: studentProfile?.college, degree: studentProfile?.degree, company: job.company, role: job.title,
        resume: parsed, skills: parsed?.skills || [], resume_name: studentProfile?.resume?.fileName });
      setApplications((prev) => [application, ...prev]);
      setActivities((prev) => [{ i: 'send', t: 'Application submitted', d: `${job.title} at ${job.company}`, w: 'Just now' }, ...prev]);
      setNotifications((prev) => [{ id: `notif-${saved.id}`, t: `Application submitted to ${job.company} (${job.title})`, w: 'Just now', read: false }, ...prev]);
      return { success: true, application, message: `Application submitted for ${job.title}!` };
    } catch (err) {
      return { success: false, message: err.message || 'Could not submit application.' };
    }
  };

  const updateApplicationStatus = async (appId, newStatus, customNotes) => {
    try {
      const updated = await apiRequest(`/api/applications/${appId}/status`, { method: 'PATCH', body: { status: newStatus } });
      let target;
      setApplications((prev) => prev.map((app) => {
        if (String(app.id) !== String(appId)) return app;
        target = { ...app, status: updated.status, notes: customNotes || `Application status updated to ${newStatus}.` };
        return target;
      }));
      if (target) {
        const icon = newStatus === 'Rejected' ? 'x' : newStatus === 'Under Review' ? 'clock' : 'check';
        setActivities((prev) => [{ i: icon, t: `Status updated to ${newStatus}`, d: `${target.company} moved ${target.role} to ${newStatus}`, w: 'Just now' }, ...prev]);
        setNotifications((prev) => [{ id: `notif-${Date.now()}`, t: `${target.company} updated your application for ${target.role} to ${newStatus}`, w: 'Just now', read: false }, ...prev]);
      }
      return target;
    } catch (err) { console.error('Could not update application:', err.message); throw err; }
  };
  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    apiRequest('/api/notifications/read-all', { method: 'POST' }).catch((err) => console.error('Could not mark notifications as read:', err.message));
  };
  const clearNotifications = markNotificationsAsRead;

  const value = { applications, activities, notifications, appliedJobIds, isApplied, applyForJob,
    updateApplicationStatus, markNotificationsAsRead, clearNotifications };
  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error('useApplications must be used within an ApplicationProvider');
  return context;
}


