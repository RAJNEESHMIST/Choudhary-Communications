import { NavLink } from 'react-router-dom';

const items = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/offers', label: 'Offers' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/settings', label: 'Settings' }
];

export default function AdminSidebar() {
  return (
    <aside className="hidden w-72 shrink-0 rounded-[32px] border border-slate-200 bg-white p-6 shadow-panel lg:block">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Admin panel</p>
        <h2 className="text-xl font-semibold text-slate-950">Control center</h2>
      </div>
      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-[24px] px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-primary text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
