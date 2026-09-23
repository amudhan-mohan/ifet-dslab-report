import React, { useState } from 'react';
import type { ExperimentResult, SubProgramResult, StudentSummary } from '../types/student';
import { formatMark, getGradeLabel } from '../utils/markCalculator';
import StatusBadge from './StatusBadge';
import {
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeFileIcon,
  WarningTriangleIcon,
} from './Icons';

// ─── Sub-components ──────────────────────────────────────────

interface RemarkPillProps { remark: string }
function RemarkPill({ remark }: RemarkPillProps) {
  if (!remark) return null;
  const lower = remark.toLowerCase();
  const variant =
    lower === 'excellent' || lower === 'outstanding' ? 'success'
    : lower === 'very good' ? 'info'
    : 'neutral';
  return <StatusBadge variant={variant} label={remark} />;
}

interface PercentageBarProps { percentage: number }
function PercentageBar({ percentage }: PercentageBarProps) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const color =
    clamped >= 85 ? 'bg-emerald-500'
    : clamped >= 70 ? 'bg-blue-500'
    : clamped >= 50 ? 'bg-amber-500'
    : 'bg-red-400';
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${clamped}%`}
      className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

// ─── Sub-program expanded rows ────────────────────────────────

interface SubProgramRowsProps { subPrograms: SubProgramResult[] }
function SubProgramRows({ subPrograms }: SubProgramRowsProps) {
  return (
    <>
      {subPrograms.map((sub) => {
        const outputMarkLabel = sub.outputFound
          ? `${sub.outputTotal} / 10`
          : '— / 10';
        const programMarkLabel = sub.programFound
          ? `${sub.programMarks} / 10`
          : '— / 10';

        // Extract a short human-readable remark from the full remark string
        // e.g. "Similarity 0.91; compile failed | Almost correct (Content similarity 0.83)"
        // → "Almost correct"
        const shortRemark = extractShortRemark(sub.remarks);

        return (
          <tr key={sub.subId} className="bg-slate-50/60">
            {/* Indent + sub-id */}
            <td className="py-2 pl-10 pr-3 whitespace-nowrap">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <CodeFileIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden={true} />
                <span className="font-mono">{sub.programFile}</span>
              </div>
            </td>
            {/* Program marks */}
            <td className="px-3 py-2 text-xs font-mono text-slate-500 whitespace-nowrap">
              {sub.programFound ? programMarkLabel : (
                <span className="text-slate-400 italic">Not found</span>
              )}
            </td>
            {/* Output marks */}
            <td className="px-3 py-2 text-xs font-mono text-slate-500 whitespace-nowrap">
              {sub.outputFound ? outputMarkLabel : (
                <span className="text-slate-400 italic">Not found</span>
              )}
            </td>
            {/* Pair total */}
            <td className="px-3 py-2 whitespace-nowrap">
              <span className="font-mono text-xs font-semibold text-slate-600">
                {sub.pairTotal} / {sub.maxMarks}
              </span>
            </td>
            {/* Percentage — empty for sub-programs */}
            <td className="px-3 py-2 whitespace-nowrap min-w-[80px]" />
            {/* Short remark */}
            <td className="py-2 pl-3 pr-5 whitespace-nowrap text-xs text-slate-400 max-w-[180px] truncate">
              {shortRemark}
            </td>
          </tr>
        );
      })}
    </>
  );
}

/** Extract the human-readable part from a compound remark string */
function extractShortRemark(remarks: string): string {
  if (!remarks) return '';
  // Format: "Similarity 0.91; compile failed | Almost correct (Content similarity 0.83)"
  // Extract the part after " | " if present
  const pipeIdx = remarks.indexOf(' | ');
  if (pipeIdx !== -1) {
    const afterPipe = remarks.slice(pipeIdx + 3).trim();
    // Strip parenthetical "(Content similarity ...)"
    return afterPipe.replace(/\s*\(.*?\)\s*$/, '').trim();
  }
  return remarks;
}

// ─── Experiment row (primary) ─────────────────────────────────

interface ExperimentRowProps {
  exp: ExperimentResult;
  isExpanded: boolean;
  onToggle: () => void;
}
function ExperimentRow({ exp, isExpanded, onToggle }: ExperimentRowProps) {
  const hasSubPrograms = exp.subPrograms.length > 1;

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      {/* Exercise label + expand toggle */}
      <td className="py-3.5 pl-5 pr-3 whitespace-nowrap">
        <div className="flex items-center gap-1.5">
          {hasSubPrograms ? (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${exp.experimentLabel} sub-programs`}
              className="flex items-center gap-1 rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            >
              {isExpanded
                ? <ChevronDownIcon className="h-3.5 w-3.5" aria-hidden={true} />
                : <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden={true} />
              }
              <span className="text-sm font-semibold text-slate-800">{exp.experimentLabel}</span>
            </button>
          ) : (
            <span className="text-sm font-semibold text-slate-800 pl-5">{exp.experimentLabel}</span>
          )}
          {hasSubPrograms && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
              {exp.subPrograms.length} programs
            </span>
          )}
        </div>
      </td>
      {/* Program marks */}
      <td className="px-3 py-3.5 text-sm text-slate-600 whitespace-nowrap font-mono">
        {formatMark(exp.programMarks, exp.maxProgramMarks)}
      </td>
      {/* Output marks */}
      <td className="px-3 py-3.5 text-sm text-slate-600 whitespace-nowrap font-mono">
        {formatMark(exp.outputMarks, exp.maxOutputMarks)}
      </td>
      {/* Total */}
      <td className="px-3 py-3.5 whitespace-nowrap">
        <span className="font-mono text-sm font-semibold text-slate-800">
          {formatMark(exp.totalMarks, exp.maxMarks)}
        </span>
      </td>
      {/* Percentage + bar */}
      <td className="px-3 py-3.5 whitespace-nowrap min-w-[80px]">
        <div>
          <span className="text-sm font-medium text-slate-700">
            {exp.percentage.toFixed(1)}%
          </span>
          <PercentageBar percentage={exp.percentage} />
        </div>
      </td>
      {/* Remarks */}
      <td className="py-3.5 pl-3 pr-5 whitespace-nowrap">
        <RemarkPill remark={exp.remarks} />
      </td>
    </tr>
  );
}

