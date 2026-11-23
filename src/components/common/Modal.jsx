import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  title,
  onClose,
  children,
  maxWidth = 'max-w-lg',
  showClose = true
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4 bg-ink/40 backdrop-blur-[2px] transition-opacity animate-in fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6 shadow-xl border border-line relative`}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          {showClose && (
            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="text-mute hover:text-ink p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
