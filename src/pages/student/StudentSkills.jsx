import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import SkillsOverview from '../../components/student/SkillsOverview';
import Card, { CardHeader } from '../../components/common/Card';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useJobs } from '../../context/JobContext';

export default function StudentSkills() {
  const navigate = useNavigate();
  const { studentProfile, updateStudentProfile } = useAuth();
  const { jobs } = useJobs();
  const { showToast } = useToast();
  const suggestions = useMemo(() => {
    const unique = new Map();
    jobs.forEach((job) => (job.matchDetails?.learning_recommendations || []).forEach((item) => {
      const key = item.skill.toLowerCase();
      if (!unique.has(key)) unique.set(key, { ...item, jobTitles: [job.title] });
      else unique.get(key).jobTitles.push(job.title);
    }));
    const rank = { High: 0, Medium: 1, Low: 2 };
    return [...unique.values()].sort((a, b) => rank[a.priority] - rank[b.priority]).slice(0, 8);
  }, [jobs]);

  return (
    <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight flex items-center gap-2">
          Skills & Learning <BookOpen className="w-5 h-5 text-p" />
        </h1>
        <p className="text-mute text-sm mt-0.5">
          Curate your technical proficiency portfolio and explore targeted skill recommendations.
        </p>
      </div>

      {/* Skills list with edit / progress */}
      <SkillsOverview
        skills={studentProfile?.skills || []}
        setSkills={(newSkills) => updateStudentProfile({ skills: newSkills })}
        onToast={(msg) => showToast(msg)}
      />

      {/* Suggested learning roadmap */}
      <Card className="p-5">
        <CardHeader
          right={
            <span className="text-xs font-semibold text-p bg-lav px-2.5 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Resume-based
            </span>
          }
        >
          Suggested learning
        </CardHeader>

        <p className="text-xs text-mute -mt-2 mb-4">
          Suggestions based on missing resume skills and active job requirements:
        </p>

        {suggestions.length ? <div className="space-y-3">
          {suggestions.map((item) => (
            <div
              key={item.skill}
              className="p-3.5 rounded-xl border border-line bg-bg/40 hover:bg-bg transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-p shrink-0" />
                  <h4 className="text-sm font-semibold text-ink group-hover:text-p transition-colors">
                    {item.skill} <span className="text-[10px] uppercase tracking-wide text-err">{item.priority} priority</span>
                  </h4>
                </div>
                <p className="text-xs text-mute mt-1 pl-6">Required for: {item.jobTitles.join(', ')}</p>
                <p className="text-xs text-ink/80 mt-2 pl-6">Learn: {item.topics_to_learn.join(' · ')}</p>
                <p className="text-xs text-mute mt-1 pl-6">Practice: {item.suggested_project}</p>
              </div>
            </div>
          ))}
        </div> : <div className="rounded-xl border border-dashed border-line p-5 text-center">
          <p className="text-sm text-mute">Upload a resume and review active jobs to see job-specific skill gaps.</p>
          <button onClick={() => navigate('/student/resume')} className="text-sm text-p font-semibold hover:underline mt-2">Upload resume <ArrowRight className="inline w-3.5 h-3.5" /></button>
        </div>}
      </Card>
    </div>
  );
}
