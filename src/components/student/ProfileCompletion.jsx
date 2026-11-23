import React from 'react';
import { Check } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Button from '../common/Button';

export default function ProfileCompletion({ prof = {}, onComplete }) {
  const hasResume = Boolean(prof.resume);
  const hasEdu = Boolean(prof.edu || (prof.education && prof.education.length > 0));
  const hasSkills = Boolean(prof.skills && (typeof prof.skills === 'boolean' ? prof.skills : prof.skills.length > 0));
  const hasProj = Boolean(prof.proj || (prof.projects && prof.projects.length > 0));
  const hasCerts = Boolean(prof.certs && prof.certs.length > 0);

  const items = [
    { label: 'Resume uploaded', done: hasResume, weight: 25 },
    { label: 'Education details', done: hasEdu, weight: 20 },
    { label: 'Skills added', done: hasSkills, weight: 20 },
    { label: 'Projects showcase', done: hasProj, weight: 20 },
    { label: 'Certifications', done: hasCerts, weight: 15 },
  ];

  const pct = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <Card className="p-5 bg-lav/40 border-lav">
      <CardHeader>Profile checklist</CardHeader>
      <p className="text-xs text-mute -mt-2 mb-3">Tracks the items below; it is separate from your resume content score.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 100 100" className="-rotate-90 w-24 h-24">
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke="#6C5CE7"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - pct / 100)}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span
            role="img"
            aria-label={`${pct}% complete`}
            className="absolute inset-0 grid place-items-center text-xl font-bold text-ink"
          >
            {pct}%
          </span>
        </div>

        <ul className="space-y-1.5 text-sm flex-1 w-full">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <span
                className={`w-4 h-4 rounded-full grid place-items-center transition-colors ${
                  item.done
                    ? 'bg-ok text-white'
                    : 'border border-line bg-white text-transparent'
                }`}
              >
                {item.done && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </span>
              <span className={`text-[13px] ${item.done ? 'text-ink font-medium' : 'text-mute'}`}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {pct < 100 ? (
        <Button
          variant="primary"
          className="mt-4 w-full"
          onClick={onComplete}
        >
          Complete Profile
        </Button>
      ) : (
        <p className="mt-4 text-sm text-ok font-medium flex items-center justify-center gap-1.5 bg-emerald-50 py-2 rounded-xl border border-emerald-200/50">
          <Check className="w-4 h-4" /> Your profile is 100% complete!
        </p>
      )}
    </Card>
  );
}
