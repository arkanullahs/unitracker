'use client';

import { useMemo } from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  getSessionsForDayAndParity,
  type Day,
  type ScheduledSession,
} from '@/config/schedule';
import { getWeekParity } from '@/lib/semester';
import { useStore } from '@/lib/store';
import { makeKey } from '@/lib/semester';
import { ClassCard } from './ClassCard';

const DAY_NAMES: Record<Day, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
};

interface DayColumnProps {
  day: Day;
  date: Date;
}

export function DayColumn({ day, date }: DayColumnProps) {
  const completions = useStore((s) => s.completions);
  const updateAssessment = useStore((s) => s.updateAssessment);
  const parity = getWeekParity(date);

  const assessmentsAll = useStore((s) => s.assessments);
  
  const sessions: ScheduledSession[] = useMemo(() => {
    if (!parity || parity === 'break') return [];
    return getSessionsForDayAndParity(day, parity as 'odd' | 'even');
  }, [day, parity]);

  const todaysAssessments = useMemo(() => {
    return assessmentsAll.filter(a => a.date && isSameDay(parseISO(a.date), date));
  }, [assessmentsAll, date]);

  const doneCount = useMemo(
    () =>
      sessions.filter((s) => completions[makeKey(date, s.id)] === true).length,
    [sessions, completions, date]
  );

  const isToday = isSameDay(date, new Date());

  return (
    <motion.div
      className="flex-1 min-w-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: { mon: 0, tue: 0.05, wed: 0.1 }[day] }}
    >
      <div
        className={`text-center mb-3 pb-2 ${
          isToday
            ? 'border-b-2 border-b-white/20'
            : 'border-b border-b-white/5'
        }`}
      >
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30 mb-1"
        >
          {DAY_NAMES[day].substring(0, 3)}
        </p>
        <p
          className={`text-xs font-medium ${
            isToday ? 'text-white/70' : 'text-white/30'
          }`}
        >
          {format(date, 'MMM d')}
        </p>
        {sessions.length > 0 && doneCount > 0 && (
          <p className="text-[10px] text-green-400/60 mt-0.5 font-medium">
            {doneCount}/{sessions.length} done
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {sessions.length === 0 && (
          <p className="text-white/15 text-xs text-center py-4 italic">
            No classes
          </p>
        )}
        {sessions.map((session) => (
          <ClassCard
            key={session.id}
            session={session}
            date={date}
          />
        ))}
        {todaysAssessments.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Assessments</p>
            {todaysAssessments.map(assessment => {
              const isCompleted = assessment.status === 'completed';
              return (
                <motion.button
                  key={assessment.id}
                  onClick={() => updateAssessment(assessment.id, { status: isCompleted ? 'upcoming' : 'completed' })}
                  className="w-full text-left glass-card p-3 cursor-pointer relative overflow-hidden flex items-start justify-between gap-2"
                  style={{ borderLeft: '3px solid rgba(239, 68, 68, 0.7)' }}
                  whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
                  whileTap={{ scale: 0.95 }}
                  animate={
                    isCompleted
                      ? { opacity: 0.35, scale: 0.98 }
                      : { opacity: 1, scale: 1 }
                  }
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-sm font-semibold break-words whitespace-normal leading-tight ${isCompleted ? 'line-through text-white/30' : 'text-white/90'}`}>
                        {assessment.title}
                      </span>
                    </div>
                    <p className={`text-[11px] capitalize ${isCompleted ? 'text-white/15' : 'text-white/50'}`}>
                      {assessment.type.replace('_', ' ')}
                    </p>
                  </div>
                  <motion.div
                    className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.15)',
                      backgroundColor: isCompleted ? '#22c55e' : 'transparent',
                    }}
                    animate={isCompleted ? { scale: [0.8, 1.15, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted && (
                      <Check size={12} strokeWidth={3} className="text-white" />
                    )}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
