import { useState, useRef, useEffect, type FormEvent } from 'react';

interface SearchFormProps {
  onSearch: (rollNumber: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
}

export default function SearchForm({
  onSearch,
  isLoading = false,
  defaultValue = '',
}: SearchFormProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync the input field if the defaultValue prop changes externally
  // (e.g. when a URL deep-link resolves after async CSV load)
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  }

  function handleClear() {
    setValue('');
    inputRef.current?.focus();
  }

  const hasValue = value.trim().length > 0;

  return (
    <section aria-labelledby="search-heading" className="text-center">
      <h2
        id="search-heading"
        className="mb-1 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl"
      >
        Student Report
      </h2>
      <p className="mb-6 text-sm text-slate-500">
        Enter your roll number to view your experiment marks.
      </p>

      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Student roll number search"
        className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
      >
        <div className="relative w-full max-w-sm">
          <label
            htmlFor="roll-number-input"
            className="absolute -top-6 left-0 text-xs font-medium text-slate-500"
          >
            Roll Number
          </label>
          <input
            ref={inputRef}
            id="roll-number-input"
            type="text"
            autoComplete="off"
            spellCheck="false"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 421125106001"
            disabled={isLoading}
            aria-label="Enter your roll number"
            aria-required="true"
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-4 pr-10 font-mono text-sm tracking-wide text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
          />
          {/* Clear button */}
          {hasValue && !isLoading && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-1 rounded"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !hasValue}
          aria-label="Search for student"
          className="inline-flex h-11 min-w-[100px] items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#163052] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
              />
              Searching…
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>
    </section>
  );
}
