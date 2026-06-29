import {
  startOfWeek,
  addWeeks,
  isWithinInterval,
  differenceInCalendarDays,
  format,
  addDays,
} from 'date-fns';

export const SEMESTER = {
  startDate: new Date('2026-06-22'),
  endDate: new Date('2026-10-01'),
  breakStart: new Date('2026-08-10'),
  breakEnd: new Date('2026-08-16'),
  totalTeachingWeeks: 14,
};

export function getTeachingWeekNumber(date: Date): number | null {
  const start = SEMESTER.startDate;

  const totalDays = differenceInCalendarDays(date, start);
  if (totalDays < 0) return null;

  if (
    isWithinInterval(date, {
      start: SEMESTER.breakStart,
      end: SEMESTER.breakEnd,
    })
  ) {
    return null;
  }

  if (date > SEMESTER.endDate) return null;

  const rawWeek = Math.floor(totalDays / 7) + 1;

  if (rawWeek === 8) return null;

  if (rawWeek > 8) return rawWeek - 1;

  return rawWeek;
}

export function getWeekParity(date: Date): 'odd' | 'even' | 'break' | null {
  if (
    isWithinInterval(date, {
      start: SEMESTER.breakStart,
      end: SEMESTER.breakEnd,
    })
  ) {
    return 'break';
  }

  const week = getTeachingWeekNumber(date);
  if (week === null) return null;

  return week % 2 === 1 ? 'odd' : 'even';
}

export function getWeekStart(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function makeKey(date: Date, sessionId: string): string {
  return `${format(date, 'yyyy-MM-dd')}__${sessionId}`;
}

export function getSemesterProgress(
  completions: Record<string, boolean>,
  totalSessions: number
): number {
  const completed = Object.values(completions).filter(Boolean).length;
  if (totalSessions === 0) return 0;
  return Math.round((completed / totalSessions) * 100);
}

export function getWeekDateRange(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 2);
  return `${format(weekStart, 'MMM d')} – ${format(weekEnd, 'MMM d, yyyy')}`;
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
