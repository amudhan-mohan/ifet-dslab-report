import type { VerificationStatus, EvaluationStatus } from '../types/student';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  /** Icon override — defaults to variant-specific icon */
  icon?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-100',
  error:   'bg-red-50 text-red-800 border-red-200 ring-red-100',
  warning: 'bg-amber-50 text-amber-800 border-amber-200 ring-amber-100',
  info:    'bg-blue-50 text-blue-800 border-blue-200 ring-blue-100',
  neutral: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100',
};

const VARIANT_ICONS: Record<BadgeVariant, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
  neutral: '·',
};

export default function StatusBadge({ variant, label, icon }: StatusBadgeProps) {
  const displayIcon = icon ?? VARIANT_ICONS[variant];
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ring-1 ${VARIANT_STYLES[variant]}`}
    >
      <span aria-hidden="true" className="text-sm leading-none">
        {displayIcon}
      </span>
      {label}
    </span>
  );
}

// ─── Helpers to map domain states → badge props ───────────────

export function verificationStatusBadge(status: VerificationStatus, subject: string) {
  switch (status) {
    case 'EXISTS':
      return <StatusBadge variant="success" label={`${subject} found`} />;
    case 'NOT_FOUND':
      return <StatusBadge variant="error" label={`${subject} not found`} />;
    case 'UNKNOWN':
      return <StatusBadge variant="warning" label={`${subject} status unknown`} />;
    case 'PENDING':
      return <StatusBadge variant="info" label={`${subject} pending verification`} />;
    default:
      return <StatusBadge variant="neutral" label={subject} />;
  }
}

export function evaluationStatusBadge(status: EvaluationStatus) {
  switch (status) {
    case 'EVALUATED':
      return <StatusBadge variant="success" label="Evaluated" />;
    case 'REPOSITORY_NOT_FOUND':
      return <StatusBadge variant="error" label="Repository Not Found" />;
    case 'USERNAME_NOT_FOUND':
      return <StatusBadge variant="error" label="GitHub Username Not Found" />;
    case 'PENDING':
      return <StatusBadge variant="warning" label="Pending Evaluation" />;
    case 'ERROR':
      return <StatusBadge variant="error" label="Evaluation Error" />;
    default:
      return <StatusBadge variant="neutral" label="Unknown Status" />;
  }
}
