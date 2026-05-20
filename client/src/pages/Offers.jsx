import { useApp } from '../context/AppContext.jsx';
import OfferCard from '../components/OfferCard.jsx';

export default function Offers() {
  const { offers, translation } = useApp();

  return (
    <div className="space-y-8 pb-10">
      <header className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.offers}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Active offers</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Discover the latest promotions, special bundles, and limited-time discounts designed for the smart shopper.</p>
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {offers.map((offer) => (
          <OfferCard key={offer._id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
