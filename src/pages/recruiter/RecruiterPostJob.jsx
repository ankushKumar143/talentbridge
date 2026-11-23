import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import JobPostForm from '../../components/recruiter/JobPostForm';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterPostJob() {
  const navigate = useNavigate();
  const { recruiterProfile } = useAuth();
  const { addJob } = useJobs();
  const { showToast } = useToast();

  const handleJobCreated = async (newJob, status) => {
    try { await addJob(newJob); } catch (err) { showToast(err.message || "Could not save the job.", "error"); return; }
    showToast(
      status === 'Draft'
        ? `Job "${newJob.title}" saved as draft.`
        : `Job "${newJob.title}" published! It is now immediately visible to students.`,
      'success'
    );
    navigate('/recruiter/jobs');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/recruiter/jobs')}
            className="text-xs text-mute hover:text-p flex items-center gap-1 mb-2 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Manage Jobs
          </button>
          <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
            Post a New Job Opening <PlusCircle className="w-5 h-5 text-p" />
          </h1>
          <p className="text-mute text-sm mt-0.5">
            Fill in job requirements, required skill proficiencies, and deadlines to match with candidates.
          </p>
        </div>
      </div>

      <JobPostForm
        recruiter={recruiterProfile}
        onSubmitJob={handleJobCreated}
      />
    </div>
  );
}