// ─── Main component ───────────────────────────────────────────

interface ExperimentMarksTableProps {
  experiments: ExperimentResult[];
  summary: StudentSummary;
}

export default function ExperimentMarksTable({
  experiments,
  summary,
}: ExperimentMarksTableProps) {
  // Track expanded state per experiment ID
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  function toggleExpanded(experimentId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(experimentId)) {
        next.delete(experimentId);
      } else {
        next.add(experimentId);
      }
      return next;
    });
  }

  if (experiments.length === 0) {
    return (
      <section aria-labelledby="marks-heading" className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 id="marks-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
          <ChartBarIcon className="h-4 w-4" aria-hidden={true} />
          Experiment Marks
        </h3>
        <div className="mt-4 flex items-center gap-3 rounded-lg bg-amber-50 px-4 py-3">
          <WarningTriangleIcon className="h-5 w-5 shrink-0 text-amber-500" aria-hidden={true} />
          <p className="text-sm text-amber-800">
            No experiment marks available for this student.
          </p>
        </div>
      </section>
    );
  }

  const gradeLabel = getGradeLabel(summary.percentage);

  return (
    <section aria-labelledby="marks-heading" className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 id="marks-heading" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <ChartBarIcon className="h-4 w-4" aria-hidden={true} />
            Experiment Marks
          </h3>
          <p className="text-xs text-slate-400">
            Click an exercise with multiple programs to expand file-level details
          </p>
        </div>
      </div>

      {/* Table — scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100" aria-label="Experiment marks table">
          <thead>
            <tr className="bg-slate-50 text-left">
              <th scope="col" className="py-3 pl-5 pr-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Exercise
              </th>
              <th scope="col" className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Program
              </th>
              <th scope="col" className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Output
              </th>
              <th scope="col" className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Total
              </th>
              <th scope="col" className="px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                %
              </th>
              <th scope="col" className="py-3 pl-3 pr-5 text-xs font-semibold uppercase tracking-wide text-slate-500 whitespace-nowrap">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {experiments.map((exp) => {
              const isExpanded = expandedIds.has(exp.experimentId);
              const hasSubPrograms = exp.subPrograms.length > 1;
              return (
                <React.Fragment key={exp.experimentId}>
                  <ExperimentRow
                    exp={exp}
                    isExpanded={isExpanded}
                    onToggle={() => toggleExpanded(exp.experimentId)}
                  />
                  {hasSubPrograms && isExpanded && (
                    <SubProgramRows subPrograms={exp.subPrograms} />
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary footer */}
      <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Program Marks</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-slate-800">
                {formatMark(summary.totalProgramMarks, summary.maxProgramMarks)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Output Marks</p>
              <p className="mt-0.5 font-mono text-base font-semibold text-slate-800">
                {formatMark(summary.totalOutputMarks, summary.maxOutputMarks)}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Total Marks</p>
              <p className="mt-0.5 font-mono text-xl font-bold text-[#1e3a5f]">
                {formatMark(summary.totalMarks, summary.maxMarks)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-2xl font-bold text-[#1e3a5f]">
              {summary.percentage.toFixed(2)}%
            </p>
            <p className="text-xs font-medium text-slate-500">{gradeLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
