import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  FileText,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import CandidateModal from '../../components/recruiter/CandidateModal';
import ResumePreviewModal from '../../components/recruiter/ResumePreviewModal';

import { useApplications } from '../../context/ApplicationContext';
import { useJobs } from '../../context/JobContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterApplications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialJobFilter = searchParams.get('jobId') || 'All';

  const { applications, updateApplicationStatus } = useApplications();
  const { jobs } = useJobs();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState(initialJobFilter);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);

  const tabs = ['All Applications', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const tabKey = activeTab === 'All Applications' ? 'All' : activeTab;
      const matchesTab = tabKey === 'All' || app.status === tabKey;

      const matchesJob =
        selectedJobId === 'All' ||
        String(app.jobId) === String(selectedJobId);

      const query = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        app.studentName.toLowerCase().includes(query) ||
        app.studentEmail.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        (app.skills && app.skills.some((s) => s.toLowerCase().includes(query)));

      return matchesTab && matchesJob && matchesQuery;
    });
  }, [applications, activeTab, selectedJobId, searchQuery]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      if (selectedCandidate && selectedCandidate.id === appId) setSelectedCandidate({ ...selectedCandidate, status: newStatus });
      showToast(`Updated status to "${newStatus}"`, 'success');
    } catch (err) { showToast(err.message || 'Could not update application status.', 'warning'); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Applications Received</h1>
          <p className="text-mute text-sm mt-0.5">
            Review submissions, evaluate resumes, and manage applicant progression across hiring stages.
          </p>
        </div>

        <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line self-start sm:self-auto">
          Showing <b>{filteredApplications.length}</b> of {applications.length} applications
        </span>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="space-y-3">
        {/* Status Pipeline Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const tabKey = tab === 'All Applications' ? 'All' : tab;
            const count = tabKey === 'All'
              ? applications.length
              : applications.filter((a) => a.status === tabKey).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-p text-white shadow-sm'
                    : 'bg-white border border-line text-mute hover:text-ink hover:bg-slate-50'
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeTab === tab ? 'bg-white/20 text-white' : 'bg-bg text-mute'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls: Search & Job Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, email, role, or technical skill..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-xs placeholder:text-mute focus:border-p focus:outline-none"
            />
          </div>

          <div className="sm:w-64">
            <select
              aria-label="Filter by Job"
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams(e.target.value === 'All' ? {} : { jobId: e.target.value });
              }}
              className="w-full h-10 px-3 rounded-xl border border-line bg-white text-xs font-medium text-ink focus:border-p focus:outline-none"
            >
              <option value="All">All Job Postings</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Users}
            title="No applications in this category"
            text="Try clearing your search query or switching status filters to view all submissions."
            action={
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveTab('All Applications');
                  setSelectedJobId('All');
                  setSearchQuery('');
                  setSearchParams({});
                }}
              >
                Reset Filters
              </Button>
            }
          />
        </Card>
      ) : (
        <Card className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[780px]">
              <thead>
                <tr className="text-left text-xs font-semibold text-mute border-b border-line uppercase tracking-wider">
                  <th className="py-2.5 pr-4">Student Name & Contact</th>
                  <th className="py-2.5 pr-4">Education & CGPA</th>
                  <th className="py-2.5 pr-4">Skills</th>
                  <th className="py-2.5 pr-4">Applied Job</th>
                  <th className="py-2.5 pr-4">Resume</th>
                  <th className="py-2.5 pr-4">Applied Date</th>
                  <th className="py-2.5 pr-4">Status</th>
                  <th className="py-2.5 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-bg/50 transition-colors group">
                    <td className="py-3.5 pr-4">
                      <p className="font-semibold text-ink leading-tight">{app.studentName}</p>
                      <p className="text-xs text-mute mt-0.5">{app.studentEmail}</p>
                    </td>

                    <td className="py-3.5 pr-4 text-xs">
                      <p className="font-medium text-ink">{app.college || 'NIT'}</p>
                      <p className="text-mute">{app.degree || 'B.Tech CSE'}</p>
                    </td>

                    <td className="py-3.5 pr-4">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {app.skills?.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="text-[11px] px-2 py-0.5 rounded bg-bg border border-line text-ink"
                          >
                            {s}
                          </span>
                        ))}
                        {app.skills && app.skills.length > 3 && (
                          <span className="text-[10px] text-mute font-medium self-center">
                            +{app.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 text-xs">
                      <p className="font-semibold text-ink">{app.role}</p>
                      <p className="text-mute">{app.company}</p>
                    </td>

                    <td className="py-3.5 pr-4">
                      <button
                        type="button"
                        onClick={() => setResumeCandidate(app)}
                        className="text-xs text-p hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Preview
                      </button>
                    </td>

                    <td className="py-3.5 pr-4 text-xs text-mute font-medium">
                      {app.appliedDate || app.date}
                    </td>

                    <td className="py-3.5 pr-4">
                      <Badge status={app.status}>{app.status}</Badge>
                    </td>

                    <td className="py-3.5 pr-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCandidate(app)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-lav text-p hover:bg-p hover:text-white transition-colors"
                        >
                          Profile
                        </button>

                        <select
                          aria-label="Change Status"
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="h-7 text-[11px] font-semibold px-1.5 rounded-lg border border-line bg-white text-ink focus:border-p focus:outline-none"
                        >
                          <option value="Under Review">Review</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Accepted">Accept</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

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

