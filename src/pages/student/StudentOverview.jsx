import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Upload, Search, Send, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import ProfileCompletion from '../../components/student/ProfileCompletion';
import JobCard from '../../components/student/JobCard';
import SkillsOverview from '../../components/student/SkillsOverview';
import RecentActivity from '../../components/student/RecentActivity';
import ApplicationsTable from '../../components/student/ApplicationsTable';
import JobDetailModal from '../../components/student/JobDetailModal';
import ApplyConfirmModal from '../../components/student/ApplyConfirmModal';

import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';

export default function StudentOverview() {
  const navigate = useNavigate();
  const outlet = useOutletContext() || {};

  const { studentProfile, updateStudentProfile } = useAuth();
  const { jobs, savedJobIds, toggleSaveJob } = useJobs();
  const { applications, appliedJobIds, applyForJob, activities } = useApplications();
  const { showToast } = useToast();

  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);

  // Dynamic Metrics Calculation from live Context Data
  const totalApps = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const handleApplyClick = (job) => {
    setSelectedJob(null);
    setConfirmApplyJob(job);
  };

  const handleConfirmApplication = async (job) => {
    const result = await applyForJob(job, studentProfile);
    setConfirmApplyJob(null);
    showToast(result.message, result.success ? 'success' : 'warning');
  };

  const handleSaveToggle = (jobId) => {
    const isSaved = toggleSaveJob(jobId);
    showToast(isSaved ? 'Job saved to your bookmarks' : 'Removed from saved jobs');
  };

  // Top recommended jobs (sorted by match score)
  const recommendedJobs = [...jobs]
    .sort((a, b) => (b.match || 0) - (a.match || 0))
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Welcome Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-ink tracking-tight">
            Good morning, {studentProfile?.first || 'Aarav'}! ðŸ‘‹
          </h1>
          <p className="text-mute mt-1 text-sm">
            Ready to take the next step in your career?
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="ghost"
            onClick={() => navigate('/student/resume')}
            icon={Upload}
          >
            Upload Resume
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/student/jobs')}
            icon={Search}
          >
            Explore Jobs
          </Button>
        </div>
      </div>

      {/* Top Grid: Profile Completion & Dynamic Application Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCompletion
          prof={studentProfile}
          onComplete={() => {
            if (outlet.setIsCertModalOpen) {
              outlet.setIsCertModalOpen(true);
            } else {
              navigate('/student/profile');
            }
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={Send}
            label="Total Applications"
            value={totalApps}
            tone="bg-lav text-p"
            trend="+2 this week"
            trendType="positive"
          />
          <StatCard
            icon={Clock}
            label="Under Review"
            value={underReviewCount}
            tone="bg-amber-50 text-warn"
            trend="Recruiter review in progress"
            trendType="warning"
          />
          <StatCard
            icon={CheckCircle2}
            label="Shortlisted"
            value={shortlistedCount}
            tone="bg-emerald-50 text-ok"
            trend="+1 this week"
            trendType="positive"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={rejectedCount}
            tone="bg-red-50 text-err"
            trend="Keep exploring opportunities"
            trendType="neutral"
          />
        </div>
      </div>

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink tracking-tight">
            Recommended for you
          </h2>
          <button
            onClick={() => navigate('/student/jobs')}
            className="text-sm font-semibold text-p hover:underline"
          >
            View All Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={savedJobIds.has(job.id)}
              applied={appliedJobIds.has(job.id)}
              onSave={handleSaveToggle}
              onView={(j) => setSelectedJob(j)}
              onApply={handleApplyClick}
            />
          ))}
        </div>
      </div>

      {/* Skills Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsOverview
          skills={studentProfile?.skills || []}
          setSkills={(newSkills) => updateStudentProfile({ skills: newSkills })}
          onToast={(msg) => showToast(msg)}
        />
        <RecentActivity activities={activities} />
      </div>

      {/* Recent Applications Table */}
      <ApplicationsTable
        apps={applications}
        limit={4}
        onNavigate={navigate}
        jobs={jobs}
        onViewJob={(j) => setSelectedJob(j)}
      />

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          saved={savedJobIds.has(selectedJob.id)}
          applied={appliedJobIds.has(selectedJob.id)}
          onSave={handleSaveToggle}
          onApply={handleApplyClick}
        />
      )}

      {/* Confirm Apply Modal */}
      {confirmApplyJob && (
        <ApplyConfirmModal
          job={confirmApplyJob}
          student={studentProfile}
          onClose={() => setConfirmApplyJob(null)}
          onConfirm={handleConfirmApplication}
        />
      )}
    </div>
  );
}

