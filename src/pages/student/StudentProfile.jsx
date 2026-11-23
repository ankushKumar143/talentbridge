import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  User,
  GraduationCap,
  FolderGit2,
  Award,
  Plus,
  Check,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import ProfileCompletion from '../../components/student/ProfileCompletion';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function StudentProfile() {
  const { studentProfile, updateStudentProfile } = useAuth();
  const { showToast } = useToast();
  const outlet = useOutletContext() || {};
  const parsedResume = studentProfile?.resume?.parsed;
  const extractedExperience = parsedResume?.experience || [];
  const displayAbout = /^resume highlights:/i.test(studentProfile?.about || '') ? '' : studentProfile?.about;

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: studentProfile?.name || '',
    headline: studentProfile?.headline || '',
    phone: studentProfile?.phone || '',
    about: studentProfile?.about || '',
  });

  const handleSaveInfo = (e) => {
    e.preventDefault();
    updateStudentProfile({
      ...formData,
      first: formData.name.split(' ')[0] || formData.name,
    });
    setIsEditingInfo(false);
    showToast('Profile details updated successfully', 'success');
  };

  const handleRemoveCert = (certName) => {
    const updatedCerts = (studentProfile?.certifications || []).filter((c) => c !== certName);
    updateStudentProfile({
      certifications: updatedCerts,
      certs: updatedCerts,
    });
    showToast(`Removed "${certName}"`);
  };

  const openCertModal = () => {
    if (outlet.setIsCertModalOpen) {
      outlet.setIsCertModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">My Profile</h1>
          <p className="text-mute text-sm mt-0.5">
            Manage your personal academic background, project portfolio, and certifications.
          </p>
        </div>

        <Button
          variant="ghost"
          icon={Edit2}
          onClick={() => {
            setFormData({
              name: studentProfile?.name || '',
              headline: studentProfile?.headline || '',
              phone: studentProfile?.phone || '',
              about: studentProfile?.about || '',
            });
            setIsEditingInfo(true);
          }}
        >
          Edit Profile Info
        </Button>
      </div>

      {/* Top 2 Columns: Profile Completion + Certifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileCompletion
          prof={studentProfile}
          onComplete={openCertModal}
        />

        {/* Certifications Card */}
        <Card className="p-5">
          <CardHeader
            right={
              <button
                onClick={openCertModal}
                className="text-sm font-semibold text-p hover:underline flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add certification
              </button>
            }
          >
            Certifications
          </CardHeader>

          {(!studentProfile?.certifications || studentProfile.certifications.length === 0) ? (
            <EmptyState
              icon={Award}
              title="No certifications added yet"
              text="Add verified certifications from Coursera, freeCodeCamp, or university coursework to reach 100% completion."
              action={
                <Button size="sm" onClick={openCertModal}>
                  Add Certification
                </Button>
              }
            />
          ) : (
            <ul className="space-y-2.5">
              {studentProfile.certifications.map((c) => (
                <li
                  key={c}
                  className="flex items-center justify-between p-3 rounded-xl border border-line bg-bg/50 hover:bg-bg transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-sm text-ink font-medium">
                    <Check className="w-4 h-4 text-ok shrink-0 stroke-[2.5]" />
                    <span>{c}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveCert(c)}
                    aria-label={`Remove ${c}`}
                    className="text-mute hover:text-err p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Personal & Academic Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-line">
          <div className="w-16 h-16 rounded-2xl bg-p text-white grid place-items-center text-xl font-bold shrink-0 shadow-sm">
            {studentProfile?.avatar || 'AS'}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-ink">{studentProfile?.name}</h2>
            <p className="text-sm text-p font-medium mt-0.5">{studentProfile?.headline}</p>
            <p className="text-xs text-mute mt-1">
              {studentProfile?.email} • {studentProfile?.phone} • {studentProfile?.location}
            </p>
          </div>
        </div>

        <div className="pt-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-mute uppercase tracking-wider mb-1.5">About Me</h3>
            {displayAbout ? <p className="text-sm text-ink leading-relaxed">{displayAbout}</p> : <p className="text-sm text-mute">Add a short introduction about yourself.</p>}
          </div>
        </div>
      </Card>

      {parsedResume && <Card className="p-5 space-y-4">
        <CardHeader>Resume-extracted details <span className="text-xs font-normal text-mute">· {studentProfile?.resume?.fileName || 'Uploaded resume'}</span></CardHeader>
        <p className="text-xs text-mute -mt-2">These details were extracted from your resume. Education, skills, and projects are shown in the profile sections below.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-line bg-bg/50 p-3"><span className="text-xs text-mute">Resume name</span><p className="font-medium text-ink mt-1">{parsedResume.candidate?.name || 'Not detected'}</p></div>
          <div className="rounded-xl border border-line bg-bg/50 p-3"><span className="text-xs text-mute">Resume email</span><p className="font-medium text-ink mt-1">{parsedResume.candidate?.emails?.join(', ') || 'Not detected'}</p></div>
          <div className="rounded-xl border border-line bg-bg/50 p-3"><span className="text-xs text-mute">Phone</span><p className="font-medium text-ink mt-1">{parsedResume.candidate?.phone_numbers?.join(', ') || 'Not detected'}</p></div>
          <div className="rounded-xl border border-line bg-bg/50 p-3"><span className="text-xs text-mute">Resume content score</span><p className="font-medium text-p mt-1">{parsedResume.resume_score?.score ?? 0}%</p></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-wide text-mute mb-2">Experience detected</p>{extractedExperience.length ? <ul className="list-disc pl-4 space-y-1 text-sm text-ink">{extractedExperience.map((item, i) => <li key={i}>{typeof item === 'string' ? item : item.summary || [...(item.responsibilities || [])].join('; ') || item.title || 'Experience entry'}</li>)}</ul> : <p className="text-sm text-mute">No experience entries detected.</p>}</div>
        </div>
        {parsedResume.limitations?.length > 0 && <p className="text-xs text-mute border-t border-line pt-3">{parsedResume.limitations.join(' ')}</p>}
      </Card>}

      {/* Education & Projects Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Education Timeline */}
        <Card className="p-5">
          <CardHeader>
            <span className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-p" /> Education Background
            </span>
          </CardHeader>

          <div className="space-y-4">
            {(studentProfile?.education || []).map((edu, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-line bg-bg/40 relative"
              >
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-semibold text-ink">{edu.institution}</h4>
                  {edu.score && <span className="text-xs font-semibold text-ok bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">{edu.score}</span>}
                </div>
                <p className="text-xs text-ink/80 mt-1">{edu.degree}</p>
                <p className="text-xs text-mute mt-0.5">{edu.duration}</p>
              </div>
            ))}
            {!(studentProfile?.education || []).length && <p className="text-sm text-mute">Upload your resume to extract education details.</p>}
          </div>
        </Card>

        {/* Featured Projects */}
        <Card className="p-5">
          <CardHeader>
            <span className="flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-p" /> Featured Projects
            </span>
          </CardHeader>

          <div className="space-y-3.5">
            {(studentProfile?.projects || []).map((proj, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-line bg-bg/40 hover:border-p2 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">{proj.title}</h4>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-p hover:underline flex items-center gap-1 font-medium"
                    >
                      Code <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                {proj.description && <p className="text-xs text-mute mt-1 leading-relaxed whitespace-pre-line">{proj.description}</p>}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {proj.tags?.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-line text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {!(studentProfile?.projects || []).length && <p className="text-sm text-mute">Upload your resume to extract projects.</p>}
          </div>
        </Card>
      </div>

      {/* Edit Profile Info Modal */}
      {isEditingInfo && (
        <Modal
          title="Edit Profile Information"
          onClose={() => setIsEditingInfo(false)}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Headline</label>
              <input
                type="text"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Professional Bio / About</label>
              <textarea
                rows={3}
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                className="w-full p-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIsEditingInfo(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Save Profile
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
