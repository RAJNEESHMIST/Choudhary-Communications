export function SkeletonLoader({ className = 'h-[220px]' }) {
  return (
    <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative flex items-center justify-center overflow-hidden rounded-3xl bg-slate-100">
        <SkeletonLoader className="h-[220px] w-full" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="space-y-2">
          <SkeletonLoader className="h-4 w-16" />
          <SkeletonLoader className="h-6 w-3/4" />
        </div>
        <SkeletonLoader className="h-4 w-full" />
        <div className="flex items-center justify-between">
          <SkeletonLoader className="h-6 w-20" />
          <SkeletonLoader className="h-6 w-24" />
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <SkeletonLoader className="h-10 w-full" />
          <SkeletonLoader className="h-10 w-full" />
        </div>
      </div>
    </article>
  );
}
