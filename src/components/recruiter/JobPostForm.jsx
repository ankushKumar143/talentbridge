import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Users,
  Award,
  DollarSign,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  FileText
} from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Button from '../common/Button';

export default function JobPostForm({
  recruiter,
  onSubmitJob,
  initialData = null,
  isEditing = false
}) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || recruiter?.company || 'TechNova Solutions',
    about: initialData?.about || '',
    requirements: initialData?.requirements || '',
    skills: initialData?.skills || ['React.js', 'JavaScript'],
    loc: initialData?.loc || 'Bengaluru',
    mode: initialData?.mode || 'Remote',
    type: initialData?.type || 'Internship',
    pay: initialData?.pay || '₹25,000/mo',
    openings: initialData?.openings || 2,
    experience: initialData?.experience || '0-1 years (Students / Freshers)',
    deadline: initialData?.deadline || '2026-12-15',
    eligibility: initialData?.eligibility || 'B.Tech / B.E. / BCA in CS/IT (Min 6.0 CGPA)',
  });

  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    const s = skillInput.trim();
    if (!s) return;
    if (formData.skills.some((sk) => sk.toLowerCase() === s.toLowerCase())) {
      setSkillInput('');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, s],
    }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((sk) => sk !== skillToRemove),
    }));
  };

  const handleSubmit = (status = 'Active') => {
    if (!formData.title.trim()) {
      setError('Please provide a Job Title.');
      return;
    }
    if (!formData.company.trim()) {
      setError('Please provide a Company Name.');
      return;
    }
    if (!formData.about.trim()) {
      setError('Please enter a brief Job Description.');
      return;
    }
    if (formData.skills.length === 0) {
      setError('Please add at least one Required Skill.');
      return;
    }

    setError('');

    const jobPayload = {
      ...formData,
      id: initialData?.id || Date.now(),
      status: status,
      postedDate: initialData?.postedDate || 'Just now',
      recruiterId: recruiter?.id || 'recruiter-1',
    };

    onSubmitJob(jobPayload, status);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit('Active');
      }}
      className="space-y-6 max-w-4xl"
    >
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-p" /> Basic Job Information
          </span>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Job Title <span className="text-err">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Frontend Developer Intern"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Company Name <span className="text-err">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. TechNova Solutions"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-ink mb-1">
            Job Description <span className="text-err">*</span>
          </label>
          <textarea
            rows={4}
            required
            placeholder="Explain the role, core responsibilities, and team dynamic..."
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="w-full p-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none resize-none leading-relaxed"
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-ink mb-1">
            Job Requirements & Expectations
          </label>
          <textarea
            rows={3}
            placeholder="Technical qualifications, coursework, tool proficiencies, or day-to-day requirements..."
            value={formData.requirements}
            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
            className="w-full p-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </Card>

      {/* Role Specifications */}
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <Award className="w-5 h-5 text-p" /> Candidate Qualifications & Skills
          </span>
        </CardHeader>

        {/* Skills Tag Input */}
        <div>
          <label className="block text-xs font-semibold text-ink mb-1">
            Required Technical Skills <span className="text-err">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Type skill and press Add (e.g. React.js, Python, SQL)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(e);
                }
              }}
              className="flex-1 h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddSkill}
              icon={Plus}
            >
              Add Skill
            </Button>
          </div>

          <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 rounded-xl bg-bg border border-line">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-line text-xs font-semibold text-ink shadow-sm"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-mute hover:text-err p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Eligibility Criteria
            </label>
            <input
              type="text"
              placeholder="e.g. B.Tech / BCA (Min 6.0 CGPA)"
              value={formData.eligibility}
              onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Experience Required
            </label>
            <input
              type="text"
              placeholder="e.g. 0-1 years / 2026-2027 Batch"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Logistics and Compensation */}
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-p" /> Logistics, Openings & Compensation
          </span>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Work Location
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru, Pune, Remote"
              value={formData.loc}
              onChange={(e) => setFormData({ ...formData, loc: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Work Mode
            </label>
            <select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line bg-white text-sm focus:border-p focus:outline-none font-medium"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line bg-white text-sm focus:border-p focus:outline-none font-medium"
            >
              <option value="Internship">Internship</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Salary / Stipend
            </label>
            <input
              type="text"
              placeholder="e.g. ₹25,000/mo or ₹8 LPA"
              value={formData.pay}
              onChange={(e) => setFormData({ ...formData, pay: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none font-semibold text-ink"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Number of Openings
            </label>
            <input
              type="number"
              min="1"
              value={formData.openings}
              onChange={(e) => setFormData({ ...formData, openings: parseInt(e.target.value, 10) || 1 })}
              className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              Application Deadline
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-line bg-white text-sm focus:border-p focus:outline-none"
            />
          </div>
        </div>
      </Card>

      {/* Error alert */}
      {error && (
        <div className="p-3 bg-red-50 text-err border border-red-200 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      {/* Action Buttons: Save as Draft vs Publish Job */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => handleSubmit('Draft')}
        >
          Save as Draft
        </Button>

        <Button
          type="submit"
          variant="primary"
          className="w-full sm:w-auto shadow-sm"
          icon={CheckCircle2}
        >
          {isEditing ? 'Save Changes' : 'Publish Job Post'}
        </Button>
      </div>
    </form>
  );
}

