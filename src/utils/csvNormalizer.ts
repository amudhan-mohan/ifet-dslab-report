// ============================================================
// CSV Normalizer
// ============================================================
// THIS IS THE ONLY PLACE WHERE RAW CSV COLUMN NAMES ARE REFERENCED.
// If the CSV structure changes, modify only the mapping functions below.
// All other code depends on the normalized types from src/types/student.ts
// ============================================================

import type {
  RawExerciseGradingRow,
  RawFinalSummaryRow,
  RawRepositoryCheckRow,
  RawUsernameCheckRow,
  RawFileGradingRow,
  ExperimentResult,
  SubProgramResult,
  StudentRecord,
  StudentSummary,
  GitHubUserInfo,
  RepositoryInfo,
  VerificationStatus,
  EvaluationStatus,
} from '../types/student';
import { safeParseNumber, experimentIdToLabel } from './markCalculator';

// ─── Column name constants ────────────────────────────────────
// Centralise all raw CSV header names here.
// Changing a CSV header = change only this constant.

const COL = {
  // Shared across multiple CSVs
  STUDENT_NAME: 'student_name',
  ROLL_NO: 'roll_no',
  GITHUB_USERNAME: 'github_username',
  REPOSITORY: 'repository',

  // exercise_grading.csv columns
  EXERCISE: 'exercise',
  PROGRAM_MARKS: 'program_marks',
  MAX_PROGRAM_MARKS: 'max_program_marks',
  OUTPUT_MARKS: 'output_marks',
  MAX_OUTPUT_MARKS: 'max_output_marks',
  TOTAL_MARKS: 'total_marks',
  MAX_MARKS: 'max_marks',
  PERCENTAGE: 'percentage',
  REMARKS: 'remarks',

  // final_summary.csv columns (same as exercise_grading for marks cols + status)
  STATUS: 'status',

  // repository_check.csv / username_check.csv columns
  URL: 'url',
  CHECKED_AT: 'checked_at',

  // file_grading.csv columns
  PROGRAM_FILE: 'program_file',
  PROGRAM_FOUND: 'program_found',
  OUTPUT_FILE: 'output_file',
  OUTPUT_FOUND: 'output_found',
  OUTPUT_FILE_MARKS: 'output_file_marks',
  OUTPUT_CONTENT_MARKS: 'output_content_marks',
  OUTPUT_TOTAL: 'output_total',
  PAIR_TOTAL: 'pair_total',
} as const;

// ─── Normalizers ─────────────────────────────────────────────

/**
 * Normalise a single exercise_grading.csv row into ExperimentResult.
 * Sub-programs are populated separately and merged in assembleStudentRecord.
 */
export function normalizeExerciseRow(
  row: RawExerciseGradingRow,
  subPrograms: SubProgramResult[] = []
): ExperimentResult {
  const experimentId = (row[COL.EXERCISE] ?? '').trim().toLowerCase();
  const programMarks = safeParseNumber(row[COL.PROGRAM_MARKS]);
  const maxProgramMarks = safeParseNumber(row[COL.MAX_PROGRAM_MARKS]);
  const outputMarks = safeParseNumber(row[COL.OUTPUT_MARKS]);
  const maxOutputMarks = safeParseNumber(row[COL.MAX_OUTPUT_MARKS]);
  const totalMarks = safeParseNumber(row[COL.TOTAL_MARKS]);
  const maxMarks = safeParseNumber(row[COL.MAX_MARKS]);
  const percentage = safeParseNumber(row[COL.PERCENTAGE]);

  return {
    experimentId,
    experimentLabel: experimentIdToLabel(experimentId),
    programMarks,
    maxProgramMarks,
    outputMarks,
    maxOutputMarks,
    totalMarks: totalMarks > 0 ? totalMarks : programMarks + outputMarks,
    maxMarks: maxMarks > 0 ? maxMarks : maxProgramMarks + maxOutputMarks,
    percentage,
    remarks: (row[COL.REMARKS] ?? '').trim(),
    subPrograms,
  };
}

/**
 * Normalise a single file_grading.csv row into SubProgramResult.
 * Derives the subId by removing the extension from the program file name.
 * e.g. "ex01a.c" → "ex01a"
 */
