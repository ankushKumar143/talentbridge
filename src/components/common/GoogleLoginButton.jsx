import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function GoogleLoginButton({ role }) {
  const container = useRef(null);
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState('');
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !container.current) return;
    let cancelled = false;
    const initialize = () => {
      if (cancelled || !window.google?.accounts?.id || !container.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async ({ credential }) => {
          try {
            const user = await googleLogin(role, credential);
            showToast(`Welcome, ${user.name}!`, 'success');
            navigate(user.role === 'student' ? '/student/overview' : '/recruiter/overview');
          } catch (err) { setError(err.message || 'Google sign-in failed.'); }
        },
      });
      window.google.accounts.id.renderButton(container.current, { theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: 360 });
    };
    if (window.google?.accounts?.id) initialize();
    else {
      let script = document.querySelector('script[data-google-identity]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true; script.dataset.googleIdentity = 'true';
        document.head.appendChild(script);
      }
      script.addEventListener('load', initialize);
      return () => { cancelled = true; script.removeEventListener('load', initialize); };
    }
    return () => { cancelled = true; };
  }, [clientId, role]);

  if (!clientId) return <p className="text-xs text-mute text-center">Google sign-in is unavailable until VITE_GOOGLE_CLIENT_ID is configured.</p>;
  return <div className="space-y-2"><div ref={container} className="flex justify-center min-h-10" />{error && <p role="alert" className="text-xs text-err text-center">{error}</p>}</div>;
}

