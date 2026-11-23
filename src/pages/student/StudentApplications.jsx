import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, FileText } from 'lucide-react';
import ApplicationsTable from '../../components/student/ApplicationsTable';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

import { useApplications } from '../../context/ApplicationContext';
import { useJobs } from '../../context/JobContext';

export default function StudentApplications() {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const { jobs } = useJobs();

  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);

  const tabs = ['All', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'];

  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesTab = activeTab === 'All' || app.status === activeTab;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        app.company.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query);
      return matchesTab && matchesSearch;
    });
  }, [applications, activeTab, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">My Applications</h1>
          <p className="text-mute text-sm mt-0.5">
            Track hiring stages, feedback, and offers across all your company submissions.
          </p>
        </div>

        <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line self-start sm:self-auto">
          Total Applications: <b>{applications.length}</b>
        </span>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {tabs.map((tab) => {
            const count = tab === 'All'
              ? applications.length
              : applications.filter((a) => a.status === tab).length;

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

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company or role..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-xs placeholder:text-mute focus:border-p focus:outline-none"
          />
        </div>
      </div>

      {/* Applications Table */}
      <ApplicationsTable
        apps={filteredApps}
        onNavigate={navigate}
        jobs={jobs}
        onViewAppDetail={(app) => setSelectedApp(app)}
      />

      {/* Application Detail View Modal */}
      {selectedApp && (
        <Modal
          title="Application Status & Feedback"
          onClose={() => setSelectedApp(null)}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-lav/40 rounded-xl border border-lav">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-ink text-base">{selectedApp.role}</h3>
                  <p className="text-sm text-mute font-medium mt-0.5">{selectedApp.company}</p>
                </div>
                <Badge status={selectedApp.status}>{selectedApp.status}</Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-mute mt-3 pt-3 border-t border-lav">
                <Calendar className="w-3.5 h-3.5" />
                <span>Applied on {selectedApp.appliedDate || selectedApp.date}</span>
              </div>
            </div>

            {/* Recruiter Notes / Status timeline */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-mute uppercase tracking-wider">
                Recruiter Status Note
              </h4>
              <div className="p-3 bg-bg rounded-xl border border-line text-xs text-ink/90 leading-relaxed">
                {selectedApp.notes || 'Your application is progressing through our placement review cycle.'}
              </div>
            </div>

            <div className="p-3 bg-white rounded-xl border border-line space-y-1 text-xs">
              <span className="text-mute block font-medium">Submitted Resume:</span>
              <span className="text-p font-medium flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {selectedApp.resumeName || 'Aarav_Sharma_Resume.pdf'}
              </span>
            </div>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setSelectedApp(null)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
