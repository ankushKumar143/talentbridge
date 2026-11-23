import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
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

export default function StudentSavedJobs() {
  const navigate = useNavigate();
  const { jobs, savedJobIds, toggleSaveJob } = useJobs();
  const { studentProfile } = useAuth();
  const { appliedJobIds, applyForJob } = useApplications();
  const { showToast } = useToast();

  const [selectedJob, setSelectedJob] = useState(null);
  const [confirmApplyJob, setConfirmApplyJob] = useState(null);

  const savedList = jobs.filter((j) => savedJobIds.has(j.id));

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            Saved Jobs <Bookmark className="w-5 h-5 text-p fill-p" />
          </h1>
          <p className="text-mute text-sm mt-0.5">
            Keep track of bookmarks and prepare customized applications before deadlines.
          </p>
        </div>

        <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line self-start sm:self-auto">
          Saved: <b>{savedList.length}</b>
        </span>
      </div>

      {savedList.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            text="Tap the bookmark icon on any job card to save it for quick review and preparation later."
            action={
              <Button onClick={() => navigate('/student/jobs')}>
                Browse Open Jobs
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              saved={true}
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

