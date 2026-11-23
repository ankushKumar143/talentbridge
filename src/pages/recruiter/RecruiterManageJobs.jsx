import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle,
  XCircle,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import JobPostForm from '../../components/recruiter/JobPostForm';

import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterManageJobs() {
  const navigate = useNavigate();
  const { jobs, updateJob, deleteJob, toggleJobStatus } = useJobs();
  const { applications } = useApplications();
  const { recruiterProfile } = useAuth();
  const { showToast } = useToast();

  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleSaveEdit = async (updatedJob, status) => {
    try { await updateJob({ ...updatedJob, status }); setEditingJob(null); showToast(`Updated "${updatedJob.title}" successfully`, 'success'); }
    catch (err) { showToast(err.message || 'Could not update job.', 'warning'); }
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try { await deleteJob(jobToDelete.id); showToast(`Deleted job "${jobToDelete.title}"`); setJobToDelete(null); }
    catch (err) { showToast(err.message || 'Could not delete job.', 'warning'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Manage Job Openings</h1>
          <p className="text-mute text-sm mt-0.5">
            Monitor, update, and manage candidate pipelines for all your active corporate listings.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/recruiter/jobs/new')}
        >
          Post New Position
        </Button>
      </div>

      {jobs.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Briefcase}
            title="No jobs posted yet"
            text="Publish an internship or full-time opening to begin receiving applications from qualified students."
            action={
              <Button onClick={() => navigate('/recruiter/jobs/new')}>
                Post Your First Job
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-left text-xs font-semibold text-mute border-b border-line uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Job Title & Details</th>
                  <th className="py-2.5 pr-4">Company</th>
                  <th className="py-2.5 pr-4">Posted Date</th>
                  <th className="py-2.5 pr-4">Deadline</th>
                  <th className="py-2.5 pr-4">Applicants</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {jobs.map((job) => {
                  const jobApps = applications.filter((a) => a.jobId === job.id);
                  const isClosed = job.status === 'Closed';

                  return (
                    <tr key={job.id} className="hover:bg-bg/50 transition-colors group">
                      <td className="py-3.5 pr-4">
                        <p className="font-semibold text-ink leading-tight">{job.title}</p>
                        <p className="text-xs text-mute mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-mute/80" />
                          {job.loc} â€¢ {job.mode} â€¢ {job.type}
                        </p>
                      </td>

                      <td className="py-3.5 pr-4 text-xs font-medium text-ink">
                        {job.company}
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-mute font-medium">
                        {job.postedDate || 'Recent'}
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-mute font-medium">
                        {job.deadline || 'Dec 2026'}
                      </td>

                      <td className="py-3.5 pr-4">
                        <button
                          onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lav text-p text-xs font-semibold hover:bg-p hover:text-white transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {jobApps.length} Applicants
                        </button>
                      </td>

                      <td className="py-3.5 pr-4">
                        <Badge status={job.status}>{job.status}</Badge>
                      </td>

                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate(`/recruiter/applications?jobId=${job.id}`)}
                            title="View Received Applications"
                            className="p-1.5 rounded-lg text-mute hover:text-p hover:bg-lav transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingJob(job)}
                            title="Edit Job"
                            className="p-1.5 rounded-lg text-mute hover:text-ink hover:bg-slate-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              toggleJobStatus(job.id).catch((err) => showToast(err.message || 'Could not update job status.', 'warning'));
                              showToast(`Job marked as ${isClosed ? 'Active' : 'Closed'}`);
                            }}
                            title={isClosed ? 'Reopen Job' : 'Close Job'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isClosed
                                ? 'text-ok hover:bg-emerald-50'
                                : 'text-warn hover:bg-amber-50'
                            }`}
                          >
                            {isClosed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            title="Delete Job"
                            className="p-1.5 rounded-lg text-mute hover:text-err hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Edit Job Modal */}
      {editingJob && (
        <Modal
          title={`Edit Job: ${editingJob.title}`}
          onClose={() => setEditingJob(null)}
          maxWidth="max-w-3xl"
        >
          <JobPostForm
            recruiter={recruiterProfile}
            initialData={editingJob}
            isEditing={true}
            onSubmitJob={handleSaveEdit}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {jobToDelete && (
        <Modal
          title="Confirm Delete Job"
          onClose={() => setJobToDelete(null)}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200 text-err">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold">Are you sure you want to delete this listing?</p>
                <p className="mt-1">
                  <b>{jobToDelete.title}</b> at {jobToDelete.company} will be permanently removed from student search listings.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <Button variant="ghost" onClick={() => setJobToDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="danger-solid"
                onClick={handleConfirmDelete}
              >
                Delete Job
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

