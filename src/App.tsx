import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchForm from './components/SearchForm';
import StudentProfile from './components/StudentProfile';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import ErrorState from './components/ErrorState';
import { useStudentData } from './hooks/useStudentData';
import { GraduationCapIcon } from './components/Icons';

// ─── URL deep-link helpers ────────────────────────────────────

function getRollFromUrl(): string {
  if (typeof window === 'undefined') return '';
  const params = new URLSearchParams(window.location.search);
  return params.get('roll') ?? '';
}

function setRollInUrl(rollNumber: string) {
  const url = new URL(window.location.href);
  if (rollNumber) {
    url.searchParams.set('roll', rollNumber);
  } else {
    url.searchParams.delete('roll');
  }
  window.history.pushState({}, '', url.toString());
}

// ─── App ─────────────────────────────────────────────────────

export default function App() {
  const [initialRoll] = useState<string>(() => getRollFromUrl());
  const { state, search, reset } = useStudentData(initialRoll || undefined);

  // Keep the URL in sync with the search state
  useEffect(() => {
    if (state.phase === 'found') {
      setRollInUrl(state.student.rollNumber);
    } else if (state.phase === 'not_found') {
      setRollInUrl(state.rollNumber);
    } else if (state.phase === 'idle') {
      setRollInUrl('');
    }
  }, [state]);

  const handleSearch = useCallback(
    (rollNumber: string) => {
      search(rollNumber);
    },
    [search]
  );

  const handleReset = useCallback(() => {
    reset();
    setRollInUrl('');
  }, [reset]);

  const isLoading = state.phase === 'loading';

  // Determine default value for search form
  const defaultValue =
    state.phase === 'found'
      ? state.student.rollNumber
      : state.phase === 'not_found'
      ? state.rollNumber
      : initialRoll;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 font-sans">
      <Header />

      <main
        id="main-content"
        className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 lg:px-8"
      >
        {/* Search form — always visible */}
        <div className="mb-10">
          <SearchForm
            onSearch={handleSearch}
            isLoading={isLoading}
            defaultValue={defaultValue}
          />
        </div>

        {/* Result area */}
        <div aria-live="polite" aria-atomic="true">
          {state.phase === 'idle' && (
            <div className="flex flex-col items-center gap-4 py-12 text-center text-slate-400">
              <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <GraduationCapIcon className="h-8 w-8 text-slate-400" />
              </span>
              <p className="text-sm">
                Enter your roll number above to view your experiment report.
              </p>
            </div>
          )}

          {state.phase === 'loading' && <LoadingState />}

          {state.phase === 'not_found' && (
            <EmptyState rollNumber={state.rollNumber} onReset={handleReset} />
          )}

          {state.phase === 'error' && (
            <ErrorState message={state.message} onReset={handleReset} />
          )}

          {state.phase === 'found' && (
            <StudentProfile student={state.student} onReset={handleReset} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
