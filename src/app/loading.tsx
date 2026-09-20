export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-9 w-40 bg-neutral-200 rounded mb-6" />
      <div className="h-10 bg-neutral-200 rounded mb-8" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 bg-neutral-100 rounded" />)}
      </div>
    </div>
  )
}