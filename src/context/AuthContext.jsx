import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api/client';
import { INITIAL_STUDENT, INITIAL_RECRUITER } from '../data/mockData';

const AuthContext = createContext(null);
const skillKey = (value) => {
  const key = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (['node', 'nodejs'].includes(key)) return 'nodejs';
  if (['react', 'reactjs'].includes(key)) return 'react';
  if (['tailwind', 'tailwindcss'].includes(key)) return 'tailwind';
  if (['postgres', 'postgresql'].includes(key)) return 'postgresql';
  return key;
};
const degreeKey = (value) => {
  const key = String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (key.includes('computerapplications') || key === 'bca' || key.includes('bachelorofcomputerapplications')) return 'bca';
  if (key.includes('technology') || key === 'btech' || key === 'mtech') return key.includes('master') || key === 'mtech' ? 'mtech' : 'btech';
  if (key.includes('engineering') || key === 'be') return 'be';
  if (key.includes('computerscience') || key === 'bsc' || key === 'msc') return key.includes('master') || key === 'msc' ? 'msc' : 'bsc';
  if (key.includes('businessadministration') || key === 'mba') return 'mba';
  if (key === 'mca') return 'mca';
  return key;
};
const mergeResumeData = (profile) => {
  const parsed = profile?.resume?.parsed;
  if (!parsed) return profile;
  const next = { ...profile };
  const parsedSkills = parsed.skills;
  if (Array.isArray(parsedSkills) && parsedSkills.length) {
    const skills = Array.isArray(next.skills) ? next.skills.filter((skill) => skill?.source !== 'resume').map((skill) => typeof skill === 'string' ? { n: skill, l: 'Not rated', source: 'profile' } : skill) : [];
    const seen = new Set(skills.map((skill) => skillKey(skill?.n)).filter(Boolean));
    parsedSkills.forEach((name) => {
      if (typeof name !== 'string' || !name.trim() || seen.has(skillKey(name))) return;
      skills.push({ n: name.trim(), l: 'Not rated', source: 'resume' });
      seen.add(skillKey(name));
    });
    next.skills = skills;
  }

  const education = parsed.education || {};
  const educationEntries = Array.isArray(education.entries) ? education.entries : (Array.isArray(education) ? education : []);
  const colleges = educationEntries.length ? educationEntries.map((item) => item?.institution).filter(Boolean) : (education.colleges || []);
  const degrees = educationEntries.length ? educationEntries.map((item) => item?.degree).filter(Boolean) : (education.degrees || []);
  if (!next.phone && parsed.candidate?.phone_numbers?.length) next.phone = parsed.candidate.phone_numbers[0];
  if (colleges.length && (!next.college || degreeKey(next.college) === degreeKey(degrees[0]))) next.college = colleges[0];
  if (degrees.length && (!next.degree || degreeKey(next.degree) === degreeKey(degrees[0]))) next.degree = degrees[0];
  if (!next.cgpa && educationEntries.some((item) => item.score)) next.cgpa = educationEntries.find((item) => item.score)?.score;

  const detectedEducation = educationEntries.length ? educationEntries.map((item) => ({
    institution: item.institution || '', degree: item.degree || '', duration: item.duration || 'From resume', score: item.score || '', source: 'resume',
  })).filter((item) => item.institution || item.degree) : Array.from({ length: Math.max(colleges.length, degrees.length) }, (_, index) => ({
    institution: colleges[index] || '', degree: degrees[index] || '', duration: 'From resume', score: '', source: 'resume',
  })).filter((item) => item.institution || item.degree);
  const existingEducation = Array.isArray(next.education) ? next.education.filter((item) => item?.source !== 'resume') : [];
  const knownEducation = new Set(existingEducation.map((item) => `${item.institution || ''}|${item.degree || ''}`.toLowerCase()));
  detectedEducation.forEach((item) => {
    const key = `${item.institution}|${item.degree}`.toLowerCase();
    if (!knownEducation.has(key)) { existingEducation.push(item); knownEducation.add(key); }
  });
  next.education = existingEducation;

  const detectedProjects = (Array.isArray(parsed.projects) ? parsed.projects : []).map((item) => {
    if (item && typeof item === 'object') return {
      title: item.title || item.name || item.description || 'Resume project',
      description: typeof item.description === 'string' ? item.description : '',
      tags: [...(Array.isArray(item.technologies) ? item.technologies : item.technologies ? [item.technologies] : []), ...(Array.isArray(item.tags) ? item.tags : [])],
      link: item.link || item.url || '', source: 'resume',
    };
    const text = String(item || '').trim();
    if (!text) return null;
    const parts = text.split(/\s+[—–-]\s+|:\s+/);
    return { title: parts[0].trim().slice(0, 100) || 'Resume project', description: parts.length > 1 ? parts.slice(1).join(' — ').trim() : text, tags: [], link: '', source: 'resume' };
  }).filter(Boolean);
  const existingProjects = Array.isArray(next.projects) ? next.projects.filter((item) => item?.source !== 'resume') : [];
  const knownProjects = new Set(existingProjects.map((item) => `${item.title || ''}|${item.description || ''}`.toLowerCase()));
  detectedProjects.forEach((item) => {
    const key = `${item.title}|${item.description}`.toLowerCase();
    if (!knownProjects.has(key)) { existingProjects.push(item); knownProjects.add(key); }
  });
  next.projects = existingProjects;
  if (!next.about) {
    const highlights = [next.degree || degrees[0], next.college || colleges[0]].filter(Boolean).join(' at ');
    const skillSummary = (parsedSkills || []).slice(0, 6).join(', ');
    const projectSummary = detectedProjects.map((item) => item.title).filter(Boolean).slice(0, 3).join(', ');
    const summary = [highlights, skillSummary && `Skills include ${skillSummary}`, projectSummary && `Projects include ${projectSummary}`].filter(Boolean);
    if (summary.length) next.about = `Resume highlights: ${summary.join('. ')}.`;
  }
  return next;
};
const profileFrom = (user) => mergeResumeData({ ...(user?.profile && typeof user.profile === 'object' ? user.profile : {}),
  id: user?.id, name: user?.name || 'User', first: (user?.name || 'User').split(' ')[0], email: user?.email,
  role: user?.role, avatar: (user?.name || 'U').slice(0, 2).toUpperCase() });

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (!localStorage.getItem('tb_access_token')) return null;
    try { return JSON.parse(localStorage.getItem('tb_user') || 'null'); } catch { return null; }
  });
  const [studentProfile, setStudentProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('tb_student')) || INITIAL_STUDENT; } catch { return INITIAL_STUDENT; } });
  const [recruiterProfile, setRecruiterProfile] = useState(() => { try { return JSON.parse(localStorage.getItem('tb_recruiter')) || INITIAL_RECRUITER; } catch { return INITIAL_RECRUITER; } });
  const [authLoading, setAuthLoading] = useState(Boolean(localStorage.getItem('tb_access_token')));

  const saveAuth = (result) => {
    const user = profileFrom(result.user);
    localStorage.setItem('tb_access_token', result.access_token);
    localStorage.setItem('tb_user', JSON.stringify(user));
    if (user.role === 'student') { setStudentProfile(user); localStorage.setItem('tb_student', JSON.stringify(user)); }
    else { setRecruiterProfile(user); localStorage.setItem('tb_recruiter', JSON.stringify(user)); }
    setCurrentUser(user);
    return user;
  };

  useEffect(() => {
    const token = localStorage.getItem('tb_access_token');
    if (!token) { setAuthLoading(false); return; }
    apiRequest('/api/auth/me', { token }).then((user) => {
      const profile = profileFrom(user); setCurrentUser(profile); localStorage.setItem('tb_user', JSON.stringify(profile));
      if (user.role === 'student') { setStudentProfile(profile); localStorage.setItem('tb_student', JSON.stringify(profile)); }
      else { setRecruiterProfile(profile); localStorage.setItem('tb_recruiter', JSON.stringify(profile)); }
    }).catch(() => { localStorage.removeItem('tb_access_token'); localStorage.removeItem('tb_user'); setCurrentUser(null); }).finally(() => setAuthLoading(false));
  }, []);

  const login = async (role, email, password) => {
    const result = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
    if (result.user.role !== role) throw new Error(`This account is registered as ${result.user.role}.`);
    return saveAuth(result);
  };
  const register = async (role, userData) => {
    const profile = { ...userData };
    delete profile.password; delete profile.role; delete profile.email; delete profile.name;
    const result = await apiRequest('/api/auth/register', { method: 'POST', body: {
      name: userData.name, email: userData.email, password: userData.password, role, profile,
    } });
    return saveAuth(result);
  };
  const googleLogin = async (role, credential) => {
    const result = await apiRequest('/api/auth/google', { method: 'POST', body: { role, credential } });
    return saveAuth(result);
  };
  const logout = () => { localStorage.removeItem('tb_access_token'); localStorage.removeItem('tb_user'); setCurrentUser(null); };
  const updateProfile = (role, newData) => {
    const setter = role === 'student' ? setStudentProfile : setRecruiterProfile;
    setter((prev) => {
      const next = role === 'student' ? mergeResumeData({ ...prev, ...newData }) : { ...prev, ...newData };
      localStorage.setItem(role === 'student' ? 'tb_student' : 'tb_recruiter', JSON.stringify(next));
      if (localStorage.getItem('tb_access_token')) {
        const profile = { ...next };
        ['id', 'name', 'email', 'role', 'first', 'avatar', 'company', 'companyLogo'].forEach((key) => delete profile[key]);
        apiRequest('/api/auth/profile', { method: 'PATCH', body: { name: next.name, profile } }).catch((err) => console.error('Could not sync profile:', err.message));
      }
      return next;
    });
  };
  const updateStudentProfile = (data) => updateProfile('student', data);
  const updateRecruiterProfile = (data) => updateProfile('recruiter', data);
  const resetDemoData = () => { localStorage.clear(); setCurrentUser(null); setStudentProfile(INITIAL_STUDENT); setRecruiterProfile(INITIAL_RECRUITER); };

  const value = useMemo(() => ({ currentUser, studentProfile, recruiterProfile, login, register, googleLogin, logout,
    updateStudentProfile, updateRecruiterProfile, resetDemoData, authLoading,
    isAuthenticated: Boolean(currentUser), isStudent: currentUser?.role === 'student', isRecruiter: currentUser?.role === 'recruiter' }),
  [currentUser, studentProfile, recruiterProfile, authLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
