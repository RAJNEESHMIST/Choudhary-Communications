import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { formatPrice, whatsappLink } from '../utils/whatsapp.js';
import { getImageSource, FALLBACK_IMAGE } from '../utils/imageValidation.js';

export default function ProductCard({ product }) {
  const { translation, settings } = useApp();
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageSrc = getImageSource(product.imageUrl, apiBase) || FALLBACK_IMAGE;
  const phoneHref = settings?.phone ? `tel:${settings.phone.replace(/\s+/g, '')}` : 'tel:+0000000000';
  const displayImage = imageError ? FALLBACK_IMAGE : imageSrc;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-panel transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative overflow-hidden bg-slate-100">
        {!imageLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">{product.brand}</p>
            <h3 className="mt-2 text-lg font-semibold text-slate-950 line-clamp-2">{product.name}</h3>
          </div>
          {product.featured && (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Featured</span>
          )}
        </div>

        <p className="text-sm leading-6 text-slate-600 line-clamp-2">{product.shortDescription}</p>

        <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <div>
            <p className="text-xl font-semibold text-primary">₹{formatPrice(product.price)}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">{product.category}</p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700">
            {product.availability || 'Availability unknown'}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={phoneHref}
            aria-label={`Call ${product.name}`}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            <span className="text-emerald-600">📞</span>
            {translation.callNow}
          </a>
          <a
            href={whatsappLink(settings.whatsapp, `${translation.whatsAppMessage} ${product.name}`)}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            target="_blank"
            rel="noreferrer"
          >
            {translation.contactWhatsApp}
          </a>
        </div>
      </div>
    </article>
  );
}
