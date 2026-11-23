import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { INITIAL_JOBS } from '../data/mockData';
import { useAuth } from './AuthContext';
import { apiRequest, uiJobFromApi } from '../api/client';

const JobContext = createContext(null);

export function JobProvider({ children }) {
  const { currentUser, studentProfile } = useAuth();
  const [jobs, setJobs] = useLocalStorage('tb_jobs', []);
  const [savedJobIdList, setSavedJobIdList] = useLocalStorage('tb_saved_jobs', []);

  useEffect(() => {
    if (!currentUser) { setJobs([]); setSavedJobIdList([]); return; }
    setJobs([]);
    const loadJobs = async () => {
      try {
        const rows = await apiRequest(currentUser.role === 'recruiter' ? '/api/jobs/mine' : '/api/jobs');
        let mapped = rows.map((row) => ({ ...uiJobFromApi(row), match: null, matchDetails: null }));
        if (currentUser.role === 'student') {
          try {
            const result = await apiRequest('/api/jobs/match-scores');
            const byId = new Map((result.matches || []).map((item) => [String(item.job_id), item]));
            mapped = mapped.map((job) => {
              const match = byId.get(String(job.id));
              return { ...job, match: match?.score ?? null, matchDetails: match?.analysis ?? null };
            });
          } catch (err) {
            console.error('Could not calculate resume job matches:', err.message);
          }
        }
        setJobs(mapped);
      } catch (err) {
        console.error('Could not load jobs:', err.message);
      }
    };
    loadJobs();
    if (currentUser.role === 'student') apiRequest('/api/saved-jobs').then(setSavedJobIdList).catch((err) => console.error('Could not load saved jobs:', err.message));
  }, [currentUser?.id, studentProfile?.resume, studentProfile?.skills]);

  const savedJobIds = useMemo(() => new Set(savedJobIdList), [savedJobIdList]);

  const addJob = async (jobData) => {
    const created = await apiRequest('/api/jobs', { method: 'POST', body: {
      title: jobData.title, company: jobData.company,
      description: [jobData.about, jobData.requirements].filter(Boolean).join('\n\n'), data: jobData, status: jobData.status === 'Draft' ? 'Draft' : 'Active',
    } });
    const newJob = uiJobFromApi(created);
    setJobs((prev) => [newJob, ...prev]);
    return newJob;
  };

  const updateJob = async (updatedJob) => {
    await apiRequest(`/api/jobs/${updatedJob.id}`, { method: 'PATCH', body: {
      title: updatedJob.title, company: updatedJob.company,
      description: [updatedJob.about, updatedJob.requirements].filter(Boolean).join('\n\n'),
      data: updatedJob, status: updatedJob.status,
    } });
    setJobs((prev) => prev.map((job) => job.id === updatedJob.id ? { ...job, ...updatedJob } : job));
  };

  const deleteJob = async (jobId) => {
    await apiRequest(`/api/jobs/${jobId}`, { method: 'DELETE' });
    setJobs((prev) => prev.filter((job) => job.id !== jobId));
    setSavedJobIdList((prev) => prev.filter((id) => id !== jobId));
  };

  const toggleJobStatus = async (jobId) => {
    const job = jobs.find((item) => String(item.id) === String(jobId));
    if (!job) return;
    const status = job.status === 'Active' ? 'Closed' : 'Active';
    await apiRequest(`/api/jobs/${jobId}`, { method: 'PATCH', body: { status } });
    setJobs((prev) => prev.map((item) => String(item.id) === String(jobId) ? { ...item, status } : item));
  };

const toggleSaveJob = (jobId) => {
    const wasSaved = savedJobIds.has(jobId);
    const nextSaved = !wasSaved;
    setSavedJobIdList((prev) => nextSaved ? [...prev, jobId] : prev.filter((id) => String(id) !== String(jobId)));
    const request = apiRequest(`/api/saved-jobs/${jobId}`, { method: nextSaved ? 'POST' : 'DELETE' });
    request.catch((err) => {
      console.error('Could not update saved jobs:', err.message);
      setSavedJobIdList((prev) => nextSaved ? prev.filter((id) => String(id) !== String(jobId)) : [...prev, jobId]);
    });
    return nextSaved;
  };  const isJobSaved = (jobId) => savedJobIds.has(jobId);
  const getJobById = (jobId) => jobs.find((job) => String(job.id) === String(jobId));

  const value = { jobs, savedJobIds, addJob, updateJob, deleteJob, toggleJobStatus, toggleSaveJob, isJobSaved, getJobById };
  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) throw new Error('useJobs must be used within a JobProvider');
  return context;
}








