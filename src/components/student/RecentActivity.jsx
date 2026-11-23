import React from 'react';
import { Send, FileText, CheckCircle2, User, Sparkles } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';

const ICON_MAP = {
  send: Send,
  file: FileText,
  check: CheckCircle2,
  user: User,
};

export default function RecentActivity({ activities = [] }) {
  return (
    <Card className="p-5">
      <CardHeader>Recent activity</CardHeader>
      
      {activities.length === 0 ? (
        <p className="text-xs text-mute py-4 text-center">No recent activity logged yet.</p>
      ) : (
        <ol className="space-y-4">
          {activities.map((a, index) => {
            const Icon = ICON_MAP[a.i] || Sparkles;
            const isLast = index === activities.length - 1;

            return (
              <li key={a.t + index} className="flex gap-3 group">
                <div className="flex flex-col items-center">
                  <span className="w-8 h-8 rounded-full bg-lav text-p grid place-items-center shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </span>
                  {!isLast && <span className="flex-1 w-px bg-line mt-1 min-h-[20px]" />}
                </div>

                <div className="pb-1 min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink leading-snug">{a.t}</p>
                  <p className="text-[13px] text-mute font-normal mt-0.5 break-words">{a.d}</p>
                  <p className="text-xs text-mute/80 mt-1">{a.w}</p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
