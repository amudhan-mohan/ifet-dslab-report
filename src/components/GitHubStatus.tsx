import type { GitHubUserInfo } from '../types/student';
import { verificationStatusBadge } from './StatusBadge';
import { GitHubIcon, ExternalLinkIcon } from './Icons';

interface GitHubStatusProps {
  github: GitHubUserInfo;
}

export default function GitHubStatus({ github }: GitHubStatusProps) {
  const hasUsername = Boolean(github.username);
  const isFound = github.status === 'EXISTS';
  const isNotFound = github.status === 'NOT_FOUND';

  return (
    <section aria-labelledby="github-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-2 flex-wrap">
        <h3 id="github-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <GitHubIcon className="h-4 w-4" aria-hidden={true} />
          GitHub Username
        </h3>
        {verificationStatusBadge(github.status, 'GitHub username')}
      </div>

      {hasUsername ? (
        <div className="space-y-1">
          {isFound || github.status === 'UNKNOWN' ? (
            <a
              href={github.profileUrl ?? `https://github.com/${github.username}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View GitHub profile for @${github.username}`}
              className="inline-flex items-center gap-1.5 rounded-md text-lg font-semibold text-[#1e3a5f] underline-offset-2 transition-colors hover:text-[#163052] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-1"
            >
              @{github.username}
              <ExternalLinkIcon className="h-4 w-4 opacity-50" aria-hidden={true} />
            </a>
          ) : (
            <span className="font-mono text-base text-slate-700">@{github.username}</span>
          )}

          {isNotFound && (
            <p className="text-sm text-red-600">
              This GitHub username could not be verified. The profile may not exist or may be private.
            </p>
          )}

          {github.checkedAt && (
            <p className="text-xs text-slate-400">
              Verified on {new Date(github.checkedAt).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          )}
        </div>
      ) : (
        <div>
          <p className="text-base font-medium text-slate-500">Not available</p>
          <p className="mt-1 text-sm text-slate-400">
            No GitHub username is associated with this roll number.
          </p>
        </div>
      )}
    </section>
  );
}
