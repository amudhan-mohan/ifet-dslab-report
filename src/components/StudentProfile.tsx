import type { StudentRecord } from '../types/student';
import { evaluationStatusBadge } from './StatusBadge';
import GitHubStatus from './GitHubStatus';
import RepositoryStatus from './RepositoryStatus';
import ExperimentMarksTable from './ExperimentMarksTable';
import { ChartBarIcon, ArrowLeftIcon, PersonIcon, WarningTriangleIcon } from './Icons';

interface StudentProfileProps {
  student: StudentRecord;
  onReset: () => void;
}

export default function StudentProfile({ student, onReset }: StudentProfileProps) {
  const canShowMarks =
    student.repository.status === 'EXISTS' && student.experiments.length > 0;
  const repoNotFound = student.repository.status === 'NOT_FOUND';

  return (
    <div
      className="animate-[fadeIn_0.25s_ease-out] space-y-5"
      style={{ animationFillMode: 'both' }}
    >
      {/* Student information card */}
      <section
        aria-labelledby="student-info-heading"
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-3 flex items-start justify-between gap-3 flex-wrap">
          <h2
            id="student-info-heading"
            className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500"
          >
            <PersonIcon className="h-4 w-4" aria-hidden={true} />
            Student Information
          </h2>
          {evaluationStatusBadge(student.summary.evaluationStatus)}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Student Name</p>
            <p className="mt-0.5 text-base font-semibold text-slate-800">{student.studentName}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Roll Number</p>
            <p className="mt-0.5 font-mono text-base font-semibold text-slate-800">{student.rollNumber}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 underline-offset-2 transition-colors hover:text-slate-600 hover:underline focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:ring-offset-1 rounded"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" aria-hidden={true} />
            New Search
          </button>
        </div>
      </section>

      {/* GitHub status */}
      <GitHubStatus github={student.github} />

      {/* Repository status */}
      <RepositoryStatus repository={student.repository} />

      {/* Marks or unavailable notice */}
      {canShowMarks ? (
        <ExperimentMarksTable experiments={student.experiments} summary={student.summary} />
      ) : repoNotFound ? (
        <section
          aria-labelledby="marks-unavailable-heading"
          className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"
        >
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <ChartBarIcon className="h-7 w-7" aria-hidden={true} />
            </span>
          </div>
          <h3
            id="marks-unavailable-heading"
            className="mt-3 flex items-center justify-center gap-1.5 text-base font-semibold text-slate-700"
          >
            <WarningTriangleIcon className="h-4 w-4 text-amber-500" aria-hidden={true} />
            Marks Unavailable
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Experiment marks cannot be displayed because the required GitHub repository was not
            found. Once the repository is available, marks will appear here.
          </p>
        </section>
      ) : (
        <ExperimentMarksTable experiments={student.experiments} summary={student.summary} />
      )}
    </div>
  );
}
