import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useApp } from '../context/AppContext.jsx';

const emptyService = {
  title: '',
  description: '',
  icon: '🔧'
};

export default function AdminServices() {
  const { services, setServices, translation } = useApp();
  const [formData, setFormData] = useState(emptyService);
  const [editService, setEditService] = useState(null);

  const handleSave = (event) => {
    event.preventDefault();
    if (editService) {
      setServices(services.map((item) => (item._id === editService._id ? { ...item, ...formData } : item)));
    } else {
      setServices([...services, { ...formData, _id: `s${Date.now()}` }]);
    }
    setFormData(emptyService);
    setEditService(null);
  };

  const handleEdit = (service) => {
    setEditService(service);
    setFormData(service);
  };

  const handleDelete = (id) => {
    setServices(services.filter((service) => service._id !== id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] pb-10">
      <AdminSidebar />
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.services}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Service management</h1>
          </div>
          <button onClick={() => { setFormData(emptyService); setEditService(null); }} className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Add service
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Service title
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Service title"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Icon or emoji
            <input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Icon or emoji"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Service description
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Service description"
              rows="3"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">{translation.save}</button>
            <button type="button" onClick={() => { setFormData(emptyService); setEditService(null); }} className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{translation.cancel}</button>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">Description</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {services.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-4 py-6 text-center text-slate-500">No services available yet.</td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id}>
                    <td className="px-4 py-4 font-semibold text-slate-950">{service.icon} {service.title}</td>
                    <td className="px-4 py-4 text-slate-600">{service.description}</td>
                    <td className="px-4 py-4 space-x-2">
                      <button onClick={() => handleEdit(service)} className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Edit</button>
                      <button onClick={() => handleDelete(service._id)} className="rounded-3xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
