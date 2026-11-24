import React, { useEffect, useMemo, useState } from 'react';
import { Search, Users, GraduationCap, Award, FolderGit2, FileText, Mail, Send, Eye, CheckCircle2, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ResumePreviewModal from '../../components/recruiter/ResumePreviewModal';
import { useToast } from '../../context/ToastContext';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { apiRequest } from '../../api/client';
import { rankCandidates } from '../../hooks/useResumeParser';

const normalize = (value) => String(value || '').trim().toLowerCase();

export default function RecruiterCandidates() {
  const { showToast } = useToast();
  const { jobs } = useJobs();
  const { applications } = useApplications();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [invitingId, setInvitingId] = useState(null);
  const [ranked, setRanked] = useState([]);
  const [rankingJob, setRankingJob] = useState('');
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);

  const loadCandidates = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const rows = await apiRequest('/api/candidates');
      setCandidates(Array.isArray(rows) ? rows : []);
    } catch (err) {
      setLoadError(err.message || 'Could not load the student directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCandidates(); }, []);

  const skills = useMemo(() => [...new Set(candidates.flatMap((candidate) => candidate.skills || []).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [candidates]);
  const degrees = useMemo(() => [...new Set(candidates.map((candidate) => candidate.degree).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [candidates]);
  const filteredCandidates = useMemo(() => candidates.filter((candidate) => {
    const query = normalize(searchQuery);
    const haystack = [candidate.name, candidate.college, candidate.headline, candidate.email, ...(candidate.skills || [])].map(normalize);
    const matchesQuery = !query || haystack.some((value) => value.includes(query));
    const matchesSkill = skillFilter === 'All' || (candidate.skills || []).some((skill) => normalize(skill) === normalize(skillFilter));
    const matchesDegree = degreeFilter === 'All' || normalize(candidate.degree).includes(normalize(degreeFilter));
    return matchesQuery && matchesSkill && matchesDegree;
  }), [candidates, searchQuery, skillFilter, degreeFilter]);

  const handleInvite = async (candidate) => {
    setInvitingId(candidate.id);
    try {
      const result = await apiRequest(`/api/candidates/${candidate.id}/invite`, { method: 'POST' });
      showToast(result.message || `Invitation sent to ${candidate.name}.`, 'success');
    } catch (err) {
      showToast(err.message || 'Could not send the invitation.', 'error');
    } finally {
      setInvitingId(null);
    }
  };

  const runRanking = async () => {
    const job = jobs.find((item) => String(item.id) === String(rankingJob));
    const eligible = applications.filter((app) => String(app.jobId) === String(rankingJob) && (app.resumeParsed || app.resumeText));
    if (!job || eligible.length === 0) return;
    setRankingLoading(true); setRankingError('');
    try {
      const response = await rankCandidates(job, eligible.map((app) => ({
        id: app.id, name: app.studentName,
        skills: app.resumeParsed?.skills || app.skills || [],
        experience: app.resumeParsed?.experience || [],
        projects: app.resumeParsed?.projects || (app.resumeText ? [app.resumeText] : []),
      })));
      setRanked(response.candidates || []);
    } catch (err) { setRankingError(err.message); setRanked([]); }
    finally { setRankingLoading(false); }
  };

  const hasRankableApplicants = applications.some((app) => String(app.jobId) === String(rankingJob) && (app.resumeParsed || app.resumeText));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Candidate Directory</h1>
          <p className="text-mute text-sm mt-0.5">Browse student accounts and the profile details they have added to TalentBridge.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line">{loading ? 'Loading students…' : `Students: ${filteredCandidates.length}${filteredCandidates.length !== candidates.length ? ` of ${candidates.length}` : ''}`}</span>
          <Button variant="ghost" size="sm" icon={RefreshCw} onClick={loadCandidates} disabled={loading}>Refresh</Button>
        </div>
      </div>

      <Card className="p-5 space-y-3">
        <div><h2 className="font-semibold text-ink">Rank applicants by job skills</h2><p className="text-xs text-mute mt-1">Only students who applied to the selected job are ranked. Rankings support human review; they do not make hiring decisions.</p></div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Job to rank applicants for" value={rankingJob} onChange={(e) => { setRankingJob(e.target.value); setRanked([]); setRankingError(''); }} className="h-10 min-w-56 px-3 rounded-xl border border-line bg-white text-xs">
            <option value="">Choose a job</option>{jobs.filter((job) => job.status !== 'Closed').map((job) => <option key={job.id} value={job.id}>{job.title} · {job.company}</option>)}
          </select>
          <Button variant="primary" disabled={!rankingJob || !hasRankableApplicants || rankingLoading} onClick={runRanking}>{rankingLoading ? 'Ranking…' : 'Rank applicants'}</Button>
        </div>
        {rankingJob && !hasRankableApplicants && <p className="text-xs text-mute">No applications with resume information for this job yet.</p>}
        {rankingError && <p role="alert" className="text-xs text-err">{rankingError}</p>}
        {ranked.length > 0 && <div className="space-y-3">{ranked.map((row) => <div key={row.id} className="p-3 rounded-xl border border-line bg-white"><div className="flex justify-between items-center"><span className="font-semibold text-sm">#{row.rank} {row.name}</span><span className="font-bold text-p">{row.score}% evidence coverage</span></div><p className="text-xs text-mute mt-1">Matched: {row.match.matched_skills.join(', ') || 'None'} · Missing: {row.match.missing_skills.join(', ') || 'None'}</p></div>)}<p className="text-[11px] text-mute">Scores may be incomplete. Review each candidate's original resume and context.</p></div>}
      </Card>

      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px]"><Search className="w-4 h-4 absolute left-3 top-3 text-mute" /><input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name, college, email, or skill…" className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-xs placeholder:text-mute focus:border-p focus:outline-none" /></div>
        <select aria-label="Filter by skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className="h-10 max-w-56 px-3 rounded-xl border border-line bg-white text-xs font-medium text-ink"><option value="All">All skills</option>{skills.map((skill) => <option key={skill} value={skill}>{skill}</option>)}</select>
        <select aria-label="Filter by degree" value={degreeFilter} onChange={(e) => setDegreeFilter(e.target.value)} className="h-10 max-w-64 px-3 rounded-xl border border-line bg-white text-xs font-medium text-ink"><option value="All">All degrees</option>{degrees.map((degree) => <option key={degree} value={degree}>{degree}</option>)}</select>
        {(searchQuery || skillFilter !== 'All' || degreeFilter !== 'All') && <Button variant="ghost" size="md" onClick={() => { setSearchQuery(''); setSkillFilter('All'); setDegreeFilter('All'); }}>Clear Filters</Button>}
      </div>

      {loading ? <Card className="p-8 text-center text-sm text-mute">Loading student profiles…</Card>
        : loadError ? <Card className="p-8 text-center space-y-3"><p role="alert" className="text-sm text-err">{loadError}</p><Button variant="primary" onClick={loadCandidates}>Retry</Button></Card>
          : filteredCandidates.length === 0 ? <Card className="p-8"><EmptyState icon={Users} title={candidates.length ? 'No students match these filters' : 'No student accounts yet'} text={candidates.length ? 'Clear or adjust the filters to see more students.' : 'Student accounts will appear here after they register.'} /></Card>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{filteredCandidates.map((candidate) => <Card key={candidate.id} hoverable className="p-5 flex flex-col justify-between"><div>
              <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3 min-w-0"><div className="w-11 h-11 rounded-xl bg-p text-white grid place-items-center font-bold text-sm shrink-0">{(candidate.name || 'S').slice(0, 2).toUpperCase()}</div><div className="min-w-0"><h3 className="font-bold text-ink text-base truncate">{candidate.name}</h3><p className="text-xs text-mute truncate">{candidate.headline || 'Student'}</p></div></div>{candidate.cgpa && <span className="text-xs font-bold text-ok bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50 shrink-0">{candidate.cgpa} CGPA</span>}</div>
              <div className="mt-3.5 space-y-1 text-xs text-mute">{(candidate.college || candidate.degree) && <p className="flex items-start gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-p shrink-0 mt-0.5" /><span><b className="text-ink font-medium">{candidate.college || 'Institution not added'}</b>{candidate.degree ? ` · ${candidate.degree}` : ''}</span></p>}<p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{candidate.email}</span></p></div>
              {(candidate.skills || []).length > 0 && <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line/60">{candidate.skills.slice(0, 8).map((skill) => <span key={skill} className="text-[11px] px-2 py-0.5 rounded-md bg-bg border border-line text-ink font-medium">{skill}</span>)}{candidate.skills.length > 8 && <span className="text-[11px] px-2 py-0.5 text-mute">+{candidate.skills.length - 8} more</span>}</div>}
              </div><div className="flex items-center gap-2 pt-4 mt-4 border-t border-line/40"><Button variant="ghost" className="flex-1 text-xs" onClick={() => setSelectedCandidate(candidate)}><Eye className="w-3.5 h-3.5" /> View Profile</Button><Button variant="ghost" className="flex-1 text-xs" disabled={!candidate.hasResumeFile} title={!candidate.hasResumeFile ? 'No original resume file uploaded' : ''} onClick={() => setResumeCandidate(candidate)}><FileText className="w-3.5 h-3.5" /> Resume</Button><Button variant="primary" className="flex-1 text-xs" disabled={invitingId === candidate.id} onClick={() => handleInvite(candidate)}><Send className="w-3.5 h-3.5" /> {invitingId === candidate.id ? 'Sending…' : 'Invite'}</Button></div>
            </Card>)}</div>}

      {selectedCandidate && <Modal title={`Candidate Profile: ${selectedCandidate.name}`} onClose={() => setSelectedCandidate(null)} maxWidth="max-w-2xl"><div className="space-y-4">
        <div className="p-4 bg-lav/40 rounded-2xl border border-lav"><h3 className="text-lg font-bold text-ink">{selectedCandidate.name}</h3><p className="text-xs text-p font-medium">{selectedCandidate.headline || 'Student'}</p><p className="text-xs text-mute mt-1">{selectedCandidate.email}{selectedCandidate.phone ? ` · ${selectedCandidate.phone}` : ''}</p></div>
        {(selectedCandidate.college || selectedCandidate.degree || selectedCandidate.cgpa) && <div className="p-3.5 bg-bg rounded-xl border border-line text-xs space-y-1"><span className="text-mute font-medium block">Education</span>{selectedCandidate.college && <p className="font-semibold text-ink">{selectedCandidate.college}</p>}{selectedCandidate.degree && <p className="text-mute">{selectedCandidate.degree}</p>}{selectedCandidate.cgpa && <p className="text-mute">{selectedCandidate.cgpa} CGPA</p>}</div>}
        {selectedCandidate.about && <div><h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">About</h4><p className="text-sm text-ink whitespace-pre-line">{selectedCandidate.about}</p></div>}
        <div><h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">Skills</h4>{selectedCandidate.skills?.length ? <div className="flex flex-wrap gap-1.5">{selectedCandidate.skills.map((skill) => <span key={skill} className="text-xs px-2 py-1 rounded-lg bg-lav text-p">{skill}</span>)}</div> : <p className="text-sm text-mute">No skills added yet.</p>}</div>
        <div><h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><FolderGit2 className="w-4 h-4 text-p" /> Projects</h4>{selectedCandidate.projects?.length ? <div className="space-y-2">{selectedCandidate.projects.map((project, index) => { const item = typeof project === 'string' ? { title: project } : project || {}; return <div key={`${item.title || item.name || 'project'}-${index}`} className="p-3 bg-white rounded-xl border border-line text-sm"><p className="font-semibold text-ink">{item.title || item.name || 'Project'}</p>{item.description && <p className="text-mute mt-1 leading-relaxed">{item.description}</p>}</div>; })}</div> : <p className="text-sm text-mute">No projects added yet.</p>}</div>
        <div><h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><Award className="w-4 h-4 text-p" /> Certifications</h4>{selectedCandidate.certifications?.length ? <ul className="space-y-1.5 text-xs">{selectedCandidate.certifications.map((cert, index) => { const label = typeof cert === 'string' ? cert : cert?.name || cert?.title || 'Certification'; return <li key={`${label}-${index}`} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-line"><CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0" /><span className="font-medium text-ink">{label}</span></li>; })}</ul> : <p className="text-sm text-mute">No certifications added yet.</p>}</div>
        <div className="flex gap-2 pt-2 border-t border-line">{selectedCandidate.hasResumeFile && <Button variant="ghost" className="flex-1" onClick={() => { setResumeCandidate(selectedCandidate); setSelectedCandidate(null); }}><FileText className="w-4 h-4" /> Open original resume</Button>}<Button variant="primary" className="flex-1" disabled={invitingId === selectedCandidate.id} onClick={() => handleInvite(selectedCandidate)}><Send className="w-4 h-4" /> Send invite</Button></div>
      </div></Modal>}
      {resumeCandidate && <ResumePreviewModal candidate={resumeCandidate} onClose={() => setResumeCandidate(null)} onToast={(message, type) => showToast(message, type)} />}
    </div>
  );
}
