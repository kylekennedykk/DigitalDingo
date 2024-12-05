export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse space-y-8 w-full max-w-xl">
        <div className="h-8 bg-neutral-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-neutral-200 rounded w-1/2 mx-auto" />
        <div className="space-y-4">
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-12 bg-neutral-200 rounded" />
          <div className="h-32 bg-neutral-200 rounded" />
          <div className="h-12 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
} 