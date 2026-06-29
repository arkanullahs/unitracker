'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COURSES, type CourseId } from '@/config/courses';
import type { ScheduledSession } from '@/config/schedule';
import { useStore } from '@/lib/store';
import { makeKey } from '@/lib/semester';
import { playSuccessSound } from '@/lib/sound';

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

  const handleClick = () => {
    if (!isCompleted) {
      playSuccessSound();
    }
    toggleCompletion(key);
  };

  return (
    <motion.button
      onClick={handleClick}
      className="w-full aspect-square text-left glass-card p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden group transition-all duration-300"
      style={{ 
        background: isCompleted 
          ? 'rgba(255, 255, 255, 0.02)' 
          : `linear-gradient(145deg, ${course.color}25 0%, rgba(255, 255, 255, 0.03) 100%)`,
        border: `1px solid ${isCompleted ? 'rgba(255,255,255,0.05)' : `${course.color}40`}`
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: `0 8px 30px -5px ${course.color}35, 0 4px 15px -5px ${course.color}20`
      }}
      whileTap={{ scale: 0.95 }}
      animate={
        isCompleted
          ? { opacity: 0.35, scale: 0.98 }
          : { opacity: 1, scale: 1 }
      }
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <div className="flex flex-col gap-2">
        <div 
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-1 shadow-inner"
          style={{ 
            backgroundColor: isCompleted ? 'rgba(255,255,255,0.05)' : `${course.color}30`,
            color: isCompleted ? 'rgba(255,255,255,0.2)' : course.color
          }}
        >
          <span className="font-bold text-xs tracking-wider">{session.courseId.toUpperCase()}</span>
        </div>
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

      <div className="flex items-end justify-between w-full mt-2">
        <p
          className={`text-[11px] font-medium tracking-wide ${
            isCompleted ? 'text-white/20' : 'text-white/50'
          }`}
        >
          ROOM {session.room}
        </p>

        <motion.div
          className="flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center shadow-sm"
          style={{
            borderColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)',
            backgroundColor: isCompleted
              ? '#22c55e'
              : 'rgba(0,0,0,0.2)',
          }}
          animate={
            isCompleted ? { scale: [0.8, 1.15, 1] } : { scale: 1 }
          }
          transition={{ duration: 0.3 }}
        >
          {isCompleted && (
            <Check size={14} strokeWidth={3} className="text-white" />
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}
