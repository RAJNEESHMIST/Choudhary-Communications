import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function AdminLogin() {
  const { credentials, setAdmin, translation } = useApp();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.username === credentials.username && form.password === credentials.password) {
      const adminState = { loggedIn: true, username: form.username, loginTime: new Date().toISOString() };
      setAdmin(adminState);
      localStorage.setItem('shopAdmin', JSON.stringify(adminState));
      navigate('/admin/dashboard');
      return;
    }
    setError('Invalid username or password');
  };

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-panel">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Admin access</p>
        <h1 className="text-3xl font-semibold text-slate-950">{translation.adminLogin}</h1>
        <p className="text-sm leading-6 text-slate-600">Use the admin credentials configured in environment variables to access the control panel.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          {translation.username}
          <input
            type="text"
            autoComplete="username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-invalid={!!error}
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          {translation.password}
          <input
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-3 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-invalid={!!error}
          />
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          {translation.login}
        </button>
      </form>
    </div>
  );
}
