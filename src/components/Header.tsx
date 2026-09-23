import type { ReactNode } from 'react';

// ──────────────────────────────────────────────────────────
// University crest SVG icon
// ──────────────────────────────────────────────────────────
function CrestIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      className="h-10 w-10 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="48" height="48" rx="8" fill="#1e3a5f" />
      <text
        x="24"
        y="34"
        textAnchor="middle"
        fontSize="22"
        fontFamily="Georgia, serif"
        fill="#f0c040"
        fontWeight="bold"
      >
        AU
      </text>
    </svg>
  );
}

// ──────────────────────────────────────────────────────────
// Nav breadcrumb / skip link
// ──────────────────────────────────────────────────────────
function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-blue-900 focus:shadow-lg focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

// ──────────────────────────────────────────────────────────
// Header component
// ──────────────────────────────────────────────────────────
interface HeaderProps {
  children?: ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return (
    <>
      <SkipLink />
      <header className="bg-[#1e3a5f] text-white shadow-lg" role="banner">
        <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <CrestIcon />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-200 sm:text-sm">
                Annamalai University
              </p>
              <h1 className="truncate text-lg font-bold leading-tight sm:text-xl lg:text-2xl">
                Experiment Report Portal
              </h1>
            </div>
          </div>
          {children && <div className="mt-4">{children}</div>}
        </div>
      </header>
    </>
  );
}
