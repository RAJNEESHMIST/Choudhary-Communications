import { useApp } from '../context/AppContext.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

export default function Services() {
  const { services, translation } = useApp();

  return (
    <div className="space-y-8 pb-10">
      <header className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.services}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Service catalog</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Quick repairs, recharge, SIM support and expert phone setup for local customers — all delivered with fast, friendly service.</p>
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </div>
  );
}
