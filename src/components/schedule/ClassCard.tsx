'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COURSES, type CourseId } from '@/config/courses';
import type { ScheduledSession } from '@/config/schedule';
import { useStore } from '@/lib/store';
import { makeKey } from '@/lib/semester';

interface ClassCardProps {
  session: ScheduledSession;
  date: Date;
}

export function ClassCard({ session, date }: ClassCardProps) {
  const completions = useStore((s) => s.completions);
  const toggleCompletion = useStore((s) => s.toggleCompletion);
  const course = COURSES[session.courseId];
  const key = makeKey(date, session.id);
  const isCompleted = completions[key] === true;

  return (
    <motion.button
      onClick={() => toggleCompletion(key)}
      className="w-full text-left glass-card p-3 cursor-pointer relative overflow-hidden"
      style={{ borderLeft: `3px solid ${course.color}` }}
      whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.95 }}
      animate={
        isCompleted
          ? { opacity: 0.35, scale: 0.98 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.color }}
            />
            <span
              className={`text-sm font-semibold break-words whitespace-normal leading-tight ${
                isCompleted
                  ? 'line-through text-white/30'
                  : 'text-white/90'
              }`}
            >
              {session.label}
            </span>
          </div>
          <p
            className={`text-[11px] ml-4 ${
              isCompleted ? 'text-white/15' : 'text-white/30'
            }`}
          >
            Room {session.room}
          </p>
        </div>

        <motion.div
          className="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.15)',
            backgroundColor: isCompleted
              ? '#22c55e'
              : 'transparent',
          }}
          animate={
            isCompleted ? { scale: [0.8, 1.15, 1] } : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
        >
          {isCompleted && (
            <Check size={12} strokeWidth={3} className="text-white" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}
