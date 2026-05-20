import { useMemo } from 'react';

export default function OfferCard({ offer }) {
  const status = useMemo(() => {
    const now = new Date();
    const end = new Date(offer.endDate);
    const diff = Math.max(0, Math.floor((end - now) / (1000 * 60 * 60 * 24)));
    return {
      days: diff,
      label: diff > 0 ? `${diff} day${diff === 1 ? '' : 's'} left` : 'Expires today',
      active: offer.active
    };
  }, [offer.endDate, offer.active]);

  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-panel transition hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
        <img src={offer.imageUrl} alt={offer.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">Offer</span>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${status.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {status.active ? 'Live' : 'Expired'}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-slate-950">{offer.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{offer.description}</p>
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <span>{status.label}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Ends {new Date(offer.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    </article>
  );
}
