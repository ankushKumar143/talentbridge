import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';
import JobCard from '../../components/student/JobCard';
import JobDetailModal from '../../components/student/JobDetailModal';
import ApplyConfirmModal from '../../components/student/ApplyConfirmModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

import { useJobs } from '../../context/JobContext';
import { useAuth } from '../../context/AuthContext';
import { useApplications } from '../../context/ApplicationContext';
import { useToast } from '../../context/ToastContext';

export default function StudentRecommendedJobs() {
  const { jobs, savedJobIds, toggleSaveJob } = useJobs();
  const { studentProfile } = useAuth();
  const { appliedJobIds, applyForJob } = useApplications();
  const { showToast } = useToast();

  const outlet = useOutletContext() || {};
  const [internalQ, setInternalQ] = useState('');
  const q = outlet.searchQuery !== undefined ? outlet.searchQuery : internalQ;
  const setQ = outlet.setSearchQuery !== undefined ? outlet.setSearchQuery : setInternalQ;

  const [jobType, setJobType] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState('All');
  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);

  // Sort by match percentage and filter
  const recommendedList = useMemo(() => {
    return [...jobs]
      .sort((a, b) => (b.match || 0) - (a.match || 0))
      .filter((job) => {
        if (job.status && job.status === 'Closed') return false;

        const matchesType = jobType === 'All' || job.type === jobType;
        const matchesMode = workMode === 'All' || job.mode === workMode;
        const matchesThreshold =
          minMatch === 'All'
            ? true
            : (job.match || 0) >= parseInt(minMatch, 10);

        const queryStr = (q || '').toLowerCase();
        const matchesQuery =
          !queryStr ||
          job.title.toLowerCase().includes(queryStr) ||
          job.company.toLowerCase().includes(queryStr) ||
          (job.skills && job.skills.some((s) => s.toLowerCase().includes(queryStr)));

        return matchesType && matchesMode && matchesThreshold && matchesQuery;
      });
  }, [jobs, q, jobType, workMode, minMatch]);

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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
          Recommended Jobs <Sparkles className="w-5 h-5 text-p" />
        </h1>
        <p className="text-mute text-sm mt-0.5">
          Curated opportunities matching your technical skills, branch, and career aspirations.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
          <input
            aria-label="Filter recommended jobs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search within recommendations..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-sm placeholder:text-mute focus:border-p focus:outline-none"
          />
        </div>

        <select
          aria-label="Match score filter"
          value={minMatch}
          onChange={(e) => setMinMatch(e.target.value)}
          className="h-10 px-3 rounded-xl border border-line bg-white text-sm font-medium text-ink focus:border-p focus:outline-none"
        >
          <option value="All">All Match %</option>
          <option value="90">90%+ Match (Top Fit)</option>
          <option value="80">80%+ Match</option>
          <option value="70">70%+ Match</option>
        </select>

        <select
          aria-label="Job type filter"
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="h-10 px-3 rounded-xl border border-line bg-white text-sm font-medium text-ink focus:border-p focus:outline-none"
        >
          <option value="All">All Types</option>
          <option value="Internship">Internship</option>
          <option value="Full-time">Full-time</option>
        </select>

        <select
          aria-label="Work mode filter"
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          className="h-10 px-3 rounded-xl border border-line bg-white text-sm font-medium text-ink focus:border-p focus:outline-none"
        >
          <option value="All">All Modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>

      {/* Grid */}
      {recommendedList.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Sparkles}
            title="No high-match jobs found"
            text="Try broadening your filters or adding additional technical skills to your profile to discover more matching roles."
            action={
              <Button
                variant="ghost"
                onClick={() => {
                  setQ('');
                  setJobType('All');
                  setWorkMode('All');
                  setMinMatch('All');
                }}
              >
                Reset filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recommendedList.map((job) => (
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
      )}

      {/* Modals */}
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

