import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useApp } from '../context/AppContext.jsx';

const emptyOffer = {
  title: '',
  description: '',
  imageUrl: '',
  startDate: '',
  endDate: ''
};

export default function AdminOffers() {
  const { offers, setOffers, translation } = useApp();
  const [formData, setFormData] = useState(emptyOffer);
  const [editOffer, setEditOffer] = useState(null);

  const handleSave = (event) => {
    event.preventDefault();
    const active = new Date(formData.endDate) >= new Date();
    if (editOffer) {
      setOffers(offers.map((offer) => (offer._id === editOffer._id ? { ...offer, ...formData, active } : offer)));
    } else {
      setOffers([...offers, { ...formData, _id: `o${Date.now()}`, active }]);
    }
    setEditOffer(null);
    setFormData(emptyOffer);
  };

  const handleEdit = (offer) => {
    setEditOffer(offer);
    setFormData(offer);
  };

  const handleDelete = (id) => {
    setOffers(offers.filter((offer) => offer._id !== id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr] pb-10">
      <AdminSidebar />
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.offers}</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">Offer management</h1>
          </div>
          <button onClick={() => { setFormData(emptyOffer); setEditOffer(null); }} className="inline-flex items-center justify-center rounded-3xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
            Add offer
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Offer title
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Offer title"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Offer description
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Offer description"
              rows="3"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            Banner image URL
            <input
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="Image URL"
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              Start date
              <input
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                type="date"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              End date
              <input
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                type="date"
                className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="inline-flex items-center justify-center rounded-3xl bg-success px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700">{translation.save}</button>
            <button type="button" onClick={() => { setFormData(emptyOffer); setEditOffer(null); }} className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">{translation.cancel}</button>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto rounded-[28px] border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Dates</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-slate-500">No offers available yet.</td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer._id}>
                    <td className="px-4 py-4 font-semibold text-slate-950">{offer.title}</td>
                    <td className="px-4 py-4 text-slate-600">{offer.startDate} – {offer.endDate}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${offer.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {offer.active ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-4 py-4 space-x-2">
                      <button onClick={() => handleEdit(offer)} className="rounded-3xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">Edit</button>
                      <button onClick={() => handleDelete(offer._id)} className="rounded-3xl bg-danger px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600">Delete</button>
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
