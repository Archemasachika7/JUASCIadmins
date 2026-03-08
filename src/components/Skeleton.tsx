export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-3">
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-8 w-16" />
      <div className="skeleton h-3 w-32" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-border">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-4 w-24" />
      <div className="skeleton h-4 w-20" />
    </div>
  );
}

export function SkeletonImage() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="skeleton h-48 w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}
