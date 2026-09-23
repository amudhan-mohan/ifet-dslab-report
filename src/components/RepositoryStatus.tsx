import type { RepositoryInfo } from '../types/student';
import { verificationStatusBadge } from './StatusBadge';
import { FolderIcon, GitHubIcon, ExternalLinkIcon, WarningTriangleIcon } from './Icons';

interface RepositoryStatusProps {
  repository: RepositoryInfo;
}

export default function RepositoryStatus({ repository }: RepositoryStatusProps) {
  const isFound = repository.status === 'EXISTS';
  const isNotFound = repository.status === 'NOT_FOUND';

  return (
    <section
      aria-labelledby="repo-heading"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
        <h3
          id="repo-heading"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500"
        >
          <FolderIcon className="h-4 w-4" aria-hidden={true} />
          Repository Status
        </h3>
        {verificationStatusBadge(repository.status, 'Repository')}
      </div>

      {isFound ? (
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Repository Name</p>
            <p className="mt-0.5 font-mono text-base font-semibold text-slate-800">
              {repository.repositoryName}
            </p>
          </div>

          {repository.repositoryUrl && (
            <a
              href={repository.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View repository ${repository.repositoryName} on GitHub`}
              className="inline-flex items-center gap-2 rounded-lg border border-[#1e3a5f] px-4 py-2 text-sm font-semibold text-[#1e3a5f] transition-colors hover:bg-[#1e3a5f] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-2"
            >
              <GitHubIcon className="h-4 w-4" aria-hidden={true} />
              View Repository
              <ExternalLinkIcon className="h-3.5 w-3.5 opacity-70" aria-hidden={true} />
            </a>
          )}

          {repository.checkedAt && (
            <p className="text-xs text-slate-400">
              Verified on{' '}
              {new Date(repository.checkedAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          )}
        </div>
      ) : isNotFound ? (
        <div className="rounded-lg bg-red-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <WarningTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden={true} />
            <div>
              <p className="text-sm font-medium text-red-800">Repository not found</p>
              <p className="mt-1 text-sm text-red-600">
                We couldn't find the required repository for this student.
                Experiment marks are unavailable until the repository is accessible.
              </p>
              {repository.repositoryUrl && (
                <p className="mt-2 font-mono text-xs text-red-400 break-all">
                  {repository.repositoryUrl}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-800">Repository status unknown</p>
          <p className="mt-1 text-sm text-amber-700">
            Repository verification data is not available.
          </p>
        </div>
      )}
    </section>
  );
}
