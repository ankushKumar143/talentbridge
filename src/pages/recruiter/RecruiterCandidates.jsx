import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  GraduationCap,
  Award,
  FolderGit2,
  FileText,
  Mail,
  ShieldCheck,
  Send,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import ResumePreviewModal from '../../components/recruiter/ResumePreviewModal';
import { useToast } from '../../context/ToastContext';
import { useJobs } from '../../context/JobContext';
import { useApplications } from '../../context/ApplicationContext';
import { rankCandidates } from '../../hooks/useResumeParser';

// Candidate talent directory pool
const TALENT_POOL = [
  {
    id: 'student-1',
    name: 'Aarav Sharma',
    email: 'student@talentbridge.demo',
    phone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech in Computer Science',
    cgpa: '8.7',
    headline: 'Aspiring Frontend Engineer & React Specialist',
    skills: ['React.js', 'JavaScript', 'Tailwind', 'Python', 'Node.js', 'SQL'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    projects: [
      {
        title: 'TalentBridge Placement Portal',
        description: 'Complete campus placement portal with role-based UI and client-side sync.',
        tags: ['React', 'Tailwind', 'Vite']
      },
      {
        title: 'DevPulse Code Analytics',
        description: 'Developer metrics dashboard analyzing commit volume and pull requests.',
        tags: ['React', 'REST API']
      }
    ],
    certifications: [
      'Meta Front-End Developer Professional Certificate',
      'freeCodeCamp JavaScript Algorithms'
    ]
  },
  {
    id: 'student-2',
    name: 'Rhea Sengupta',
    email: 'rhea.s@college.edu',
    phone: '+91 98111 22334',
    college: 'IIT Roorkee',
    degree: 'B.Tech in Electronics & Communication',
    cgpa: '9.1',
    headline: 'Full-Stack Developer & Open Source Contributor',
    skills: ['React.js', 'TypeScript', 'Tailwind', 'Redux', 'Node.js'],
    resumeName: 'Rhea_Sengupta_CV.pdf',
    projects: [
      {
        title: 'CloudSync Storage Hub',
        description: 'Encrypted distributed file storage client with chunked uploading.',
        tags: ['TypeScript', 'Node.js']
      }
    ],
    certifications: ['AWS Certified Cloud Practitioner']
  },
  {
    id: 'student-3',
    name: 'Kunal Patel',
    email: 'kunal.p@univ.ac.in',
    phone: '+91 98222 33445',
    college: 'BITS Pilani',
    degree: 'B.E. Computer Science',
    cgpa: '8.4',
    headline: 'Software Engineer & Next.js Enthusiast',
    skills: ['React.js', 'Next.js', 'CSS Modules', 'GraphQL', 'Docker'],
    resumeName: 'Kunal_Patel_Resume.pdf',
    projects: [
      {
        title: 'CampusMarketplace',
        description: 'Peer-to-peer student marketplace with real-time bidding.',
        tags: ['Next.js', 'GraphQL']
      }
    ],
    certifications: ['Docker Certified Associate']
  },
  {
    id: 'student-4',
    name: 'Ananya Iyer',
    email: 'ananya.iyer@eng.edu',
    phone: '+91 98333 44556',
    college: 'PES University',
    degree: 'B.Tech Information Science',
    cgpa: '7.9',
    headline: 'UI/UX Developer & Web Accessibility Advocate',
    skills: ['HTML', 'CSS', 'JavaScript', 'Vue', 'Figma'],
    resumeName: 'Ananya_Iyer_Resume.pdf',
    projects: [
      {
        title: 'AccessibleUI Components',
        description: 'WCAG AAA compliant component library tested with screen readers.',
        tags: ['Vue', 'CSS']
      }
    ],
    certifications: ['Interaction Design Foundation UX Specialist']
  }
];

export default function RecruiterCandidates() {
  const { showToast } = useToast();
  const { jobs } = useJobs();
  const { applications } = useApplications();
  const [ranked, setRanked] = useState([]);
  const [rankingJob, setRankingJob] = useState('');
  const [rankingLoading, setRankingLoading] = useState(false);
  const [rankingError, setRankingError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  const [degreeFilter, setDegreeFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [resumeCandidate, setResumeCandidate] = useState(null);

  const filteredCandidates = useMemo(() => {
    return TALENT_POOL.filter((c) => {
      const matchesSkill =
        skillFilter === 'All' ||
        c.skills.some((s) => s.toLowerCase() === skillFilter.toLowerCase());

      const matchesDegree =
        degreeFilter === 'All' ||
        c.degree.toLowerCase().includes(degreeFilter.toLowerCase());

      const query = searchQuery.toLowerCase();
      const matchesQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(query) ||
        c.college.toLowerCase().includes(query) ||
        c.headline.toLowerCase().includes(query) ||
        c.skills.some((s) => s.toLowerCase().includes(query));

      return matchesSkill && matchesDegree && matchesQuery;
    });
  }, [searchQuery, skillFilter, degreeFilter]);

  const handleInvite = (candidate) => {
    showToast(`Invitation to apply sent to ${candidate.name}!`, 'success');
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
        experience: app.resumeParsed?.experience || [], projects: app.resumeParsed?.projects || (app.resumeText ? [app.resumeText] : []),
      })));
      setRanked(response.candidates);
    } catch (err) { setRankingError(err.message); setRanked([]); }
    finally { setRankingLoading(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Candidate Directory</h1>
          <p className="text-mute text-sm mt-0.5">
            Discover verified student profiles, evaluate portfolios and certifications, and invite candidates.
          </p>
        </div>

        <span className="text-xs text-mute font-medium bg-white px-3 py-1.5 rounded-xl border border-line self-start sm:self-auto">
          Available Candidates: <b>{filteredCandidates.length}</b>
        </span>
      </div>

      <Card className="p-5 space-y-3">
        <div><h2 className="font-semibold text-ink">Rank applicants by job skills</h2><p className="text-xs text-mute mt-1">Only applications with a parsed resume are included. Rankings support human review; they do not make hiring decisions.</p></div>
        <div className="flex flex-wrap gap-2">
          <select aria-label="Job to rank applicants for" value={rankingJob} onChange={(e) => { setRankingJob(e.target.value); setRanked([]); setRankingError(''); }} className="h-10 min-w-56 px-3 rounded-xl border border-line bg-white text-xs">
            <option value="">Choose a job</option>{jobs.filter((job) => job.status !== 'Closed').map((job) => <option key={job.id} value={job.id}>{job.title} · {job.company}</option>)}
          </select>
          <Button variant="primary" disabled={!rankingJob || !applications.some((app) => String(app.jobId) === String(rankingJob) && (app.resumeParsed || app.resumeText)) || rankingLoading} onClick={runRanking}>{rankingLoading ? 'Ranking…' : 'Rank applicants'}</Button>
        </div>
        {rankingJob && !applications.some((app) => String(app.jobId) === String(rankingJob) && (app.resumeParsed || app.resumeText)) && <p className="text-xs text-mute">No parsed resumes for this job yet. Applicants upload and parse their resume from My Resume before applying.</p>}
        {rankingError && <p role="alert" className="text-xs text-err">{rankingError}</p>}
        {ranked.length > 0 && <div className="space-y-3">{ranked.map((row) => <div key={row.id} className="p-3 rounded-xl border border-line bg-white"><div className="flex justify-between items-center"><span className="font-semibold text-sm">#{row.rank} {row.name}</span><span className="font-bold text-p">{row.score}% evidence coverage</span></div><p className="text-xs text-mute mt-1">Matched: {row.match.matched_skills.join(', ') || 'None'} · Missing: {row.match.missing_skills.join(', ') || 'None'}</p></div>)}<p className="text-[11px] text-mute">Scores use deterministic skill evidence and may be incomplete. Review original resumes and context.</p></div>}
      </Card>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-mute" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, college, or skill..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-line bg-white text-xs placeholder:text-mute focus:border-p focus:outline-none"
          />
        </div>

        <select
          aria-label="Filter by skill"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-line bg-white text-xs font-medium text-ink focus:border-p focus:outline-none"
        >
          <option value="All">All Technical Skills</option>
          <option value="React.js">React.js</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="Node.js">Node.js</option>
          <option value="SQL">SQL</option>
        </select>

        <select
          aria-label="Filter by degree"
          value={degreeFilter}
          onChange={(e) => setDegreeFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-line bg-white text-xs font-medium text-ink focus:border-p focus:outline-none"
        >
          <option value="All">All Degrees</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electronics">Electronics (ECE)</option>
          <option value="Information Science">Information Science</option>
        </select>

        {(searchQuery || skillFilter !== 'All' || degreeFilter !== 'All') && (
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setSearchQuery('');
              setSkillFilter('All');
              setDegreeFilter('All');
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Candidate Grid */}
      {filteredCandidates.length === 0 ? (
        <Card className="p-8">
          <EmptyState
            icon={Users}
            title="No candidates match criteria"
            text="Try adjusting your skill requirements or resetting search filters to browse all verified profiles."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCandidates.map((c) => (
            <Card
              key={c.id}
              hoverable
              className="p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-p text-white grid place-items-center font-bold text-sm shadow-sm shrink-0">
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-ink text-base truncate">{c.name}</h3>
                        <ShieldCheck className="w-4 h-4 text-p shrink-0" title="Verified Profile" />
                      </div>
                      <p className="text-xs text-mute truncate">{c.headline}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-ok bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/50 shrink-0">
                    {c.cgpa} CGPA
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-xs text-mute">
                  <p className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-p shrink-0" />
                    <span className="text-ink font-medium">{c.college}</span> • {c.degree}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-mute shrink-0" />
                    <span>{c.email}</span>
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-line/60">
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-bg border border-line text-ink font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-line/40">
                <Button
                  variant="ghost"
                  className="flex-1 text-xs"
                  onClick={() => setSelectedCandidate(c)}
                >
                  <Eye className="w-3.5 h-3.5" /> View Profile
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-xs"
                  onClick={() => setResumeCandidate(c)}
                >
                  <FileText className="w-3.5 h-3.5" /> Resume
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 text-xs"
                  onClick={() => handleInvite(c)}
                >
                  <Send className="w-3.5 h-3.5" /> Invite
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <Modal
          title={`Candidate Profile: ${selectedCandidate.name}`}
          onClose={() => setSelectedCandidate(null)}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4">
            <div className="p-4 bg-lav/40 rounded-2xl border border-lav flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-ink">{selectedCandidate.name}</h3>
                <p className="text-xs text-p font-medium">{selectedCandidate.headline}</p>
                <p className="text-xs text-mute mt-1">
                  {selectedCandidate.email} • {selectedCandidate.phone}
                </p>
              </div>
              <span className="text-sm font-bold text-ok bg-white px-3 py-1.5 rounded-xl border border-emerald-200">
                {selectedCandidate.cgpa} CGPA
              </span>
            </div>

            <div className="p-3.5 bg-bg rounded-xl border border-line text-xs space-y-1">
              <span className="text-mute font-medium block">Institution</span>
              <p className="font-semibold text-ink">{selectedCandidate.college}</p>
              <p className="text-mute">{selectedCandidate.degree}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4 text-p" /> Key Projects
              </h4>
              <div className="space-y-2">
                {selectedCandidate.projects?.map((proj) => (
                  <div key={proj.title} className="p-3 bg-white rounded-xl border border-line text-xs">
                    <p className="font-bold text-ink">{proj.title}</p>
                    <p className="text-mute mt-0.5 leading-relaxed">{proj.description}</p>
                    <div className="flex gap-1 mt-1.5">
                      {proj.tags?.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg border border-line">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-p" /> Certifications
              </h4>
              <ul className="space-y-1.5 text-xs">
                {selectedCandidate.certifications?.map((cert) => (
                  <li key={cert} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-line">
                    <CheckCircle2 className="w-3.5 h-3.5 text-ok shrink-0" />
                    <span className="font-medium text-ink">{cert}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 pt-2 border-t border-line">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => {
                  const cand = selectedCandidate;
                  setSelectedCandidate(null);
                  setResumeCandidate(cand);
                }}
              >
                <FileText className="w-4 h-4" /> Open Resume Document
              </Button>
              <Button
                variant="primary"
                className="flex-1"
                onClick={() => {
                  handleInvite(selectedCandidate);
                  setSelectedCandidate(null);
                }}
              >
                <Send className="w-4 h-4" /> Send Placement Invite
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {resumeCandidate && (
        <ResumePreviewModal
          candidate={resumeCandidate}
          onClose={() => setResumeCandidate(null)}
          onToast={(msg) => showToast(msg)}
        />
      )}
    </div>
  );
}
