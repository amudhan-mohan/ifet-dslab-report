import { WarningTriangleIcon } from './Icons';

interface EmptyStateProps {
  rollNumber?: string;
  onReset: () => void;
}

export default function EmptyState({ rollNumber, onReset }: EmptyStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center gap-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center"
    >
      {/* Icon */}
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400"
      >
        <WarningTriangleIcon className="h-8 w-8" />
      </span>

      <div>
        <h2 className="text-lg font-semibold text-slate-800">Student Record Not Found</h2>
        {rollNumber && (
          <p className="mt-1 text-sm text-slate-500">
            No record was found for roll number{' '}
            <span className="font-mono font-semibold text-slate-700">{rollNumber}</span>.
          </p>
        )}
        <p className="mt-2 text-sm text-slate-500">
          Please verify your roll number and try again.
          <br />
          Contact your department if the problem persists.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 active:bg-slate-100"
      >
        Search Again
      </button>
    </div>
  );
}
