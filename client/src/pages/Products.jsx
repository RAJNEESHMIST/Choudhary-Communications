import { useApp } from '../context/AppContext.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function Products() {
  const { products, translation } = useApp();

  return (
    <div className="space-y-8 pb-10">
      <header className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-8 shadow-panel">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">{translation.products}</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">Shop all products</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Low bandwidth, mobile-first shopping experience for the best phone deals. Browse premium devices, accessories and support services from your local store.</p>
        </div>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
