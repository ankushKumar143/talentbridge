import React, { useEffect, useState } from 'react';
import { Upload, FileText, Trash2, CheckCircle2, AlertCircle, LoaderCircle, Sparkles, Eye, Download } from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useResumeParser } from '../../hooks/useResumeParser';
import { apiBlobRequest, apiRequest } from '../../api/client';

export default function StudentResume() {
  const { studentProfile, updateStudentProfile } = useAuth();
  const { showToast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState('');
  const { loading, error, result, parseFile, clear } = useResumeParser();
  const currentResume = studentProfile?.resume;
  const previewable = /\.(pdf|txt)$/i.test(currentResume?.fileName || '');

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleFile = async (file) => {
    if (!file) return;
    const parsed = await parseFile(file);
    if (parsed) {
      updateStudentProfile({ resume: { fileName: parsed.file_name, fileId: parsed.file_id, fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`, uploadedAt: 'Just now', parsed } });
      showToast(`"${file.name}" parsed successfully`, 'success');
    }
  };
  const handleViewOriginal = async () => {
    setPreviewLoading(true); setPreviewError('');
    try {
      const blob = await apiBlobRequest('/api/resumes/file');
      const nextUrl = URL.createObjectURL(blob);
      setPreviewUrl((previous) => { if (previous) URL.revokeObjectURL(previous); return nextUrl; });
      setPreviewOpen(true);
    } catch (err) { setPreviewError(err.message); }
    finally { setPreviewLoading(false); }
  };
  const handleRemove = async () => {
    try { if (currentResume?.fileId) await apiRequest('/api/resumes/file', { method: 'DELETE' }); }
    catch (err) { showToast(`Could not remove the original file: ${err.message}`, 'warning'); return; }
    updateStudentProfile({ resume: null, skills: (studentProfile?.skills || []).filter((skill) => skill?.source !== 'resume') });
    clear(); showToast('Resume removed');
  };
  const parsed = result || currentResume?.parsed;

  return <div className="space-y-6 max-w-3xl animate-in fade-in duration-200">
    <div><h1 className="text-2xl font-bold text-ink tracking-tight">Resume Management</h1><p className="text-mute text-sm mt-0.5">Upload a resume to extract profile details and get skill gap guidance.</p></div>
    <Card className="p-6"><CardHeader>Upload or Replace Resume</CardHeader>
      <label onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files?.[0]); }} className={`block text-center border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${isDragging ? 'border-p bg-lav' : 'border-line hover:border-p2 bg-bg/40'} ${loading ? 'opacity-60 pointer-events-none' : ''}`}>
        <div className="mx-auto w-12 h-12 rounded-full bg-lav text-p grid place-items-center mb-3">{loading ? <LoaderCircle className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}</div>
        <p className="font-semibold text-ink text-base">{loading ? 'Parsing your resume…' : 'Drop your resume here or click to browse'}</p>
        <p className="text-mute text-xs mt-1">PDF, DOCX, or TXT · Max 5 MB · Processed temporarily by the local API</p>
        <input type="file" accept=".pdf,.docx,.txt" disabled={loading} className="sr-only" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
      </label>
      {error && <div role="alert" className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-red-50 text-err border border-red-200 text-xs font-medium"><AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span></div>}
      {currentResume && <div className="mt-5 p-4 rounded-xl border border-line bg-white flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-3.5 min-w-0"><FileText className="w-5 h-5 text-p" /><div className="min-w-0"><p className="text-sm font-semibold text-ink truncate">{currentResume.fileName}</p><p className="text-xs text-mute">{currentResume.fileSize} · Uploaded {currentResume.uploadedAt}</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={handleViewOriginal} disabled={previewLoading || !currentResume.fileId} className="inline-flex items-center gap-1.5 text-sm font-semibold text-p disabled:text-mute" title={!currentResume.fileId ? 'Upload this resume again to enable original preview' : ''}>{previewLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : previewable ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}{previewable ? 'View original' : 'Get original file'}</button><button type="button" onClick={handleRemove} aria-label="Remove resume" className="p-2 text-mute hover:text-err"><Trash2 className="w-4 h-4" /></button></div></div>}
      {currentResume && !currentResume.fileId && <p className="text-xs text-warn mt-2">Re-upload this resume once to enable viewing or downloading the original file.</p>}
      {previewError && <p role="alert" className="text-xs text-err mt-2">{previewError}</p>}
      <p className="text-xs text-mute mt-4 leading-relaxed">Your original file is stored privately so you can view or download it later. Parsed profile details are also saved with your account.</p>
    </Card>
    {parsed && <Card className="p-6 space-y-4"><CardHeader><span className="inline-flex items-center gap-2"><Sparkles className="w-4 h-4 text-p" /> Parsed Profile</span></CardHeader>
      <div className="flex flex-wrap gap-4 text-sm"><div><span className="text-mute">Name</span><p className="font-semibold">{parsed.candidate?.name || 'Not detected'}</p></div><div><span className="text-mute">Email</span><p className="font-semibold">{parsed.candidate?.emails?.join(', ') || 'Not detected'}</p></div><div><span className="text-mute">Completeness</span><p className="font-semibold">{parsed.resume_score?.score ?? 0}%</p></div></div>
      <div><p className="text-xs font-semibold uppercase tracking-wide text-mute mb-2">Skills found</p>{parsed.skills?.length ? <div className="flex flex-wrap gap-2">{parsed.skills.map((skill) => <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-lav text-p border border-line">{skill}</span>)}</div> : <p className="text-sm text-mute">No known skills detected. You can add skills to your profile manually.</p>}</div>
      <div className="p-3 rounded-xl bg-bg text-xs text-mute">{parsed.limitations?.join(' ')}</div>
    </Card>}
    <Card className="p-5 bg-lav/30 border-lav"><h3 className="text-sm font-semibold text-ink flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-p" /> Placement Resume Best Practices</h3><ul className="space-y-1.5 text-xs text-ink/80 list-disc list-inside"><li>Keep contact information and portfolio links near the top.</li><li>Quantify project and work achievements.</li><li>Review extracted fields for accuracy; parsing can miss information.</li></ul></Card>
    {previewOpen && previewUrl && <Modal title="Original resume" onClose={() => setPreviewOpen(false)} maxWidth="max-w-5xl"><div className="space-y-3">{previewable ? <iframe title="Original resume file" src={previewUrl} className="w-full h-[72vh] rounded-lg border border-line" /> : <div className="text-center p-8"><p className="text-sm text-mute mb-4">This file format cannot be displayed in the browser. Download the original document to view it in its original format.</p><a href={previewUrl} download={currentResume?.fileName || 'resume'} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-p text-white text-sm font-semibold"><Download className="w-4 h-4" /> Download original</a></div>}</div></Modal>}
  </div>;
}

