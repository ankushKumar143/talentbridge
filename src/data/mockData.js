export const INITIAL_STUDENT = {
  id: 'student-1',
  name: 'Aarav Sharma',
  first: 'Aarav',
  email: 'student@talentbridge.demo',
  role: 'student',
  phone: '+91 98765 43210',
  avatar: 'AS',
  headline: 'Final Year Computer Science Undergrad & Aspiring Frontend Engineer',
  college: 'National Institute of Technology',
  degree: 'B.Tech in Computer Science and Engineering',
  batch: '2023 - 2027',
  cgpa: '8.7 / 10.0',
  location: 'Bengaluru, India',
  about: 'Enthusiastic frontend developer with passion for building beautiful, responsive, and accessible user interfaces. Experienced with React, modern JavaScript, Tailwind CSS, and frontend state management.',
  resume: {
    fileName: 'Aarav_Sharma_Resume.pdf',
    fileSize: '182 KB',
    uploadedAt: 'Yesterday'
  },
  skills: [
    { n: 'React.js', l: 'Advanced' },
    { n: 'JavaScript', l: 'Advanced' },
    { n: 'Python', l: 'Intermediate' },
    { n: 'Node.js', l: 'Intermediate' },
    { n: 'SQL', l: 'Beginner' }
  ],
  education: [
    {
      institution: 'National Institute of Technology',
      degree: 'B.Tech - Computer Science & Engineering',
      duration: '2023 - 2027',
      score: '8.7 CGPA'
    },
    {
      institution: 'Delhi Public School',
      degree: 'Higher Secondary Certificate (Class XII)',
      duration: '2021 - 2023',
      score: '94.2%'
    }
  ],
  projects: [
    {
      title: 'TalentBridge Placement Portal',
      description: 'Comprehensive placement portal featuring role-based dashboards, applicant tracking, and dynamic analytics.',
      tags: ['React', 'Tailwind CSS', 'Vite'],
      link: 'https://github.com/aaravsharma/talentbridge'
    },
    {
      title: 'DevPulse Code Analytics',
      description: 'Developer metrics dashboard analyzing Git commit patterns and pull request cycle time with charts.',
      tags: ['React', 'Chart.js', 'REST API'],
      link: 'https://github.com/aaravsharma/devpulse'
    }
  ],
  certifications: [
    'Meta Front-End Developer Professional Certificate',
    'JavaScript Algorithms and Data Structures (freeCodeCamp)'
  ]
};

export const INITIAL_RECRUITER = {
  id: 'recruiter-1',
  name: 'Neha Verma',
  first: 'Neha',
  email: 'recruiter@talentbridge.demo',
  role: 'recruiter',
  title: 'Lead Technical Talent Partner',
  company: 'TechNova Solutions',
  companyLogo: 'TN',
  website: 'https://technova.example.com',
  location: 'Bengaluru, India',
  phone: '+91 91234 56789',
  description: 'TechNova Solutions is a fast-growing cloud product company engineering next-generation collaborative workflows and developer tooling.',
  industry: 'Software & Technology',
  teamSize: '150 - 500 employees'
};

