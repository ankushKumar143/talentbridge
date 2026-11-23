import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-300 shrink-0" />
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-2.5 bg-ink text-white text-sm px-4 py-3 rounded-xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-2 max-w-md w-auto"
    >
      {icons[type] || icons.info}
      <span className="font-normal text-[13px]">{message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss toast"
        className="ml-2 text-mute hover:text-white transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