export function normalizeFileGradingRow(row: RawFileGradingRow): SubProgramResult {
  const programFile = (row[COL.PROGRAM_FILE] ?? '').trim();
  const subId = programFile.replace(/\.[^.]+$/, '').toLowerCase(); // strip extension

  return {
    subId,
    programFile,
    programFound: (row[COL.PROGRAM_FOUND] ?? '').trim().toUpperCase() === 'YES',
    programMarks: safeParseNumber(row[COL.PROGRAM_MARKS]),
    outputFile: (row[COL.OUTPUT_FILE] ?? '').trim(),
    outputFound: (row[COL.OUTPUT_FOUND] ?? '').trim().toUpperCase() === 'YES',
    outputFileMarks: safeParseNumber(row[COL.OUTPUT_FILE_MARKS]),
    outputContentMarks: safeParseNumber(row[COL.OUTPUT_CONTENT_MARKS]),
    outputTotal: safeParseNumber(row[COL.OUTPUT_TOTAL]),
    pairTotal: safeParseNumber(row[COL.PAIR_TOTAL]),
    maxMarks: safeParseNumber(row[COL.MAX_MARKS]),
    remarks: (row[COL.REMARKS] ?? '').trim(),
  };
}

/**
 * Build a map of exerciseId → SubProgramResult[] from file_grading rows for a student.
 */
export function buildSubProgramMap(
  fileGradingRows: RawFileGradingRow[]
): Map<string, SubProgramResult[]> {
  const map = new Map<string, SubProgramResult[]>();

  for (const row of fileGradingRows) {
    const exerciseId = (row[COL.EXERCISE] ?? '').trim().toLowerCase();
    if (!exerciseId) continue;

    const subProgram = normalizeFileGradingRow(row);
    const existing = map.get(exerciseId);
    if (existing) {
      existing.push(subProgram);
    } else {
      map.set(exerciseId, [subProgram]);
    }
  }

  // Sort sub-programs within each exercise by subId
  for (const [, subs] of map) {
    subs.sort((a, b) => a.subId.localeCompare(b.subId));
  }

  return map;
}

/**
 * Normalise a final_summary.csv row into StudentSummary.
 */
export function normalizeSummaryRow(row: RawFinalSummaryRow): StudentSummary {
  const rawStatus = (row[COL.STATUS] ?? '').trim().toUpperCase();

  const evaluationStatus: EvaluationStatus = (() => {
    switch (rawStatus) {
      case 'EVALUATED': return 'EVALUATED';
      case 'REPOSITORY_NOT_FOUND': return 'REPOSITORY_NOT_FOUND';
      case 'USERNAME_NOT_FOUND': return 'USERNAME_NOT_FOUND';
      case 'PENDING': return 'PENDING';
      case 'ERROR': return 'ERROR';
      default: return 'UNKNOWN';
    }
  })();

  const totalProgramMarks = safeParseNumber(row[COL.PROGRAM_MARKS]);
  const maxProgramMarks = safeParseNumber(row[COL.MAX_PROGRAM_MARKS]);
  const totalOutputMarks = safeParseNumber(row[COL.OUTPUT_MARKS]);
  const maxOutputMarks = safeParseNumber(row[COL.MAX_OUTPUT_MARKS]);
  const totalMarks = safeParseNumber(row[COL.TOTAL_MARKS]);
  const maxMarks = safeParseNumber(row[COL.MAX_MARKS]);
  const percentage = safeParseNumber(row[COL.PERCENTAGE]);

  return {
    totalProgramMarks,
    maxProgramMarks,
    totalOutputMarks,
    maxOutputMarks,
    totalMarks,
    maxMarks,
    percentage,
    evaluationStatus,
  };
}

/**
 * Normalise a repository_check.csv row into RepositoryInfo.
 */
export function normalizeRepositoryRow(row: RawRepositoryCheckRow): RepositoryInfo {
  const rawStatus = (row[COL.STATUS] ?? '').trim().toUpperCase();

  const status: VerificationStatus = (() => {
    switch (rawStatus) {
      case 'EXISTS': return 'EXISTS';
      case 'NOT_FOUND': return 'NOT_FOUND';
      default: return 'UNKNOWN';
    }
  })();

  return {
    repositoryName: (row[COL.REPOSITORY] ?? '').trim(),
    status,
    repositoryUrl: (row[COL.URL] ?? '').trim() || undefined,
    checkedAt: (row[COL.CHECKED_AT] ?? '').trim() || undefined,
    remarks: (row[COL.REMARKS] ?? '').trim() || undefined,
  };
}

