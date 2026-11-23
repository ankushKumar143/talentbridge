import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  tone = 'bg-lav text-p',
  trend,
  trendType = 'positive',
  className = ''
}) {
  const trendColor = trendType === 'positive' 
    ? 'text-ok' 
    : trendType === 'warning' 
    ? 'text-warn' 
    : 'text-mute';

  return (
    <div className={`bg-white border border-line rounded-2xl p-4 min-w-[150px] shadow-[0_1px_2px_rgba(32,32,57,0.03)] hover:border-slate-300 transition-colors ${className}`}>
      <div className={`w-9 h-9 rounded-xl grid place-items-center ${tone}`}>
        {Icon && <Icon className="w-[18px] h-[18px]" />}
      </div>
      <p className="text-[28px] font-semibold mt-3 leading-none text-ink tracking-tight">{value}</p>
      <p className="text-mute text-[13px] mt-1 font-medium">{label}</p>
      {trend && <p className={`text-xs mt-1 font-medium ${trendColor}`}>{trend}</p>}
    </div>
  );
}
