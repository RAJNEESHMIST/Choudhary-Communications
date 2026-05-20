import { useApp } from '../context/AppContext.jsx';

export default function Contact() {
  const { translation, settings } = useApp();

  return (
    <div className="space-y-8 pb-10">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.contact}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Get in touch</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Visit the store, send a WhatsApp message, or call for the fastest response. Our team is ready to help with offers, repairs, and expert advice.</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-slate-950">{translation.shopAddress}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{settings.address}</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-slate-950">{translation.shopTimings}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">{settings.timings}</p>
        </div>
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
          <h2 className="text-lg font-semibold text-slate-950">Support</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <a href={`tel:${settings.phone}`} className="block font-semibold text-primary hover:text-slate-900">{translation.callNow}</a>
            <a href={settings.whatsapp} className="block font-semibold text-emerald-600 hover:text-emerald-700">WhatsApp</a>
            <a href={settings.mapLink} target="_blank" rel="noreferrer" className="block font-medium text-slate-700 hover:text-slate-900">Google Maps</a>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel">
        <iframe
          src={settings.mapLink}
          title="Shop location"
          className="h-80 w-full rounded-[24px] border border-slate-200"
          loading="lazy"
        />
      </div>
    </div>
  );
}
