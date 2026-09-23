import { ErrorCircleIcon } from './Icons';

interface ErrorStateProps {
  message?: string;
  onReset: () => void;
}

export default function ErrorState({ message, onReset }: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="flex flex-col items-center gap-5 rounded-2xl border border-red-200 bg-red-50 px-6 py-14 text-center"
    >
      <span
        aria-hidden="true"
        className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-400"
      >
        <ErrorCircleIcon className="h-8 w-8" />
      </span>

      <div>
        <h2 className="text-lg font-semibold text-red-800">Something Went Wrong</h2>
        <p className="mt-2 text-sm text-red-600">
          {message ?? 'An unexpected error occurred. Please try again.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 shadow-sm transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Try Again
      </button>
    </div>
  );
}
