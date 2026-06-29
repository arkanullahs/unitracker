'use client';

import { useMemo, useState } from 'react';
import { addDays } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import type { Day } from '@/config/schedule';
import { getWeekParity } from '@/lib/semester';
import { useStore } from '@/lib/store';
import { makeKey } from '@/lib/semester';
import { getSessionsForDayAndParity } from '@/config/schedule';
import { DayColumn } from './DayColumn';
import { ConfettiPop } from '@/components/ui/ConfettiPop';

const DAYS: Day[] = ['mon', 'tue', 'wed'];

interface WeekViewProps {
  selectedDate: Date;
}

export function WeekView({ selectedDate }: WeekViewProps) {
  const completions = useStore((s) => s.completions);
  const [showConfetti, setShowConfetti] = useState(false);



  const allDoneToday = useMemo(() => {
    const parity = getWeekParity(selectedDate);
    if (!parity || parity === 'break') return false;
    const todayDay = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    if (!['mon', 'tue', 'wed'].includes(todayDay)) return false;
    const sessions = getSessionsForDayAndParity(todayDay as Day, parity as 'odd' | 'even');
    if (sessions.length === 0) return false;
    return sessions.every((s) => completions[makeKey(selectedDate, s.id)] === true);
  }, [completions, selectedDate]);

  const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
  const isValidDay = ['mon', 'tue', 'wed'].includes(dayName);

  if (showConfetti) {
    // reset confetti trigger after animation
    setTimeout(() => setShowConfetti(false), 2500);
  }

  return (
    <>
      <ConfettiPop trigger={showConfetti} />
      <motion.div
        className="flex gap-3 px-2"
        layout
      >
        <AnimatePresence mode="popLayout">
          {isValidDay ? (
            <DayColumn key={dayName} day={dayName as Day} date={selectedDate} />
          ) : (
            <div className="flex-1 text-center py-12 text-white/40">
              <p className="text-sm">No schedule for this day</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
