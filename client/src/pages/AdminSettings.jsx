import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';

export default function AdminSettings() {
  const { settings, setSettings, translation } = useApp();
  const [formData, setFormData] = useState(settings);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      const response = await fetch(`${apiBase}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Unable to save settings');
      }

      const updatedSettings = await response.json();
      setSettings(updatedSettings);
      setMessage('Settings saved successfully.');
    } catch (error) {
      console.error(error);
      setError('Failed to save settings.');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] pb-10">
      <AdminSidebar />
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Contact settings</p>
          <h1 className="text-3xl font-semibold text-slate-950">{translation.contact}</h1>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            WhatsApp URL
            <input
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="WhatsApp URL"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Phone number
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone number"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Address
            <input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Google Maps link
            <input
              value={formData.mapLink}
              onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
              placeholder="Google Maps link"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Shop timings
            <input
              value={formData.timings}
              onChange={(e) => setFormData({ ...formData, timings: e.target.value })}
              placeholder="Shop timings"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">{translation.save}</button>
          </div>

          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </section>
    </div>
  );
}
