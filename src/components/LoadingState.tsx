export default function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Searching student records"
      className="flex flex-col items-center justify-center gap-4 py-16"
    >
      {/* Spinner */}
      <div
        aria-hidden="true"
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#1e3a5f]"
      />
      <div className="text-center">
        <p className="text-base font-medium text-slate-700">Searching student records…</p>
        <p className="mt-1 text-sm text-slate-400">This will only take a moment.</p>
      </div>
    </div>
  );
}
