import React from 'react';
import { Bookmark, MapPin, Check } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function JobCard({
  job,
  saved = false,
  applied = false,
  onSave,
  onView,
  onApply
}) {
  const getInitials = (company) => {
    if (!company) return 'TB';
    return company
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <article className="bg-white border border-line rounded-2xl p-5 flex flex-col hover:border-p2 hover:shadow-[0_4px_16px_rgba(108,92,231,0.06)] transition-all duration-200 group">
      {/* Top Header: Company logo monogram, title, company, bookmark */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-lav text-p grid place-items-center font-semibold text-sm shrink-0 group-hover:bg-[#E7E2FD] transition-colors">
          {getInitials(job.company)}
        </div>
        
        <div className="min-w-0 flex-1">
          <h3
            onClick={() => onView && onView(job)}
            className="font-semibold text-ink text-base leading-snug truncate cursor-pointer hover:text-p transition-colors"
          >
            {job.title}
          </h3>
          <p className="text-mute text-[13px] font-medium">{job.company}</p>
        </div>

        <button
          type="button"
          aria-label={saved ? 'Remove from saved' : 'Save job'}
          aria-pressed={saved}
          onClick={(e) => {
            e.stopPropagation();
            if (onSave) onSave(job.id);
          }}
          className={`p-1.5 rounded-lg transition-colors ${
            saved
              ? 'text-p bg-lav/60'
              : 'text-mute hover:text-p hover:bg-lav/30'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${saved ? 'fill-p text-p' : ''}`} />
        </button>
      </div>

      {/* Badges: Match, Mode, Type */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        {job.match == null ? <Badge variant="neutral">Resume match unavailable</Badge> : <Badge match={job.match}>{Math.round(job.match)}% resume match</Badge>}
        <Badge variant="neutral">{job.mode}</Badge>
        <Badge variant="neutral">{job.type}</Badge>
      </div>
      {job.matchDetails?.skill_gap_summary && <p className="text-xs text-mute mt-2">
        {job.matchDetails.skill_gap_summary.matched_count} skills matched · {job.matchDetails.skill_gap_summary.profile_only_count} profile-only · {job.matchDetails.skill_gap_summary.missing_count} gaps
      </p>}

      {/* Location and Compensation */}
      <p className="flex items-center gap-1.5 text-[13px] text-mute mt-3 font-normal">
        <MapPin className="w-3.5 h-3.5 text-mute/80 shrink-0" />
        <span>{job.loc}</span>
        <span className="text-line mx-0.5">•</span>
        <span className="text-ink font-semibold">{job.pay}</span>
      </p>

      {/* Required Skill Pills */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {job.skills &&
          job.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs px-2 py-0.5 rounded-lg border border-line bg-bg/50 text-ink/80 font-normal"
            >
              {skill}
            </span>
          ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-line/40 mt-4">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => onView && onView(job)}
        >
          View Details
        </Button>
        <Button
          variant={applied ? 'secondary' : 'primary'}
          className={`flex-1 ${applied ? 'cursor-default' : ''}`}
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
    </article>
  );
}
