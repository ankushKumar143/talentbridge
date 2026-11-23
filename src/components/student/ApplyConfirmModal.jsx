import React from 'react';
import { FileText, Building2, UserCheck, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ApplyConfirmModal({
  job,
  student,
  onClose,
  onConfirm
}) {
  if (!job) return null;

  return (
    <Modal title="Confirm Job Application" onClose={onClose} maxWidth="max-w-md">
      <div className="space-y-4">
        <div className="p-3.5 bg-lav/40 rounded-xl border border-lav flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-p text-white grid place-items-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink leading-snug">{job.title}</p>
            <p className="text-xs text-mute font-medium">{job.company} • {job.loc}</p>
            <p className="text-xs text-p font-semibold mt-1">{job.pay}</p>
          </div>
        </div>

        {/* Student details submitted */}
        <div className="bg-bg p-3.5 rounded-xl border border-line space-y-2 text-xs">
          <div className="flex items-center justify-between text-mute">
            <span className="flex items-center gap-1.5 font-medium text-ink">
              <UserCheck className="w-3.5 h-3.5 text-p" /> Applicant Profile:
            </span>
            <span className="font-semibold text-ink">{student?.name || 'Aarav Sharma'}</span>
          </div>

          <div className="flex items-center justify-between text-mute">
            <span>Email:</span>
            <span className="text-ink">{student?.email || 'student@talentbridge.demo'}</span>
          </div>

          <div className="flex items-center justify-between text-mute">
            <span>College / Degree:</span>
            <span className="text-ink">{student?.degree || 'B.Tech CSE (8.7 CGPA)'}</span>
          </div>

          <div className="flex items-center justify-between text-mute pt-1 border-t border-line">
            <span className="flex items-center gap-1.5 font-medium text-ink">
              <FileText className="w-3.5 h-3.5 text-p" /> Attached Resume:
            </span>
            <span className="text-p font-medium">
              {student?.resume?.fileName || 'Aarav_Sharma_Resume.pdf'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-mute bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/50">
          <AlertCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
          <span>
            This application will be instantly delivered to the Recruiter Dashboard and recorded under your applications.
          </span>
        </div>

        <div className="flex gap-2.5 pt-2">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => onConfirm(job)}
          >
            Submit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
}
