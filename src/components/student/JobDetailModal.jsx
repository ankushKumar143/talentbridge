import React from 'react';
import { MapPin, Calendar, Users, Award, Bookmark, Check } from 'lucide-react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function JobDetailModal({
  job,
  onClose,
  saved = false,
  applied = false,
  onSave,
  onApply
}) {
  if (!job) return null;

  return (
    <Modal title={job.title} onClose={onClose} maxWidth="max-w-xl">
      <div className="space-y-4">
        {/* Subhead info */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
          <div>
            <p className="text-base font-semibold text-ink">{job.company}</p>
            <p className="text-mute text-xs flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              {job.loc} • {job.mode} • {job.type}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-mute block">Compensation</span>
            <span className="text-sm font-bold text-ink">{job.pay}</span>
          </div>
        </div>

        {/* Badges bar */}
        <div className="flex flex-wrap items-center gap-2">
          {job.match == null ? <Badge variant="neutral">Upload resume for match score</Badge> : <Badge match={job.match}>{Math.round(job.match)}% resume match</Badge>}
          <Badge variant="neutral">{job.mode}</Badge>
          <Badge variant="neutral">{job.type}</Badge>
          {job.openings && (
            <Badge variant="neutral">
              <Users className="w-3 h-3 mr-1" /> {job.openings} Openings
            </Badge>
          )}
          {job.deadline && (
            <Badge variant="neutral">
              <Calendar className="w-3 h-3 mr-1" /> Deadline: {job.deadline}
            </Badge>
          )}
        </div>

        {job.matchDetails && <div className="rounded-xl border border-lav bg-lav/30 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div><h4 className="text-sm font-semibold text-ink">Resume skill-gap analysis</h4>
              <p className="text-xs text-mute mt-0.5">Weighted skill coverage: 60% required · 30% preferred · 10% other</p></div>
            <span className="text-lg font-bold text-p">{Math.round(job.matchDetails.score)}%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {Object.entries(job.matchDetails.skill_gap_summary?.categories || {}).map(([category, result]) => <div key={category} className="rounded-lg bg-white/80 border border-line p-2.5">
              <p className="font-semibold text-ink capitalize">{category.replace('_skills', '')}</p>
              <p className="text-ok mt-1">Supported: {result.supported?.join(', ') || 'None'}</p>
              {result.profile_only?.length > 0 && <p className="text-amber-700 mt-1">Profile only: {result.profile_only.join(', ')}</p>}
              {result.missing?.length > 0 && <p className="text-err mt-1">Missing: {result.missing.join(', ')}</p>}
            </div>)}
          </div>
          {job.matchDetails.skill_gap_summary?.profile_extraction_gaps?.length > 0 && <p className="text-xs text-mute">These skills appear in your resume profile but have no supporting experience or project evidence: {job.matchDetails.skill_gap_summary.profile_extraction_gaps.join(', ')}.</p>}
          <p className="text-[11px] text-mute">This guidance is based on resume text. Confirm final eligibility against the recruiter's criteria.</p>
        </div>}

        {/* About the role */}
        <div>
          <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-1.5">
            About the Role
          </h4>
          <p className="text-sm text-ink leading-relaxed">{job.about}</p>
        </div>

        {/* Requirements */}
        {job.requirements && (
          <div>
            <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-1.5">
              Requirements
            </h4>
            <p className="text-sm text-ink/90 leading-relaxed bg-bg p-3 rounded-xl border border-line">
              {job.requirements}
            </p>
          </div>
        )}

        {/* Eligibility & Experience */}
        {(job.eligibility || job.experience) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-lav/30 p-3 rounded-xl border border-lav">
            {job.eligibility && (
              <div>
                <span className="font-semibold text-p block flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Eligibility
                </span>
                <span className="text-ink mt-0.5 block">{job.eligibility}</span>
              </div>
            )}
            {job.experience && (
              <div>
                <span className="font-semibold text-p block">Experience</span>
                <span className="text-ink mt-0.5 block">{job.experience}</span>
              </div>
            )}
          </div>
        )}

        {/* Required skills */}
        <div>
          <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {job.skills &&
              job.skills.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2.5 py-1 rounded-lg border border-line bg-white font-medium text-ink shadow-sm"
                >
                  {s}
                </span>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-line">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => onSave && onSave(job.id)}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-p text-p' : ''}`} />
            {saved ? 'Unsave Job' : 'Save Job'}
          </Button>

          <Button
            variant={applied ? 'secondary' : 'primary'}
            className="flex-1"
            disabled={applied}
            onClick={() => onApply && onApply(job)}
          >
            {applied ? (
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-p" /> Applied
              </span>
            ) : (
              'Apply Now'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
