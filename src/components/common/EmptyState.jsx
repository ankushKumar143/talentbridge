import React from 'react';

export default function EmptyState({
  icon: Icon,
  title,
  text,
  action,
  className = ''
}) {
  return (
    <div className={`text-center py-10 px-4 ${className}`}>
      {Icon && (
        <div className="mx-auto w-12 h-12 rounded-full bg-lav text-p grid place-items-center mb-3">
          <Icon className="w-6 h-6" />
        </div>
      )}
      <p className="font-semibold text-ink text-base">{title}</p>
      {text && <p className="text-mute text-sm mt-1 mb-4 max-w-sm mx-auto">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
