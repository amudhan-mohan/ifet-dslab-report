import { useState, useCallback, useEffect } from 'react';
import { searchStudent } from '../services/csvService';
import { normalizeRollNumber } from '../utils/csvNormalizer';
import type { AppSearchState } from '../types/student';

interface UseStudentDataReturn {
  state: AppSearchState;
  search: (rollNumber: string) => void;
  reset: () => void;
}

/**
 * React hook that manages the student search lifecycle.
 * Wraps the CSV service with loading state, error handling, and reset.
 */
export function useStudentData(initialRollNumber?: string): UseStudentDataReturn {
  const [state, setState] = useState<AppSearchState>({ phase: 'idle' });

  const search = useCallback((rawRollNumber: string) => {
    const rollNumber = normalizeRollNumber(rawRollNumber);

    if (!rollNumber) {
      setState({ phase: 'idle' });
      return;
    }

    setState({ phase: 'loading' });

    // Use setTimeout to yield to the browser so the loading state renders
    // before the synchronous CSV parsing runs
    setTimeout(() => {
      try {
        const result = searchStudent(rollNumber);
        if (result.found) {
          setState({ phase: 'found', student: result.student });
        } else {
          setState({ phase: 'not_found', rollNumber });
        }
      } catch (err) {
        console.error('[useStudentData] Search error:', err);
        setState({
          phase: 'error',
          message: 'An error occurred while loading student data. Please try again.',
        });
      }
    }, 80);
  }, []);

  const reset = useCallback(() => {
    setState({ phase: 'idle' });
  }, []);

  // Auto-search if an initial roll number is provided (URL deep link)
  useEffect(() => {
    if (initialRollNumber) {
      search(initialRollNumber);
    }
  }, [initialRollNumber, search]);

  return { state, search, reset };
}
