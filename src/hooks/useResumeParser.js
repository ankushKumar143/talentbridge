import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

async function request(path, options) {
  let response;
  try { response = await fetch(`${API_BASE}${path}`, options); }
  catch { throw new Error('Resume service is unavailable. Start the Python backend and try again.'); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.detail || 'The request could not be completed.');
  return payload;
}

export function useResumeParser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const parseFile = async (file) => {
    setLoading(true); setError(''); setResult(null);
    const form = new FormData(); form.append('file', file);
    try {
      const token = localStorage.getItem('tb_access_token');
      const data = await request('/api/resumes/parse', { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: form });
      setResult(data); return data;
    } catch (err) { setError(err.message); return null; }
    finally { setLoading(false); }
  };
  return { loading, error, result, parseFile, clear: () => { setResult(null); setError(''); } };
}

export function rankCandidates(job, candidates) {
  return request('/api/candidates/rank', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ job: { description: [job.about, job.requirements].filter(Boolean).join('\n'), skills: job.skills || [] }, candidates }) });
}
