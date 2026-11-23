import React from 'react';
import { Eye, Send } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';

export default function ApplicationsTable({
  apps = [],
  limit,
  onNavigate,
  jobs = [],
  onViewJob,
  onViewAppDetail
}) {
  const rows = limit ? apps.slice(0, limit) : apps;

  const handleAction = (app) => {
    if (onViewAppDetail) {
      onViewAppDetail(app);
      return;
    }
    const matchingJob = jobs.find(
      (j) => j.id === app.jobId || j.company.toLowerCase() === app.company.toLowerCase()
    );
    if (matchingJob && onViewJob) {
      onViewJob(matchingJob);
    } else if (onNavigate) {
      onNavigate('/student/jobs');
    }
  };

  return (
    <Card className="p-5">
      <CardHeader
        right={
          limit && (
            <button
              onClick={() => onNavigate && onNavigate('/student/applications')}
              className="text-sm font-semibold text-p hover:underline"
            >
              View All Applications
            </button>
          )
        }
      >
        {limit ? 'Recent applications' : 'My applications'}
      </CardHeader>

      {rows.length === 0 ? (
        <EmptyState
          icon={Send}
          title="No applications yet"
          text="Explore open positions, apply with your verified profile, and track application milestones right here."
          action={
            <Button onClick={() => onNavigate && onNavigate('/student/jobs')}>
              Find Jobs
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="text-left text-xs font-semibold text-mute border-b border-line uppercase tracking-wider">
                <th className="py-2.5 pr-4">Company</th>
                <th className="py-2.5 pr-4">Job Role</th>
                <th className="py-2.5 pr-4">Applied Date</th>
                <th className="py-2.5 pr-4">Status</th>
                <th className="py-2.5 pr-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {rows.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-bg/50 transition-colors group"
                >
                  <td className="py-3.5 pr-4 font-semibold text-ink">
                    {app.company}
                  </td>
                  <td className="py-3.5 pr-4 text-ink font-normal">
                    {app.role}
                  </td>
                  <td className="py-3.5 pr-4 text-mute text-xs font-medium">
                    {app.appliedDate || app.date}
                  </td>
                  <td className="py-3.5 pr-4">
                    <Badge status={app.status}>{app.status}</Badge>
                  </td>
                  <td className="py-3.5 pr-2 text-right">
                    <button
                      onClick={() => handleAction(app)}
                      className="text-p font-semibold hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
