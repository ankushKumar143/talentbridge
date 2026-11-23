import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../api/client';
import Button from '../components/common/Button';

export function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [message, setMessage] = useState(token ? 'Verifying your email…' : 'Verification link is missing.');
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!token) return;
    apiRequest('/api/auth/verify-email', { method: 'POST', body: { token } })
      .then((result) => setMessage(result.message)).catch((err) => { setError(true); setMessage(err.message); });
  }, [token]);
  return <AuthMessage title="Email verification" message={message} error={error} />;
}

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try { const result = await apiRequest('/api/auth/password-reset/request', { method: 'POST', body: { email } }); setMessage(result.message); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <AuthShell title="Reset your password"><form onSubmit={submit} className="space-y-4"><label className="block text-sm">Account email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-xl border p-3" /></label>{message && <p role="status" className="text-sm text-green-700">{message}</p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<Button type="submit" disabled={busy} className="w-full">{busy ? 'Sending…' : 'Send reset link'}</Button></form></AuthShell>;
}

export function ResetPassword() {
  const [params] = useSearchParams(); const token = params.get('token');
  const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try { const result = await apiRequest('/api/auth/password-reset/confirm', { method: 'POST', body: { token, password } }); setMessage(result.message); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <AuthShell title="Choose a new password"><form onSubmit={submit} className="space-y-4"><label className="block text-sm">New password<input type="password" minLength={8} maxLength={128} required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-xl border p-3" /></label><label className="block text-sm">Confirm password<input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 block w-full rounded-xl border p-3" /></label>{message && <p role="status" className="text-sm text-green-700">{message} <Link className="underline" to="/login">Sign in</Link></p>}{error && <p role="alert" className="text-sm text-red-700">{error}</p>}<Button type="submit" disabled={busy || !token} className="w-full">{busy ? 'Updating…' : 'Update password'}</Button></form></AuthShell>;
}

function AuthMessage({ title, message, error }) { return <AuthShell title={title}><p className={error ? 'text-red-700' : 'text-green-700'}>{message}</p><Link className="mt-4 inline-block text-sm text-p underline" to="/login">Continue to sign in</Link></AuthShell>; }
function AuthShell({ title, children }) { return <main className="min-h-screen bg-bg grid place-items-center p-4"><section className="w-full max-w-md rounded-3xl border border-line bg-white p-8 shadow-card"><Link to="/" className="font-bold text-p">TalentBridge</Link><h1 className="mt-5 text-2xl font-bold">{title}</h1><div className="mt-6">{children}</div></section></main>; }
