import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  FileText,
  ArrowRight
} from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import CandidateModal from '../../components/recruiter/CandidateModal';
import ResumePreviewModal from '../../components/recruiter/ResumePreviewModal';

import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterOverview() {
  const navigate = useNavigate();
  const { recruiterProfile } = useAuth();
  const { jobs } = useJobs();
  const { applications, applicationsLoading, applicationsError, refreshApplications, updateApplicationStatus } = useApplications();
  const { showToast } = useToast();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);

  // Dynamic Metrics Calculation directly from shared Context state
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const hasApplicationData = !applicationsLoading && !applicationsError;
  const totalApplications = applications.length;
  const applicationsThisWeek = applications.filter((application) => application.created_at && Date.now() - new Date(application.created_at).getTime() < 7 * 24 * 60 * 60 * 1000).length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const pendingCount = applications.filter(
    (a) => a.status === 'Under Review' || a.status === 'Applied'
  ).length;

  const recentApplications = applications.slice(0, 5);
  const recentJobs = jobs.slice(0, 3);
  const recentActivity = [
    ...applications.map((application) => ({
      id: `application-${application.id}`,
      kind: 'application',
      title: 'New candidate applied',
      description: `${application.studentName || 'A student'} applied for ${application.role || 'a job'}`,
      timestamp: application.created_at,
    })),
    ...jobs.filter((job) => job.status === 'Active').map((job) => ({
      id: `job-${job.id}`,
      kind: 'job',
      title: 'New job published',
      description: `${job.company || recruiterProfile?.company || 'Your company'} posted ${job.title}`,
      timestamp: job.createdAt,
    })),
  ].filter((event) => event.timestamp && !Number.isNaN(new Date(event.timestamp).getTime()))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

  const formatActivityTime = (timestamp) => {
    const elapsed = Math.max(0, Date.now() - new Date(timestamp).getTime());
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      if (selectedCandidate && selectedCandidate.id === appId) setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      showToast(`Applicant status updated to "${newStatus}"`, 'success');
    } catch (err) { showToast(err.message || 'Could not update application status.', 'warning'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Banner & Quick Action */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-ink tracking-tight">
            Recruiter Desk · {recruiterProfile?.company || 'TechNova Solutions'}
          </h1>
          <p className="text-mute mt-1 text-sm">
            Welcome back, {recruiterProfile?.first || 'Neha'}! Track campus hiring drives and evaluate candidate pipelines.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/recruiter/jobs/new')}
          className="shadow-sm"
        >
          Post a New Job
        </Button>
      </div>

      {applicationsError && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-err"><span>Applications could not be loaded: {applicationsError}</span><Button variant="ghost" size="sm" disabled={applicationsLoading} onClick={() => refreshApplications().catch(() => {})}>{applicationsLoading ? 'Refreshing…' : 'Retry'}</Button></div>}

      {/* 7 Required Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <StatCard
          icon={Briefcase}
          label="Total Jobs Posted"
          value={totalJobs}
          tone="bg-lav text-p"
          trend="All listings"
          className="min-w-0"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active Jobs"
          value={activeJobs}
          tone="bg-emerald-50 text-ok"
          trend="Live for students"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={Users}
          label="Applications Received"
          value={hasApplicationData ? totalApplications : '—'}
          tone="bg-indigo-50 text-indigo-600"
          trend={`+${applicationsThisWeek} this week`}
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={Clock}
          label="Pending / Review"
          value={hasApplicationData ? pendingCount : '—'}
          tone="bg-amber-50 text-warn"
          trend="Needs action"
          trendType="warning"
          className="min-w-0"
        />
        <StatCard
          icon={CheckCircle2}
          label="Shortlisted"
          value={hasApplicationData ? shortlistedCount : '—'}
          tone="bg-emerald-50 text-ok"
          trend="Interview stage"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted"
          value={hasApplicationData ? acceptedCount : '—'}
          tone="bg-emerald-100 text-emerald-800"
          trend="Offers rolled out"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={hasApplicationData ? rejectedCount : '—'}
          tone="bg-red-50 text-err"
          trend="Closed profiles"
          trendType="neutral"
          className="min-w-0"
        />
      </div>

      {/* Recent Applications Table */}
      <Card className="p-5">
        <CardHeader
          right={
            <button
              onClick={() => navigate('/recruiter/applications')}
              className="text-sm font-semibold text-p hover:underline flex items-center gap-1"
            >
              View All Applications <ArrowRight className="w-3.5 h-3.5" />
            </button>
          }
        >
          Recent Applications Received
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-mute border-b border-line uppercase tracking-wider">
                <th className="py-2.5 pr-4">Candidate</th>
                <th className="py-2.5 pr-4">Applied Role</th>
                <th className="py-2.5 pr-4">College & Degree</th>
                <th className="py-2.5 pr-4">Applied Date</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {applicationsLoading ? <tr><td colSpan="6" className="py-8 text-center text-sm text-mute">Loading applications…</td></tr>
                : applicationsError ? <tr><td colSpan="6" className="py-8 text-center text-sm text-err">Application data is unavailable. Use Retry above.</td></tr>
                  : recentApplications.length === 0 ? <tr><td colSpan="6" className="py-8 text-center text-sm text-mute">No applications have been submitted to your jobs yet.</td></tr>
                    : recentApplications.map((app) => (
                <tr key={app.id} className="hover:bg-bg/50 transition-colors group">
                  <td className="py-3.5 pr-4">
                    <p className="font-semibold text-ink leading-tight">{app.studentName}</p>
                    <p className="text-xs text-mute mt-0.5">{app.studentEmail}</p>
                  </td>
                  <td className="py-3.5 pr-4">
                    <p className="font-medium text-ink">{app.role}</p>
                    <p className="text-xs text-mute">{app.company}</p>
                  </td>
                  <td className="py-3.5 pr-4 text-xs">
                    <p className="text-ink font-medium">{app.college || 'Not provided'}</p>
                    <p className="text-mute">{app.degree || 'Not provided'}</p>
                  </td>
                  <td className="py-3.5 pr-4 text-xs text-mute font-medium">
                    {app.appliedDate || app.date}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge status={app.status}>{app.status}</Badge>
                  </td>
                  <td className="py-3.5 pr-2 text-right space-x-1.5">
                    <button
                      onClick={() => setResumeCandidate(app)}
                      className="p-1.5 rounded-lg text-mute hover:text-p hover:bg-lav transition-colors"
                      title="Preview Resume"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(app)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-lav text-p hover:bg-p hover:text-white transition-colors"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Two Columns: Recent Job Postings & Application Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <Card className="p-5">
          <CardHeader
            right={
              <button
                onClick={() => navigate('/recruiter/jobs')}
                className="text-sm font-semibold text-p hover:underline flex items-center gap-1"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            Active Job Postings
          </CardHeader>

          <div className="space-y-3">
            {recentJobs.map((job) => {
              const jobAppsCount = applications.filter((a) => a.jobId === job.id).length;
              return (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl border border-line bg-bg/40 hover:bg-bg transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-ink truncate">{job.title}</h4>
                      <Badge status={job.status}>{job.status}</Badge>
                    </div>
                    <p className="text-xs text-mute mt-0.5">
                      {job.loc} · {job.mode} · <span className="text-ink font-medium">{job.pay}</span>
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-p bg-lav px-2.5 py-1 rounded-lg block">
                      {jobAppsCount} Applicants
                    </span>
                    <span className="text-[11px] text-mute mt-1 block">
                      Deadline: {job.deadline || 'Dec 2026'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Application Activity */}
        <Card className="p-5">
          <CardHeader>Recent Recruitment Activity</CardHeader>

          <div className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-mute">New applications and published jobs will appear here.</p>
            ) : recentActivity.map((act) => {
              const Icon = act.kind === 'application' ? Users : Briefcase;
              return (
                <div key={act.id} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-lav text-p grid place-items-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink leading-tight">{act.title}</p>
                    <p className="text-xs text-mute mt-0.5">{act.description}</p>
                    <p className="text-[11px] text-mute/70 mt-0.5">{formatActivityTime(act.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Candidate Review Modal */}
      {selectedCandidate && (
        <CandidateModal
          application={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdateStatus={handleStatusChange}
          onViewResume={(cand) => {
            setSelectedCandidate(null);
            setResumeCandidate(cand);
          }}
        />
      )}

      {/* Resume Document Viewer */}
      {resumeCandidate && (
        <ResumePreviewModal
          candidate={resumeCandidate}
          onClose={() => setResumeCandidate(null)}
          onToast={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}

