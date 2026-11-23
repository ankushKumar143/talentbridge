export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function apiRequest(path, { method = 'GET', body, formData, token, ...options } = {}) {
  const savedToken = token || localStorage.getItem('tb_access_token');
  const headers = { ...(options.headers || {}) };
  if (savedToken) headers.Authorization = `Bearer ${savedToken}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    method,
    headers,
    body: formData || (body === undefined ? undefined : JSON.stringify(body)),
  });
  const payload = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload.detail;
    const message = typeof detail === 'string' ? detail
      : Array.isArray(detail) ? detail.map((item) => {
        const field = Array.isArray(item.loc) ? item.loc.slice(1).join('.') : '';
        return field ? `${field}: ${item.msg || 'Invalid value'}` : (item.msg || 'Invalid request');
      }).join('; ')
      : detail && typeof detail === 'object' ? Object.values(detail).map(String).join('; ')
      : `Request failed (${response.status})`;
    throw new Error(message || `Request failed (${response.status})`);
  }
  return payload;
}

export async function apiBlobRequest(path) {
  const token = localStorage.getItem('tb_access_token');
  const response = await fetch(`${API_BASE}${path}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.detail || `Request failed (${response.status})`);
  }
  return response.blob();
}

export function uiJobFromApi(job) {
  return { ...job.data, id: job.id, recruiterId: job.recruiter_id, title: job.title, company: job.company,
    about: job.description, status: job.status, postedDate: 'Recently', description: job.description };
}

