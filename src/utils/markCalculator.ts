// ============================================================
// Mark calculation utilities
// All math is isolated here so components stay presentation-only
// ============================================================

/**
 * Safely parse a numeric string, returning 0 for invalid values.
 */
export function safeParseNumber(value: string | number | undefined | null): number {
  if (value === null || value === undefined || value === '') return 0;
  const n = Number(value);
  return isNaN(n) ? 0 : n;
}

/**
 * Calculate percentage from marks and max marks.
 * Returns 0 if maxMarks is 0 to avoid division by zero.
 */
export function calculatePercentage(marks: number, maxMarks: number): number {
  if (maxMarks <= 0) return 0;
  return Math.round((marks / maxMarks) * 1000) / 10; // 1 decimal place
}

/**
 * Calculate totals from experiment results.
 * Safer than trusting a "total" field in CSV data.
 */
export function calculateTotals(experiments: Array<{
  programMarks: number;
  maxProgramMarks: number;
  outputMarks: number;
  maxOutputMarks: number;
  totalMarks: number;
  maxMarks: number;
}>): {
  totalProgramMarks: number;
  maxProgramMarks: number;
  totalOutputMarks: number;
  maxOutputMarks: number;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
} {
  const totals = experiments.reduce(
    (acc, exp) => ({
      totalProgramMarks: acc.totalProgramMarks + exp.programMarks,
      maxProgramMarks: acc.maxProgramMarks + exp.maxProgramMarks,
      totalOutputMarks: acc.totalOutputMarks + exp.outputMarks,
      maxOutputMarks: acc.maxOutputMarks + exp.maxOutputMarks,
      totalMarks: acc.totalMarks + exp.totalMarks,
      maxMarks: acc.maxMarks + exp.maxMarks,
    }),
    {
      totalProgramMarks: 0,
      maxProgramMarks: 0,
      totalOutputMarks: 0,
      maxOutputMarks: 0,
      totalMarks: 0,
      maxMarks: 0,
    }
  );

  return {
    ...totals,
    percentage: calculatePercentage(totals.totalMarks, totals.maxMarks),
  };
}

/**
 * Format a mark fraction for display: "35 / 40"
 */
export function formatMark(marks: number, maxMarks: number): string {
  return `${marks} / ${maxMarks}`;
}

/**
 * Get a grade label from percentage.
 */
export function getGradeLabel(percentage: number): string {
  if (percentage >= 90) return 'Outstanding';
  if (percentage >= 80) return 'Excellent';
  if (percentage >= 70) return 'Very Good';
  if (percentage >= 60) return 'Good';
  if (percentage >= 50) return 'Satisfactory';
  return 'Needs Improvement';
}

/**
 * Convert an experiment ID like "ex01" to a human-readable label like "Exercise 1".
 */
export function experimentIdToLabel(experimentId: string): string {
  // Match patterns like ex01, ex1, EX01, exercise_1 etc.
  const match = experimentId.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    return `Exercise ${num}`;
  }
  // Fallback: capitalise
  return experimentId.charAt(0).toUpperCase() + experimentId.slice(1);
}
