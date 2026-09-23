// ============================================================
// GitHub Service
// ============================================================
// Currently uses the pre-verified CSV data as the source of truth.
// This service provides the interface so that live GitHub API
// integration can be added later without changing React components.
// ============================================================

import type { VerificationStatus } from '../types/student';

export interface GitHubUserCheckResult {
  status: VerificationStatus;
  profileUrl?: string;
  error?: string;
}

export interface RepositoryCheckResult {
  status: VerificationStatus;
  repositoryUrl?: string;
  error?: string;
}

/**
 * Check if a GitHub user exists.
 *
 * CURRENT IMPLEMENTATION: Returns the pre-verified CSV status.
 *
 * To enable live GitHub API verification:
 * 1. Add VITE_GITHUB_TOKEN to .env (and keep it out of source control)
 * 2. Replace the body below with a fetch to https://api.github.com/users/<username>
 * 3. Handle 404 (not found), 403 (rate limited), and network errors
 *
 * WARNING: Never embed GitHub tokens in production frontend code.
 * Use a serverless function or backend proxy for authenticated requests.
 */
export async function checkGitHubUser(
  username: string,
  preVerifiedStatus?: VerificationStatus
): Promise<GitHubUserCheckResult> {
  // Use pre-verified status from CSV (avoids API rate limits)
  if (preVerifiedStatus && preVerifiedStatus !== 'UNKNOWN') {
    return {
      status: preVerifiedStatus,
      profileUrl: username ? `https://github.com/${username}` : undefined,
    };
  }

  // Fallback: if status unknown, derive from whether username exists
  if (!username) {
    return { status: 'NOT_FOUND' };
  }

  return {
    status: 'UNKNOWN',
    profileUrl: `https://github.com/${username}`,
  };
}

/**
 * Check if a GitHub repository exists for a given user.
 *
 * CURRENT IMPLEMENTATION: Returns the pre-verified CSV status.
 *
 * To enable live verification, replace with:
 * fetch(`https://api.github.com/repos/${username}/${repositoryName}`)
 */
export async function checkRepository(
  username: string,
  repositoryName: string,
  preVerifiedStatus?: VerificationStatus,
  preVerifiedUrl?: string
): Promise<RepositoryCheckResult> {
  if (preVerifiedStatus && preVerifiedStatus !== 'UNKNOWN') {
    return {
      status: preVerifiedStatus,
      repositoryUrl: preVerifiedUrl ?? `https://github.com/${username}/${repositoryName}`,
    };
  }

  if (!username || !repositoryName) {
    return { status: 'NOT_FOUND' };
  }

  return {
    status: 'UNKNOWN',
    repositoryUrl: `https://github.com/${username}/${repositoryName}`,
  };
}
