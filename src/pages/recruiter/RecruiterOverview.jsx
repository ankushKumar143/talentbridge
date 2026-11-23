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
  Building2,
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
  const { applications, updateApplicationStatus } = useApplications();
  const { showToast } = useToast();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);

  // Dynamic Metrics Calculation directly from shared Context state
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const totalApplications = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const acceptedCount = applications.filter((a) => a.status === 'Accepted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;
  const pendingCount = applications.filter(
    (a) => a.status === 'Under Review' || a.status === 'Applied'
  ).length;

  const recentApplications = applications.slice(0, 5);
  const recentJobs = jobs.slice(0, 3);

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
            Recruiter Desk â€¢ {recruiterProfile?.company || 'TechNova Solutions'} ðŸ¢
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
          value={totalApplications}
          tone="bg-indigo-50 text-indigo-600"
          trend="+5 this week"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={Clock}
          label="Pending / Review"
          value={pendingCount}
          tone="bg-amber-50 text-warn"
          trend="Needs action"
          trendType="warning"
          className="min-w-0"
        />
        <StatCard
          icon={CheckCircle2}
          label="Shortlisted"
          value={shortlistedCount}
          tone="bg-emerald-50 text-ok"
          trend="Interview stage"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={CheckCircle2}
          label="Accepted"
          value={acceptedCount}
          tone="bg-emerald-100 text-emerald-800"
          trend="Offers rolled out"
          trendType="positive"
          className="min-w-0"
        />
        <StatCard
          icon={XCircle}
          label="Rejected"
          value={rejectedCount}
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
              {recentApplications.map((app) => (
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
                    <p className="text-ink font-medium">{app.college || 'NIT'}</p>
                    <p className="text-mute">{app.degree || 'B.Tech CSE'}</p>
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
                      {job.loc} â€¢ {job.mode} â€¢ <span className="text-ink font-medium">{job.pay}</span>
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
          <CardHeader>Live Recruitment Activity</CardHeader>

          <div className="space-y-4">
            {[
              {
                title: 'New candidate applied',
                desc: 'Aarav Sharma applied for Frontend Developer Intern',
                time: '15 mins ago',
                icon: Users
              },
              {
                title: 'Interview feedback logged',
                desc: 'Rhea Sengupta moved to Shortlisted stage',
                time: '2 hours ago',
                icon: CheckCircle2
              },
              {
                title: 'New job published',
                desc: 'Node.js Backend Developer drive opened to campus',
                time: '1 day ago',
                icon: Briefcase
              },
              {
                title: 'Offer accepted',
                desc: 'Kunal Patel accepted Frontend Developer Intern offer',
                time: '2 days ago',
                icon: Building2
              }
            ].map((act, idx) => {
              const Icon = act.icon;
              return (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-lav text-p grid place-items-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink leading-tight">{act.title}</p>
                    <p className="text-xs text-mute mt-0.5">{act.desc}</p>
                    <p className="text-[11px] text-mute/70 mt-0.5">{act.time}</p>
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

