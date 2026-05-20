import { useApp } from '../context/AppContext.jsx';
import { Link } from 'react-router-dom';

export default function Footer() {
  const { translation, settings } = useApp();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-4">
          <p className="text-lg font-semibold tracking-[0.18em] uppercase text-slate-900">{translation.brand}</p>
          <p className="max-w-sm text-sm leading-6 text-slate-600">{translation.shopTag}</p>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">{translation.contact}</p>
          <div className="space-y-2 text-sm text-slate-600">
            <p>{settings.address}</p>
            <p>{translation.shopTimings}: {settings.timings}</p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${settings.phone}`} className="text-sm font-medium text-primary hover:text-slate-900">{settings.phone}</a>
              <a href={settings.whatsapp} className="text-sm font-medium text-emerald-600 hover:text-emerald-700">WhatsApp</a>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-sm font-semibold tracking-[0.18em] uppercase text-slate-900">Quick links</p>
          <div className="grid gap-2 text-sm text-slate-600">
            <Link to="/" className="transition hover:text-slate-900">{translation.home}</Link>
            <Link to="/products" className="transition hover:text-slate-900">{translation.products}</Link>
            <Link to="/offers" className="transition hover:text-slate-900">{translation.offers}</Link>
            <Link to="/services" className="transition hover:text-slate-900">{translation.services}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs text-slate-500 sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} {translation.brand}. All rights reserved.</p>
      </div>
    </footer>
  );
}
