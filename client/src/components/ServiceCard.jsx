export default function ServiceCard({ service }) {
  return (
    <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-3xl">
        {service.icon}
      </div>
      <div className="mt-5 space-y-3">
        <h3 className="text-lg font-semibold text-slate-950">{service.title}</h3>
        <p className="text-sm leading-6 text-slate-600">{service.description}</p>
      </div>
    </article>
  );
}
