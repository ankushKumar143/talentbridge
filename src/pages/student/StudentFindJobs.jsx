import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Search, RotateCcw } from 'lucide-react';
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

export default function StudentFindJobs() {
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
  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);

  // Filter jobs by search query, job type, and work mode
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Only show Active jobs to students (or jobs without status)
      if (job.status && job.status === 'Closed') return false;

      const matchesType = jobType === 'All' || job.type === jobType;
      const matchesMode = workMode === 'All' || job.mode === workMode;
      const queryStr = (q || '').toLowerCase();
      const matchesQuery =
        !queryStr ||
        job.title.toLowerCase().includes(queryStr) ||
        job.company.toLowerCase().includes(queryStr) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(queryStr))) ||
        (job.loc && job.loc.toLowerCase().includes(queryStr));

      return matchesType && matchesMode && matchesQuery;
    });
  }, [jobs, q, jobType, workMode]);

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

  const handleClearFilters = () => {
    setQ('');
    setJobType('All');
    setWorkMode('All');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Find Jobs</h1>
          <p className="text-mute text-sm mt-0.5">
            Discover verified campus placement openings and internships.
          </p>
        </div>

        <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line self-start sm:self-auto">
          Showing <b>{filteredJobs.length}</b> of {jobs.length} jobs
        </span>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
          <input
            aria-label="Filter jobs"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter by title, company, or technical skill..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-sm placeholder:text-mute focus:border-p focus:outline-none transition-colors"
          />
        </div>

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

        {(q || jobType !== 'All' || workMode !== 'All') && (
          <Button
            variant="ghost"
            size="md"
            icon={RotateCcw}
            onClick={handleClearFilters}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Search}
            title="No matching jobs found"
            text="We couldn't find any opportunities matching your selected filter criteria. Try adjusting keywords or clearing filters."
            action={
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredJobs.map((job) => (
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

