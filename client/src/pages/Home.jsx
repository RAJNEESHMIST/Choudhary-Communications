import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import OfferCard from '../components/OfferCard.jsx';
import ServiceCard from '../components/ServiceCard.jsx';

export default function Home() {
  const { translation, products, offers, services, settings } = useApp();
  const validOffers = Array.isArray(offers) ? offers : [];
  const validProducts = Array.isArray(products) ? products : [];
  const validServices = Array.isArray(services) ? services : [];
  const currentOffers = validOffers.filter((item) => item.active);

  return (
    <div className="space-y-10 pb-10">
      <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-6 py-14 text-white shadow-panel sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">{translation.brand}</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">{translation.aboutHeadline}</h1>
            <p className="max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">{translation.shopTag}</p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="/products"
                className="inline-flex items-center justify-center rounded-3xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
              >
                Browse products
              </a>
              <a
                href={settings.whatsapp}
                className="inline-flex items-center justify-center rounded-3xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Contact on WhatsApp
              </a>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {currentOffers.slice(0, 2).map((offer) => (
              <div key={offer._id} className="rounded-[28px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Offer</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{offer.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-200">{offer.description}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-sky-300">Ends {new Date(offer.endDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Featured</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Mobile offers</h2>
          </div>
          <a href="/offers" className="text-sm font-semibold text-primary transition hover:text-slate-900">See all offers</a>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {currentOffers.slice(0, 3).map((offer) => (
            <OfferCard key={offer._id} offer={offer} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.products}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Latest smartphones & accessories</h2>
          </div>
          <a href="/products" className="text-sm font-semibold text-primary transition hover:text-slate-900">View catalog</a>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {validProducts.slice(0, 3).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.services}</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-950">Repair & support services</h2>
          </div>
          <a href="/services" className="text-sm font-semibold text-primary transition hover:text-slate-900">Explore services</a>
        </div>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {validServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}