export const INITIAL_JOBS = [
  {
    id: 1,
    title: 'Frontend Developer Intern',
    company: 'TechNova Solutions',
    loc: 'Bengaluru',
    mode: 'Remote',
    type: 'Internship',
    pay: '₹25,000/mo',
    skills: ['React.js', 'JavaScript', 'Tailwind'],
    match: 92,
    about: 'Build student-facing UI features with a product team. You will ship components weekly and pair with senior engineers.',
    requirements: 'Proficiency in React.js, modern JavaScript (ES6+), and Tailwind CSS. Understanding of responsive design and state management.',
    openings: 3,
    experience: '0-1 years (Students / Freshers)',
    deadline: '2026-11-30',
    postedDate: '25 Oct 2026',
    eligibility: 'B.Tech / B.E. / BCA / MCA in CS / IT (Min 60% / 6.0 CGPA)',
    status: 'Active',
    recruiterId: 'recruiter-1'
  },
  {
    id: 2,
    title: 'Python Developer Intern',
    company: 'CodeSphere',
    loc: 'Gurugram',
    mode: 'Hybrid',
    type: 'Internship',
    pay: '₹20,000/mo',
    skills: ['Python', 'SQL', 'Flask'],
    match: 87,
    about: 'Work on backend services and data pipelines. Good fit if you enjoy APIs and clean, tested code.',
    requirements: 'Solid knowledge of Python, relational databases (PostgreSQL/MySQL), and RESTful API frameworks like Flask or FastAPI.',
    openings: 2,
    experience: 'Fresher / 2026 or 2027 batch',
    deadline: '2026-11-28',
    postedDate: '28 Oct 2026',
    eligibility: 'Engineering graduates with strong foundational problem solving.',
    status: 'Active',
    recruiterId: 'recruiter-2'
  },
  {
    id: 3,
    title: 'Junior React Developer',
    company: 'PixelWorks',
    loc: 'Pune',
    mode: 'On-site',
    type: 'Full-time',
    pay: '₹6.5 LPA',
    skills: ['React.js', 'Node.js', 'JavaScript'],
    match: 84,
    about: 'Join the design-systems squad and help maintain a shared component library used across products.',
    requirements: 'Strong experience with React, component-driven development, CSS/SCSS or CSS-in-JS, and build tools.',
    openings: 4,
    experience: '0-2 years',
    deadline: '2026-12-05',
    postedDate: '01 Nov 2026',
    eligibility: 'Degree in Engineering or Computer Applications.',
    status: 'Active',
    recruiterId: 'recruiter-3'
  },
  {
    id: 4,
    title: 'Data Analyst Intern',
    company: 'Insight Labs',
    loc: 'Remote',
    mode: 'Remote',
    type: 'Internship',
    pay: '₹18,000/mo',
    skills: ['SQL', 'Python', 'Excel'],
    match: 79,
    about: 'Analyse product usage data, build dashboards and present findings to the growth team.',
    requirements: 'Proficient in SQL querying, Python for data manipulation (pandas, numpy), and dashboarding tools.',
    openings: 2,
    experience: 'Students / 2026-2027 graduates',
    deadline: '2026-11-25',
    postedDate: '22 Oct 2026',
    eligibility: 'Any STEM graduate with analytical acumen.',
    status: 'Active',
    recruiterId: 'recruiter-4'
  },
  {
    id: 5,
    title: 'Node.js Backend Developer',
    company: 'CloudKart',
    loc: 'Noida',
    mode: 'Hybrid',
    type: 'Full-time',
    pay: '₹7 LPA',
    skills: ['Node.js', 'SQL', 'AWS'],
    match: 72,
    about: 'Design REST APIs for a fast-growing marketplace and own services end to end.',
    requirements: 'Hands-on backend development with Node.js/Express, relational database schema design, and basic cloud awareness.',
    openings: 3,
    experience: '0-1 years',
    deadline: '2026-12-10',
    postedDate: '04 Nov 2026',
    eligibility: 'B.Tech / B.E. in CS / IT / ECE.',
    status: 'Active',
    recruiterId: 'recruiter-5'
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    jobId: 1,
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'student@talentbridge.demo',
    studentPhone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech CSE (8.7 CGPA)',
    skills: ['React.js', 'JavaScript', 'Tailwind'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    company: 'TechNova Solutions',
    role: 'Frontend Developer Intern',
    appliedDate: '02 Nov 2026',
    status: 'Shortlisted',
    notes: 'Shortlisted based on portfolio evaluation.'
  },
  {
    id: 'app-2',
    jobId: 3,
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'student@talentbridge.demo',
    studentPhone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech CSE (8.7 CGPA)',
    skills: ['React.js', 'Node.js', 'JavaScript'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    company: 'PixelWorks',
    role: 'Junior React Developer',
    appliedDate: '30 Oct 2026',
    status: 'Under Review',
    notes: 'Resume under review by engineering manager.'
  },
  {
    id: 'app-3',
    jobId: 99,
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'student@talentbridge.demo',
    studentPhone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech CSE (8.7 CGPA)',
    skills: ['SQL', 'Python', 'Excel'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    company: 'DataNest',
    role: 'Data Analyst Intern',
    appliedDate: '27 Oct 2026',
    status: 'Rejected',
    notes: 'Position closed for internal candidate.'
  },
  {
    id: 'app-4',
    jobId: 2,
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'student@talentbridge.demo',
    studentPhone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech CSE (8.7 CGPA)',
    skills: ['Python', 'SQL', 'Flask'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    company: 'CodeSphere',
    role: 'Python Trainee',
    appliedDate: '24 Oct 2026',
    status: 'Under Review',
    notes: 'Technical assessment sent.'
  },
  {
    id: 'app-5',
    jobId: 4,
    studentId: 'student-1',
    studentName: 'Aarav Sharma',
    studentEmail: 'student@talentbridge.demo',
    studentPhone: '+91 98765 43210',
    college: 'National Institute of Technology',
    degree: 'B.Tech CSE (8.7 CGPA)',
    skills: ['SQL', 'Python', 'Excel'],
    resumeName: 'Aarav_Sharma_Resume.pdf',
    company: 'Insight Labs',
    role: 'BI Intern',
    appliedDate: '20 Oct 2026',
    status: 'Applied',
    notes: 'Application received and logged.'
  },
  {
    id: 'app-6',
    jobId: 1,
    studentId: 'student-2',
    studentName: 'Rhea Sengupta',
    studentEmail: 'rhea.s@college.edu',
    studentPhone: '+91 98111 22334',
    college: 'IIT Roorkee',
    degree: 'B.Tech ECE (9.1 CGPA)',
    skills: ['React.js', 'TypeScript', 'Tailwind', 'Redux'],
    resumeName: 'Rhea_Sengupta_CV.pdf',
    company: 'TechNova Solutions',
    role: 'Frontend Developer Intern',
    appliedDate: '05 Nov 2026',
    status: 'Under Review',
    notes: 'High CGPA and great projects.'
  },
  {
    id: 'app-7',
    jobId: 1,
    studentId: 'student-3',
    studentName: 'Kunal Patel',
    studentEmail: 'kunal.p@univ.ac.in',
    studentPhone: '+91 98222 33445',
    college: 'BITS Pilani',
    degree: 'B.E. Computer Science (8.4 CGPA)',
    skills: ['React.js', 'Next.js', 'CSS Modules'],
    resumeName: 'Kunal_Patel_Resume.pdf',
    company: 'TechNova Solutions',
    role: 'Frontend Developer Intern',
    appliedDate: '07 Nov 2026',
    status: 'Accepted',
    notes: 'Offered position.'
  },
  {
    id: 'app-8',
    jobId: 1,
    studentId: 'student-4',
    studentName: 'Ananya Iyer',
    studentEmail: 'ananya.iyer@eng.edu',
    studentPhone: '+91 98333 44556',
    college: 'PES University',
    degree: 'B.Tech Information Science (7.9 CGPA)',
    skills: ['HTML', 'CSS', 'JavaScript', 'Vue'],
    resumeName: 'Ananya_Iyer_Resume.pdf',
    company: 'TechNova Solutions',
    role: 'Frontend Developer Intern',
    appliedDate: '08 Nov 2026',
    status: 'Rejected',
    notes: 'Missing required React experience.'
  }
];

export const INITIAL_ACTIVITY = [
  {
    i: 'send',
    t: 'Application submitted',
    d: 'Frontend Developer Intern at TechNova Solutions',
    w: '2 hours ago'
  },
  {
    i: 'file',
    t: 'Resume updated',
    d: 'Aarav_Sharma_Resume.pdf uploaded',
    w: 'Yesterday'
  },
  {
    i: 'check',
    t: 'Job shortlisted',
    d: 'TechNova Solutions moved you to Shortlisted',
    w: '2 days ago'
  },
  {
    i: 'user',
    t: 'Profile completed to 85%',
    d: 'Education and projects added',
    w: '5 days ago'
  }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 'notif-1', t: 'TechNova Solutions shortlisted you', w: '1h ago', read: false },
  { id: 'notif-2', t: '3 new jobs match your skills', w: '4h ago', read: false },
  { id: 'notif-3', t: 'Complete your certifications to reach 100%', w: '1d ago', read: true }
];

export const SKILL_LEVELS = {
  Beginner: 33,
  Intermediate: 66,
  Advanced: 100
};
