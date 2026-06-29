import type { CourseId } from './courses';

export type Day = 'mon' | 'tue' | 'wed';
export type WeekPattern = 'all' | 'odd' | 'even';
export type SessionType = 'theory' | 'lab' | 'tutorial';

export interface ScheduledSession {
  id: string;
  courseId: CourseId;
  label: string;
  type: SessionType;
  day: Day;
  room: string;
  order: number;
  weekPattern: WeekPattern;
}

export const SCHEDULE: ScheduledSession[] = [
  // ─── MONDAY ───────────────────────────────────────────────
  { id: 'mon_dip_theory_7A03',      courseId: 'dip', label: 'DIP Theory 4227',    type: 'theory',   day: 'mon', room: '7A03', order: 1, weekPattern: 'all' },
  { id: 'mon_cg_theory_7C07',       courseId: 'cg',  label: 'CG Theory 4203',     type: 'theory',   day: 'mon', room: '7C07', order: 2, weekPattern: 'all' },
  { id: 'mon_da_lab_7B08',          courseId: 'da',  label: 'DA Lab 4262',        type: 'lab',      day: 'mon', room: '7B08', order: 3, weekPattern: 'odd' },
  { id: 'mon_da_tutorial_7C06',     courseId: 'da',  label: '2X DA Theory 4261 (1/2)',  type: 'tutorial', day: 'mon', room: '7C06', order: 4, weekPattern: 'all' },
  { id: 'mon_da_tutorial_7C06_2',   courseId: 'da',  label: '2X DA Theory 4261 (2/2)',  type: 'tutorial', day: 'mon', room: '7C06', order: 5, weekPattern: 'all' },
  // ─── TUESDAY ─────────────────────────────────────────────
  { id: 'tue_cc_tutorial_7A03',     courseId: 'cc',  label: '2X CC 4267 (1/2)',         type: 'tutorial', day: 'tue', room: '7A03', order: 1, weekPattern: 'all' },
  { id: 'tue_cc_tutorial_7A03_2',   courseId: 'cc',  label: '2X CC 4267 (2/2)',         type: 'tutorial', day: 'tue', room: '7A03', order: 1, weekPattern: 'all' },
  { id: 'tue_dip_theory_7A03',      courseId: 'dip', label: 'DIP Theory 4227',    type: 'theory',   day: 'tue', room: '7A03', order: 2, weekPattern: 'all' },
  { id: 'tue_cg_lab_7B06',          courseId: 'cg',  label: 'CG Lab 4204',        type: 'lab',      day: 'tue', room: '7B06', order: 3, weekPattern: 'odd' },
  { id: 'tue_dip_lab_7B05',         courseId: 'dip', label: 'DIP Lab 4228',       type: 'lab',      day: 'tue', room: '7B05', order: 4, weekPattern: 'even' },
  // ─── WEDNESDAY ───────────────────────────────────────────
  { id: 'wed_cc_theory_7A05',       courseId: 'cc',  label: 'CC 4267',            type: 'theory',   day: 'wed', room: '7A05', order: 1, weekPattern: 'all' },
  { id: 'wed_dip_theory_7A05',      courseId: 'dip', label: 'DIP Theory 4227',    type: 'theory',   day: 'wed', room: '7A05', order: 2, weekPattern: 'all' },
  { id: 'wed_cg_theory_7A07',       courseId: 'cg',  label: 'CG Theory 4203',     type: 'theory',   day: 'wed', room: '7A07', order: 3, weekPattern: 'all' },
  { id: 'wed_da_theory_7A06',       courseId: 'da',  label: 'DA Theory 4261',     type: 'theory',   day: 'wed', room: '7A06', order: 4, weekPattern: 'all' },
  { id: 'wed_cg_theory_7C06',       courseId: 'cg',  label: 'CG Theory 4203',     type: 'theory',   day: 'wed', room: '7C06', order: 5, weekPattern: 'all' },
];

export const SCHEDULE_BY_DAY: Record<Day, ScheduledSession[]> = {
  mon: [],
  tue: [],
  wed: [],
};

for (const s of SCHEDULE) {
  SCHEDULE_BY_DAY[s.day].push(s);
}

for (const day of Object.keys(SCHEDULE_BY_DAY) as Day[]) {
  SCHEDULE_BY_DAY[day].sort((a, b) => a.order - b.order);
}

export function getSessionsForDayAndParity(
  day: Day,
  parity: 'odd' | 'even' | 'all'
): ScheduledSession[] {
  const sessions = SCHEDULE_BY_DAY[day];
  if (parity === 'all') return sessions;
  return sessions.filter(
    (s) => s.weekPattern === 'all' || s.weekPattern === parity
  );
}
