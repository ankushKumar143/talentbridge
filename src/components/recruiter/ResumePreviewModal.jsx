import React, { useEffect, useState } from 'react';
import { Download, FileText, LoaderCircle } from 'lucide-react';
import Modal from '../common/Modal';
import { apiBlobRequest } from '../../api/client';

export default function ResumePreviewModal({ candidate, onClose }) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let objectUrl = '';
    apiBlobRequest(`/api/candidates/${candidate.id}/resume-file`).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch((err) => {
      if (active) setError(err.message || 'Could not load this resume.');
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [candidate.id]);

  const isPdf = /\.pdf$/i.test(candidate.resumeName || '');

  return <Modal title={`Resume · ${candidate.name}`} onClose={onClose} maxWidth="max-w-5xl">
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-line bg-bg"><div className="flex items-center gap-2 min-w-0"><FileText className="w-5 h-5 text-p shrink-0" /><span className="text-sm font-medium text-ink truncate">{candidate.resumeName || 'Resume file'}</span></div>{url && <a href={url} download={candidate.resumeName || 'resume'} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-p text-white text-xs font-semibold"><Download className="w-3.5 h-3.5" /> Download</a>}</div>
      {loading && <div className="h-40 grid place-items-center text-sm text-mute"><span className="inline-flex items-center gap-2"><LoaderCircle className="w-4 h-4 animate-spin" />Loading resume…</span></div>}
      {error && <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-err">{error}</p>}
      {!loading && url && (isPdf ? <iframe title={`${candidate.name} resume`} src={url} className="w-full h-[72vh] rounded-lg border border-line" /> : <div className="p-8 text-center text-sm text-mute">This file format cannot be previewed in the browser. Use Download to open it.</div>)}
    </div>
  </Modal>;
}
