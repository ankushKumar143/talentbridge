import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  className = '',
  status,
  match,
}) {
  let computedStyles = 'bg-lav text-p';

  if (status) {
    switch (status) {
      case 'Applied':
        computedStyles = 'bg-lav text-p border border-lav';
        break;
      case 'Under Review':
        computedStyles = 'bg-amber-50 text-warn border border-amber-200/50';
        break;
      case 'Shortlisted':
        computedStyles = 'bg-emerald-50 text-ok border border-emerald-200/50';
        break;
      case 'Accepted':
        computedStyles = 'bg-emerald-100 text-emerald-800 border border-emerald-300/60 font-semibold';
        break;
      case 'Rejected':
        computedStyles = 'bg-red-50 text-err border border-red-200/50';
        break;
      case 'Active':
        computedStyles = 'bg-emerald-50 text-ok border border-emerald-200/50';
        break;
      case 'Closed':
        computedStyles = 'bg-slate-100 text-mute border border-line';
        break;
      case 'Draft':
        computedStyles = 'bg-amber-50 text-warn border border-amber-200/50';
        break;
      default:
        computedStyles = 'bg-slate-100 text-mute';
    }
  } else if (match !== undefined) {
    if (match >= 90) {
      computedStyles = 'bg-emerald-50 text-ok border border-emerald-200/40';
    } else if (match >= 80) {
      computedStyles = 'bg-lav text-p border border-lav';
    } else {
      computedStyles = 'bg-amber-50 text-warn border border-amber-200/40';
    }
  } else {
    switch (variant) {
      case 'primary':
        computedStyles = 'bg-lav text-p';
        break;
      case 'success':
        computedStyles = 'bg-emerald-50 text-ok';
        break;
      case 'warning':
        computedStyles = 'bg-amber-50 text-warn';
        break;
      case 'danger':
        computedStyles = 'bg-red-50 text-err';
        break;
      case 'neutral':
        computedStyles = 'bg-bg text-mute border border-line';
        break;
      case 'pill':
        computedStyles = 'bg-[#F2EFFE] text-[#5542D0] font-medium';
        break;
      default:
        computedStyles = 'bg-bg text-mute';
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight ${computedStyles} ${className}`}
    >
      {match !== undefined && <span className="mr-1">✦</span>}
      {children}
    </span>
  );
}
