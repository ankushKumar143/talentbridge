import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Briefcase,
  Edit2,
  ExternalLink
} from 'lucide-react';
import Card, { CardHeader } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function RecruiterProfile() {
  const { recruiterProfile, updateRecruiterProfile } = useAuth();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: recruiterProfile?.name || '',
    title: recruiterProfile?.title || '',
    email: recruiterProfile?.email || '',
    phone: recruiterProfile?.phone || '',
    company: recruiterProfile?.company || '',
    website: recruiterProfile?.website || '',
    location: recruiterProfile?.location || '',
    industry: recruiterProfile?.industry || '',
    teamSize: recruiterProfile?.teamSize || '',
    description: recruiterProfile?.description || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    updateRecruiterProfile({
      ...formData,
      first: formData.name.split(' ')[0] || formData.name,
      companyLogo: formData.company.slice(0, 2).toUpperCase(),
    });
    setIsEditing(false);
    showToast('Company and recruiter profile updated successfully', 'success');
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Corporate Profile</h1>
          <p className="text-mute text-sm mt-0.5">
            Manage your company information, brand branding, and recruiter contact channels.
          </p>
        </div>

        <Button
          variant="ghost"
          icon={Edit2}
          onClick={() => {
            setFormData({
              name: recruiterProfile?.name || '',
              title: recruiterProfile?.title || '',
              email: recruiterProfile?.email || '',
              phone: recruiterProfile?.phone || '',
              company: recruiterProfile?.company || '',
              website: recruiterProfile?.website || '',
              location: recruiterProfile?.location || '',
              industry: recruiterProfile?.industry || '',
              teamSize: recruiterProfile?.teamSize || '',
              description: recruiterProfile?.description || '',
            });
            setIsEditing(true);
          }}
        >
          Edit Profile Details
        </Button>
      </div>

      {/* Main Company Overview Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pb-6 border-b border-line">
          <div className="w-16 h-16 rounded-2xl bg-ink text-white grid place-items-center text-xl font-bold shadow-sm shrink-0">
            {recruiterProfile?.companyLogo || recruiterProfile?.company?.slice(0, 2).toUpperCase() || 'TN'}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-ink">{recruiterProfile?.company}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-ok border border-emerald-200/50 font-semibold">
                Verified Enterprise
              </span>
            </div>
            <p className="text-sm text-mute mt-0.5">{recruiterProfile?.industry} • {recruiterProfile?.location}</p>
            {recruiterProfile?.website && (
              <a
                href={recruiterProfile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-p hover:underline flex items-center gap-1 mt-1 font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                {recruiterProfile.website} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        <div className="pt-5 space-y-4">
          <div>
            <h3 className="text-xs font-semibold text-mute uppercase tracking-wider mb-1.5">
              About the Company
            </h3>
            <p className="text-sm text-ink leading-relaxed">
              {recruiterProfile?.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-line/60 text-xs">
            <div className="p-3.5 rounded-xl bg-bg border border-line">
              <span className="text-mute block font-medium">Headquarters</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{recruiterProfile?.location}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-bg border border-line">
              <span className="text-mute block font-medium">Industry Sector</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{recruiterProfile?.industry}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-bg border border-line">
              <span className="text-mute block font-medium">Company Size</span>
              <span className="text-sm font-semibold text-ink mt-0.5 block">{recruiterProfile?.teamSize}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Primary Recruiter Contact Details */}
      <Card className="p-6">
        <CardHeader>
          <span className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-p" /> Designated Campus Placement Officer
          </span>
        </CardHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 text-xs">
          <div className="p-3.5 rounded-xl bg-bg border border-line">
            <span className="text-mute block font-medium">Recruiter Name</span>
            <span className="text-sm font-semibold text-ink mt-0.5 block">{recruiterProfile?.name}</span>
            <span className="text-p font-medium mt-0.5 block">{recruiterProfile?.title}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-bg border border-line">
            <span className="text-mute block font-medium">Contact Channels</span>
            <span className="text-sm font-semibold text-ink mt-0.5 block">{recruiterProfile?.email}</span>
            <span className="text-mute mt-0.5 block">{recruiterProfile?.phone}</span>
          </div>
        </div>
      </Card>

      {/* Edit Profile Modal */}
      {isEditing && (
        <Modal
          title="Edit Company & Recruiter Profile"
          onClose={() => setIsEditing(false)}
          maxWidth="max-w-2xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Website URL</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Location / HQ</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Industry</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink mb-1">Team Size</label>
                <input
                  type="text"
                  value={formData.teamSize}
                  onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">Company Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2 border-t border-line">
              <h4 className="text-xs font-semibold text-mute uppercase tracking-wider mb-2">
                Recruiter Details
              </h4>
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
                  <label className="block text-xs font-semibold text-ink mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-line text-sm focus:border-p focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-xs font-semibold text-ink mb-1">Work Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            </div>

            <div className="flex gap-2 justify-end pt-3">
              <Button variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
