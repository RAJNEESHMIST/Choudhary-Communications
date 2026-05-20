import { useApp } from '../context/AppContext.jsx';
import AdminSidebar from '../components/AdminSidebar.jsx';

export default function AdminDashboard() {
  const { products, offers, services, translation } = useApp();

  return (
    <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
      <AdminSidebar />
      <section className="space-y-8 rounded-[32px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Admin</p>
          <h1 className="text-3xl font-semibold text-slate-950">{translation.dashboard}</h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600">Overview of products, offers and services. Manage your store inventory and updates with fast, intuitive controls.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{translation.totalProducts}</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">{products.length}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{translation.activeOffers}</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">{offers.filter((item) => item.active).length}</p>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{translation.servicesCount}</p>
            <p className="mt-5 text-4xl font-semibold text-slate-950">{services.length}</p>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{translation.recentUpdates}</p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <li>Offers auto-expire based on end date.</li>
            <li>Local admin session stored in browser.</li>
            <li>Product and service changes apply instantly.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
