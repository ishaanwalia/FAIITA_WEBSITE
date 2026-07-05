export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-navy-700/15 border-t-saffron-500" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-navy-400">Loading</p>
      </div>
    </div>
  );
}
