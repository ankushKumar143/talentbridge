import React from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  FileText,
  Award,
  FolderGit2,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function CandidateModal({
  application,
  studentProfile,
  onClose,
  onUpdateStatus,
  onViewResume
}) {
  if (!application) return null;

  const currentStatus = application.status;

  return (
    <Modal
      title="Candidate Profile & Application"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="p-4 bg-lav/40 rounded-2xl border border-lav flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-p text-white grid place-items-center font-bold text-base shadow-sm shrink-0">
              {application.studentName?.slice(0, 2).toUpperCase() || 'ST'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-ink">{application.studentName}</h3>
                <ShieldCheck className="w-4 h-4 text-p" title="Verified Candidate" />
              </div>
              <p className="text-xs text-mute mt-0.5">
                Applied for: <b className="text-ink">{application.role}</b> ({application.company})
              </p>
              <p className="text-[11px] text-mute">Applied on {application.appliedDate || application.date}</p>
            </div>
          </div>

          <Badge status={currentStatus}>{currentStatus}</Badge>
        </div>

        {/* Academic and Contact Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-bg rounded-xl border border-line">
            <span className="text-mute block font-medium">Institution & Degree</span>
            <span className="font-semibold text-ink mt-0.5 block">{application.college || 'National Institute of Technology'}</span>
            <span className="text-mute/80 block mt-0.5">{application.degree || 'B.Tech CSE'}</span>
          </div>

          <div className="p-3 bg-bg rounded-xl border border-line">
            <span className="text-mute block font-medium">Contact Details</span>
            <span className="font-medium text-ink mt-0.5 block truncate">{application.studentEmail}</span>
            <span className="text-mute/80 block mt-0.5">{application.studentPhone || '+91 98765 43210'}</span>
          </div>

          <div className="p-3 bg-bg rounded-xl border border-line">
            <span className="text-mute block font-medium">Resume File</span>
            <span className="font-semibold text-p mt-0.5 block truncate flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {application.resumeName || 'Aarav_Sharma_Resume.pdf'}
            </span>
            <button
              type="button"
              onClick={() => onViewResume && onViewResume(application)}
              className="text-[11px] text-p font-semibold hover:underline mt-1 block"
            >
              View Document Preview →
            </button>
          </div>
        </div>

        {/* Verified Technical Skills */}
        <div>
          <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">
            Verified Candidate Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {application.skills &&
              application.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2.5 py-1 rounded-lg border border-line bg-white font-medium text-ink shadow-sm"
                >
                  {skill}
                </span>
              ))}
          </div>
        </div>

        {/* Recruiter Status Pipeline Actions */}
        <div className="p-4 bg-bg rounded-2xl border border-line space-y-2.5">
          <h4 className="text-xs font-semibold text-ink uppercase tracking-wider">
            Move Application Pipeline Status
          </h4>
          <p className="text-xs text-mute">
            Updating the status here immediately synchronizes with the student's dashboard in real time.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onUpdateStatus(application.id, 'Under Review')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border ${
                currentStatus === 'Under Review'
                  ? 'bg-amber-100 text-warn border-warn'
                  : 'bg-white text-ink border-line hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Under Review
            </button>

            <button
              type="button"
              onClick={() => onUpdateStatus(application.id, 'Shortlisted')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border ${
                currentStatus === 'Shortlisted'
                  ? 'bg-emerald-100 text-ok border-ok'
                  : 'bg-white text-ink border-line hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Shortlist
            </button>

            <button
              type="button"
              onClick={() => onUpdateStatus(application.id, 'Accepted')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border ${
                currentStatus === 'Accepted'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-emerald-700 border-line hover:bg-emerald-50'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              Accept / Offer
            </button>

            <button
              type="button"
              onClick={() => onUpdateStatus(application.id, 'Rejected')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 border ${
                currentStatus === 'Rejected'
                  ? 'bg-red-100 text-err border-err'
                  : 'bg-white text-ink border-line hover:bg-red-50'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-line">
          <Button variant="ghost" onClick={onClose}>
            Close Window
          </Button>
        </div>
      </div>
    </Modal>
  );
}