/**
 * Normalise a username_check.csv row into GitHubUserInfo.
 */
export function normalizeUsernameRow(row: RawUsernameCheckRow): GitHubUserInfo {
  const rawStatus = (row[COL.STATUS] ?? '').trim().toUpperCase();

  const status: VerificationStatus = (() => {
    switch (rawStatus) {
      case 'EXISTS': return 'EXISTS';
      case 'NOT_FOUND': return 'NOT_FOUND';
      default: return 'UNKNOWN';
    }
  })();

  return {
    username: (row[COL.GITHUB_USERNAME] ?? '').trim(),
    status,
    profileUrl: (row[COL.URL] ?? '').trim() || undefined,
    checkedAt: (row[COL.CHECKED_AT] ?? '').trim() || undefined,
    remarks: (row[COL.REMARKS] ?? '').trim() || undefined,
  };
}

// ─── Roll number normalizer ───────────────────────────────────

/**
 * Normalize a roll number string for consistent comparison.
 */
export function normalizeRollNumber(raw: string): string {
  return raw.trim().toUpperCase();
}

/**
 * Extract the roll number from a raw row (works across all CSV types).
 */
export function getRollNumber(row: Record<string, string>): string {
  return normalizeRollNumber(row[COL.ROLL_NO] ?? '');
}

// ─── Student record assembly ──────────────────────────────────

interface RawStudentData {
  summaryRow: RawFinalSummaryRow;
  exerciseRows: RawExerciseGradingRow[];
  fileGradingRows: RawFileGradingRow[];
  repositoryRow: RawRepositoryCheckRow | null;
  usernameRow: RawUsernameCheckRow | null;
}

/**
 * Assemble a complete StudentRecord from all raw CSV sources.
 */
export function assembleStudentRecord(data: RawStudentData): StudentRecord {
  const { summaryRow, exerciseRows, fileGradingRows, repositoryRow, usernameRow } = data;

  // Build sub-program map from file_grading rows
  const subProgramMap = buildSubProgramMap(fileGradingRows);

  // Sort exercises by ID
  const sortedExercises = [...exerciseRows].sort((a, b) => {
    const aNum = extractExerciseNumber(a[COL.EXERCISE] ?? '');
    const bNum = extractExerciseNumber(b[COL.EXERCISE] ?? '');
    return aNum - bNum;
  });

  const experiments: ExperimentResult[] = sortedExercises.map((row) => {
    const exerciseId = (row[COL.EXERCISE] ?? '').trim().toLowerCase();
    const subPrograms = subProgramMap.get(exerciseId) ?? [];
    return normalizeExerciseRow(row, subPrograms);
  });

  const summary = normalizeSummaryRow(summaryRow);

  const github: GitHubUserInfo = usernameRow
    ? normalizeUsernameRow(usernameRow)
    : {
        username: (summaryRow[COL.GITHUB_USERNAME] ?? '').trim(),
        status: (summaryRow[COL.GITHUB_USERNAME] ?? '').trim() ? 'UNKNOWN' : 'NOT_FOUND',
        profileUrl: (summaryRow[COL.GITHUB_USERNAME] ?? '').trim()
          ? `https://github.com/${(summaryRow[COL.GITHUB_USERNAME] ?? '').trim()}`
          : undefined,
      };

  const repository: RepositoryInfo = repositoryRow
    ? normalizeRepositoryRow(repositoryRow)
    : {
        repositoryName: (summaryRow[COL.REPOSITORY] ?? '').trim(),
        status: summary.evaluationStatus === 'REPOSITORY_NOT_FOUND' ? 'NOT_FOUND' : 'UNKNOWN',
        repositoryUrl:
          github.username && summaryRow[COL.REPOSITORY]
            ? `https://github.com/${github.username}/${(summaryRow[COL.REPOSITORY] ?? '').trim()}`
            : undefined,
      };

  return {
    rollNumber: normalizeRollNumber(summaryRow[COL.ROLL_NO] ?? ''),
    studentName: (summaryRow[COL.STUDENT_NAME] ?? '').trim(),
    github,
    repository,
    experiments,
    summary,
  };
}

// ─── Helpers ─────────────────────────────────────────────────

function extractExerciseNumber(exerciseId: string): number {
  const match = exerciseId.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 999;
}
