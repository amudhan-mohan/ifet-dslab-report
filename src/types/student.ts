// ============================================================
// Normalized internal data model
// All React components depend ONLY on these types.
// Raw CSV column names are isolated in csvNormalizer.ts
// ============================================================

/** Status of a GitHub username or repository as pre-verified in CSV */
export type VerificationStatus = 'EXISTS' | 'NOT_FOUND' | 'UNKNOWN' | 'PENDING';

/** Evaluation status from final_summary.csv */
export type EvaluationStatus =
  | 'EVALUATED'
  | 'REPOSITORY_NOT_FOUND'
  | 'USERNAME_NOT_FOUND'
  | 'PENDING'
  | 'ERROR'
  | 'UNKNOWN';

/** A single experiment result row */
export interface ExperimentResult {
  /** e.g. "ex01", "ex02" etc. */
  experimentId: string;
  /** Human-readable label, e.g. "Exercise 1" */
  experimentLabel: string;
  /** Program marks awarded */
  programMarks: number;
  /** Max possible program marks */
  maxProgramMarks: number;
  /** Output marks awarded */
  outputMarks: number;
  /** Max possible output marks */
  maxOutputMarks: number;
  /** Total marks (programMarks + outputMarks) */
  totalMarks: number;
  /** Max total marks */
  maxMarks: number;
  /** Percentage 0-100 */
  percentage: number;
  /** Remarks e.g. "Excellent", "Very good" */
  remarks: string;
  /** Sub-program file breakdown (ex01a, ex01b, etc.) — from file_grading.csv */
  subPrograms: SubProgramResult[];
}

/** A single sub-program file pair (e.g. ex01a.c + ex01a.txt) */
export interface SubProgramResult {
  /** e.g. "ex01a", "ex01b" */
  subId: string;
  /** e.g. "ex01a.c" */
  programFile: string;
  /** Whether the program file was found */
  programFound: boolean;
  /** Program marks awarded */
  programMarks: number;
  /** e.g. "ex01a.txt" */
  outputFile: string;
  /** Whether the output file was found */
  outputFound: boolean;
  /** Output file existence marks */
  outputFileMarks: number;
  /** Output content similarity marks */
  outputContentMarks: number;
  /** Total output marks (outputFileMarks + outputContentMarks) */
  outputTotal: number;
  /** Combined pair total (programMarks + outputTotal) */
  pairTotal: number;
  /** Max marks for this pair */
  maxMarks: number;
  /** Full remarks string from CSV */
  remarks: string;
}

/** GitHub username verification details */
export interface GitHubUserInfo {
  username: string;
  status: VerificationStatus;
  profileUrl?: string;
  checkedAt?: string;
  remarks?: string;
}

/** Repository verification details */
export interface RepositoryInfo {
  repositoryName: string;
  status: VerificationStatus;
  repositoryUrl?: string;
  checkedAt?: string;
  remarks?: string;
}

/** Aggregate summary totals */
export interface StudentSummary {
  totalProgramMarks: number;
  maxProgramMarks: number;
  totalOutputMarks: number;
  maxOutputMarks: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  evaluationStatus: EvaluationStatus;
}

/** The normalized, unified student record used throughout the app */
export interface StudentRecord {
  rollNumber: string;
  studentName: string;
  github: GitHubUserInfo;
  repository: RepositoryInfo;
  experiments: ExperimentResult[];
  summary: StudentSummary;
}

/** Result returned from a student search */
export type SearchResult =
  | { found: false }
  | { found: true; student: StudentRecord };

/** Application-level state for the search flow */
export type AppSearchState =
  | { phase: 'idle' }
  | { phase: 'loading' }
  | { phase: 'not_found'; rollNumber: string }
  | { phase: 'found'; student: StudentRecord }
  | { phase: 'error'; message: string };

// ============================================================
// Raw CSV row types (only used in the data layer)
// ============================================================

/** Raw row from exercise_grading.csv */
export interface RawExerciseGradingRow {
  student_name: string;
  roll_no: string;
  github_username: string;
  repository: string;
  exercise: string;
  program_marks: string;
  max_program_marks: string;
  output_marks: string;
  max_output_marks: string;
  total_marks: string;
  max_marks: string;
  percentage: string;
  remarks: string;
  [key: string]: string;
}

/** Raw row from final_summary.csv */
export interface RawFinalSummaryRow {
  student_name: string;
  roll_no: string;
  github_username: string;
  repository: string;
  program_marks: string;
  max_program_marks: string;
  output_marks: string;
  max_output_marks: string;
  total_marks: string;
  max_marks: string;
  percentage: string;
  status: string;
  [key: string]: string;
}

/** Raw row from repository_check.csv */
export interface RawRepositoryCheckRow {
  student_name: string;
  roll_no: string;
  github_username: string;
  repository: string;
  status: string;
  url: string;
  checked_at: string;
  remarks: string;
  [key: string]: string;
}

/** Raw row from username_check.csv */
export interface RawUsernameCheckRow {
  student_name: string;
  roll_no: string;
  github_username: string;
  status: string;
  url: string;
  checked_at: string;
  remarks: string;
  [key: string]: string;
}

/** Raw row from file_grading.csv */
export interface RawFileGradingRow {
  student_name: string;
  roll_no: string;
  github_username: string;
  repository: string;
  exercise: string;
  program_file: string;
  program_found: string;
  program_marks: string;
  output_file: string;
  output_found: string;
  output_file_marks: string;
  output_content_marks: string;
  output_total: string;
  pair_total: string;
  max_marks: string;
  remarks: string;
  [key: string]: string;
}
