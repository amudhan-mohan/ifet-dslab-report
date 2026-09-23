// ============================================================
// CSV Service
// ============================================================
// Loads all CSVs once using import.meta.glob (Vite built-in).
// Subsequent calls re-use the in-memory parsed data.
// ============================================================

import Papa from 'papaparse';
import type {
  RawExerciseGradingRow,
  RawFinalSummaryRow,
  RawRepositoryCheckRow,
  RawUsernameCheckRow,
  RawFileGradingRow,
  StudentRecord,
  SearchResult,
} from '../types/student';
import {
  assembleStudentRecord,
  normalizeRollNumber,
  getRollNumber,
} from '../utils/csvNormalizer';

// ─── Vite glob import ─────────────────────────────────────────
const csvModules = import.meta.glob('/reports/*.csv', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// ─── Per-file CSV identifiers ─────────────────────────────────
const CSV_NAMES = {
  EXERCISE_GRADING: 'exercise_grading',
  FINAL_SUMMARY: 'final_summary',
  REPOSITORY_CHECK: 'repository_check',
  USERNAME_CHECK: 'username_check',
  FILE_GRADING: 'file_grading',
} as const;

// ─── In-memory cache ──────────────────────────────────────────
interface ParsedData {
  exerciseGrading: RawExerciseGradingRow[];
  finalSummary: RawFinalSummaryRow[];
  repositoryCheck: RawRepositoryCheckRow[];
  usernameCheck: RawUsernameCheckRow[];
  fileGrading: RawFileGradingRow[];
}

let cache: ParsedData | null = null;

// ─── CSV Parsing ──────────────────────────────────────────────

function parseCsv<T extends Record<string, string>>(rawContent: string): T[] {
  const result = Papa.parse<T>(rawContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
  });
  return result.data;
}

/**
 * Load and parse all CSV files.
 * Results are cached in memory — subsequent calls are instant.
 */
export function loadAllCsvData(): ParsedData {
  if (cache) return cache;

  const exerciseGrading: RawExerciseGradingRow[] = [];
  const finalSummary: RawFinalSummaryRow[] = [];
  const repositoryCheck: RawRepositoryCheckRow[] = [];
  const usernameCheck: RawUsernameCheckRow[] = [];
  const fileGrading: RawFileGradingRow[] = [];

  for (const [path, rawContent] of Object.entries(csvModules)) {
    const filename = path.split('/').pop()?.replace('.csv', '') ?? '';

    if (filename.includes(CSV_NAMES.EXERCISE_GRADING)) {
      exerciseGrading.push(...parseCsv<RawExerciseGradingRow>(rawContent));
    } else if (filename.includes(CSV_NAMES.FINAL_SUMMARY)) {
      finalSummary.push(...parseCsv<RawFinalSummaryRow>(rawContent));
    } else if (filename.includes(CSV_NAMES.REPOSITORY_CHECK)) {
      repositoryCheck.push(...parseCsv<RawRepositoryCheckRow>(rawContent));
    } else if (filename.includes(CSV_NAMES.USERNAME_CHECK)) {
      usernameCheck.push(...parseCsv<RawUsernameCheckRow>(rawContent));
    } else if (filename.includes(CSV_NAMES.FILE_GRADING)) {
      fileGrading.push(...parseCsv<RawFileGradingRow>(rawContent));
    }
    // process_log.csv is intentionally skipped
  }

  cache = { exerciseGrading, finalSummary, repositoryCheck, usernameCheck, fileGrading };
  return cache;
}

/**
 * Search for a student by roll number across all CSV data.
 */
export function searchStudent(rawRollNumber: string): SearchResult {
  const rollNumber = normalizeRollNumber(rawRollNumber);
  if (!rollNumber) return { found: false };

  const { exerciseGrading, finalSummary, repositoryCheck, usernameCheck, fileGrading } =
    loadAllCsvData();

  const summaryRow = finalSummary.find(
    (row) => getRollNumber(row as Record<string, string>) === rollNumber
  );
  if (!summaryRow) return { found: false };

  const exerciseRows = exerciseGrading.filter(
    (row) => getRollNumber(row as Record<string, string>) === rollNumber
  );

  const fileGradingRows = fileGrading.filter(
    (row) => getRollNumber(row as Record<string, string>) === rollNumber
  );

  const repositoryRow =
    repositoryCheck.find(
      (row) => getRollNumber(row as Record<string, string>) === rollNumber
    ) ?? null;

  const usernameRow =
    usernameCheck.find(
      (row) => getRollNumber(row as Record<string, string>) === rollNumber
    ) ?? null;

  const student: StudentRecord = assembleStudentRecord({
    summaryRow,
    exerciseRows,
    fileGradingRows,
    repositoryRow,
    usernameRow,
  });

  return { found: true, student };
}

/**
 * Get all unique roll numbers.
 */
export function getAllRollNumbers(): string[] {
  const { finalSummary } = loadAllCsvData();
  return finalSummary
    .map((row) => getRollNumber(row as Record<string, string>))
    .filter(Boolean);
}
