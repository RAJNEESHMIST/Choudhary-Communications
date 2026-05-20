import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const navItems = [
  { to: '/', label: 'home' },
  { to: '/products', label: 'products' },
  { to: '/offers', label: 'offers' },
  { to: '/services', label: 'services' },
  { to: '/contact', label: 'contact' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { translation, language, setLanguage } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3 text-slate-900">
          <div className="grid h-12 w-12 place-items-center rounded-3xl bg-slate-900 text-white shadow-panel">
            CC
          </div>
          <div>
            <p className="text-sm font-semibold tracking-[0.24em] uppercase text-slate-900">{translation.brand}</p>
            <p className="text-xs text-slate-500">Mobile offers, repairs & accessories</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition ${isActive ? 'text-primary' : 'text-slate-600 hover:text-slate-900'}`
              }
            >
              {translation[item.label]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="hidden rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 md:inline-flex"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>

          <Link
            to="/admin/login"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Admin
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span className="block h-0.5 w-5 bg-current"></span>
            <span className="mt-1 block h-0.5 w-5 bg-current"></span>
            <span className="mt-1 block h-0.5 w-5 bg-current"></span>
          </button>
        </div>
      </div>

      <div className={`overflow-hidden border-t border-slate-200 bg-white md:hidden ${open ? 'max-h-[500px] py-4' : 'max-h-0' } transition-[max-height] duration-300 ease-in-out`}>
        <nav className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-3xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`
              }
            >
              {translation[item.label]}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            {language === 'en' ? 'हिंदी' : 'English'}
          </button>
        </nav>
      </div>
    </header>
  );
}
