import React from 'react';
import { FileText, Download, Printer, CheckCircle2, Building2, GraduationCap } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export default function ResumePreviewModal({
  candidate,
  onClose,
  onToast
}) {
  if (!candidate) return null;

  const handleDownload = () => {
    if (onToast) onToast(`Downloaded ${candidate.resumeName || 'Candidate_Resume.pdf'}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      title="Resume Document Preview"
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-4">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between p-3 bg-bg rounded-xl border border-line">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-p" />
            <span className="text-sm font-semibold text-ink">
              {candidate.resumeName || `${candidate.studentName || 'Candidate'}_Resume.pdf`}
            </span>
            <span className="text-xs text-mute hidden sm:inline">• Verified Candidate Document</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleDownload}
            >
              Download PDF
            </Button>
          </div>
        </div>

        {/* Paper-styled Resume Container */}
        <div className="p-8 bg-white border border-line shadow-sm rounded-2xl space-y-6 text-ink max-h-[60vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-line pb-4 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              {candidate.studentName || 'Aarav Sharma'}
            </h2>
            <p className="text-xs text-mute mt-1">
              {candidate.studentEmail} • {candidate.studentPhone || '+91 98765 43210'} • Bengaluru, India
            </p>
            <p className="text-xs text-p font-medium mt-1">
              Aspiring Software Engineer & Frontend Specialist
            </p>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line pb-1 mb-2">
              Education
            </h3>
            <div className="text-xs space-y-1">
              <div className="flex justify-between font-semibold">
                <span>{candidate.college || 'National Institute of Technology'}</span>
                <span>2023 - 2027</span>
              </div>
              <div className="flex justify-between text-mute">
                <span>{candidate.degree || 'B.Tech in Computer Science and Engineering'}</span>
                <span className="font-semibold text-ok">8.7 / 10.0 CGPA</span>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line pb-1 mb-2">
              Technical Proficiencies
            </h3>
            <p className="text-xs text-ink/90 leading-relaxed">
              <b>Core Languages & Frameworks:</b> {candidate.skills ? candidate.skills.join(', ') : 'React.js, JavaScript (ES6+), Python, Node.js, SQL, Tailwind CSS'}
            </p>
            <p className="text-xs text-ink/90 mt-1">
              <b>Tools & Environments:</b> Git, GitHub, Vite, Postman, Linux, VS Code
            </p>
          </div>

          {/* Key Projects */}
          <div>
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider border-b border-line pb-1 mb-2">
              Academic & Placement Projects
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <p className="font-semibold text-ink">TalentBridge Placement Platform</p>
                <p className="text-mute mt-0.5">
                  Architected a responsive single-page campus recruitment portal with React, Tailwind CSS, and client-side state persistence.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink">DevPulse Code Analytics</p>
                <p className="text-mute mt-0.5">
                  Engineered Git repository analytics dashboard measuring team commit frequency and code review throughput.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="ghost" onClick={onClose}>
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  );
}
