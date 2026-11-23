import React, { useState } from 'react';
import { Edit2, Trash2, Plus, BookOpen, AlertCircle } from 'lucide-react';
import Card, { CardHeader } from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import EmptyState from '../common/EmptyState';
import { SKILL_LEVELS } from '../../data/mockData';

export default function SkillsOverview({
  skills = [],
  setSkills,
  onToast,
  showTitle = true
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [error, setError] = useState('');

  const openAddModal = () => {
    setEditIndex(null);
    setSkillName('');
    setSkillLevel('Beginner');
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (index) => {
    setEditIndex(index);
    setSkillName(skills[index].n);
    setSkillLevel(SKILL_LEVELS[skills[index].l] ? skills[index].l : 'Beginner');
    setError('');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const name = skillName.trim();
    if (!name) {
      setError('Please enter a skill name.');
      return;
    }

    const isDuplicate = skills.some(
      (s, i) => s.n.toLowerCase() === name.toLowerCase() && i !== editIndex
    );
    if (isDuplicate) {
      setError('This skill is already on your list.');
      return;
    }

    if (editIndex === null) {
      setSkills([...skills, { n: name, l: skillLevel, source: 'manual' }]);
      if (onToast) onToast(`Added "${name}" to skills`);
    } else {
      const updated = skills.map((s, i) =>
        i === editIndex ? { ...s, n: name, l: skillLevel } : s
      );
      setSkills(updated);
      if (onToast) onToast(`Updated "${name}" proficiency`);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (index) => {
    const skillToDelete = skills[index]?.n;
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    if (onToast) onToast(`Removed "${skillToDelete}"`);
  };

  return (
    <Card className="p-5">
      {showTitle && (
        <CardHeader
          right={
            <button
              onClick={openAddModal}
              className="text-sm font-semibold text-p hover:underline flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add skill
            </button>
          }
        >
          Skills overview
        </CardHeader>
      )}

      <p className="text-xs text-mute -mt-2 mb-3">
        Levels are set by you, reflecting your true project experience.
      </p>

      {skills.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No skills added yet"
          text="Add technical skills so recruiters can discover and match your profile to openings."
          action={<Button size="sm" onClick={openAddModal}>+ Add First Skill</Button>}
        />
      ) : (
        <ul className="space-y-3.5">
          {skills.map((skill, index) => (
            <li key={skill.n} className="group">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-semibold text-ink text-[13px]">{skill.n}</span>
                <div className="flex items-center gap-2 text-mute text-xs">
                  {skill.source === 'resume' && <span className="text-[10px] text-p bg-lav px-1.5 py-0.5 rounded">Resume</span>}
                  <span className="font-medium text-mute/90">{SKILL_LEVELS[skill.l] ? skill.l : 'Set level'}</span>
                  <button
                    aria-label={`Edit ${skill.n}`}
                    onClick={() => openEditModal(index)}
                    className="p-1 rounded text-mute hover:text-p hover:bg-lav transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    aria-label={`Remove ${skill.n}`}
                    onClick={() => handleDelete(index)}
                    className="p-1 rounded text-mute hover:text-err hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              {SKILL_LEVELS[skill.l] ? <div className="h-2 rounded-full bg-lav overflow-hidden">
                <div className="h-2 rounded-full bg-p transition-all duration-500 ease-out" style={{ width: `${SKILL_LEVELS[skill.l]}%` }} />
              </div> : <p className="text-[10px] text-mute">Detected in resume · proficiency level not set</p>}
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit Skill Modal */}
      {isModalOpen && (
        <Modal
          title={editIndex === null ? 'Add Technical Skill' : 'Edit Skill Proficiency'}
          onClose={() => setIsModalOpen(false)}
          maxWidth="max-w-sm"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Skill Name
              </label>
              <input
                autoFocus
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. React.js, Python, Docker"
                className="w-full h-10 px-3 rounded-xl border border-line bg-white text-sm focus:border-p focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1">
                Proficiency Level
              </label>
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-line bg-white text-sm focus:border-p focus:outline-none"
              >
                {Object.keys(SKILL_LEVELS).map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl} ({SKILL_LEVELS[lvl]}%)
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-1.5 text-xs text-err bg-red-50 p-2.5 rounded-lg border border-red-200">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                {editIndex === null ? 'Add Skill' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </Card>
  );
}
