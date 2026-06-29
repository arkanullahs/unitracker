'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { COURSES, type CourseId } from '@/config/courses';
import type { ScheduledSession } from '@/config/schedule';
import { useStore } from '@/lib/store';
import { makeKey, getRemainingClassesForCourse } from '@/lib/semester';
import { playSuccessSound } from '@/lib/sound';
import { SCHEDULE } from '@/config/schedule';

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
  const isLab = session.type === 'lab';
  
  const remainingTotal = getRemainingClassesForCourse(session.courseId, completions, SCHEDULE);

  const handleClick = () => {
    if (!isCompleted) {
      playSuccessSound();
    }
    toggleCompletion(key);
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`w-full text-left glass-card flex flex-col justify-between cursor-pointer relative overflow-hidden group transition-all duration-300 ${isLab ? 'p-4 row-span-2 min-h-[150px]' : 'p-3 col-span-2 min-h-[68px]'} `}
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
      {isLab ? (
        // --- LAB CARD (Taller Widget) ---
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between w-full">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner"
                style={{ 
                  backgroundColor: isCompleted ? 'rgba(255,255,255,0.05)' : `${course.color}30`,
                  color: isCompleted ? 'rgba(255,255,255,0.2)' : course.color
                }}
              >
                <span className="font-bold text-[10px] tracking-wider">{session.courseId.toUpperCase()}</span>
              </div>
              <span className={`text-[9px] font-bold px-2 py-1 rounded-md ${isCompleted ? 'bg-white/5 text-white/20' : 'bg-white/10 text-white/50'}`}>
                {remainingTotal} LEFT
              </span>
            </div>
            <span
              className={`text-sm font-semibold break-words whitespace-normal leading-tight mt-1 ${
                isCompleted ? 'line-through text-white/30' : 'text-white/90'
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
                backgroundColor: isCompleted ? '#22c55e' : 'rgba(0,0,0,0.2)',
              }}
              animate={isCompleted ? { scale: [0.8, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isCompleted && (
                <Check size={14} strokeWidth={3} className="text-white" />
              )}
            </motion.div>
          </div>
        </>
      ) : (
        // --- THEORY CARD (Full Width List Item) ---
        <div className="flex items-center justify-between w-full h-full gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-inner shrink-0"
              style={{ 
                backgroundColor: isCompleted ? 'rgba(255,255,255,0.05)' : `${course.color}30`,
                color: isCompleted ? 'rgba(255,255,255,0.2)' : course.color
              }}
            >
              <span className="font-bold text-[10px] tracking-wider">{session.courseId.toUpperCase()}</span>
            </div>
            
            <div className="flex flex-col min-w-0">
              <span
                className={`text-[13px] font-semibold truncate ${
                  isCompleted ? 'line-through text-white/30' : 'text-white/90'
                }`}
              >
                {session.label}
              </span>
              <p
                className={`text-[10px] font-medium tracking-wide mt-0.5 ${
                  isCompleted ? 'text-white/20' : 'text-white/50'
                }`}
              >
                ROOM {session.room}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 ${isCompleted ? 'text-white/20' : 'text-white/40'}`}>
              {remainingTotal} LEFT
            </span>
            <motion.div
              className="flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center shadow-sm"
              style={{
                borderColor: isCompleted ? '#22c55e' : 'rgba(255,255,255,0.1)',
                backgroundColor: isCompleted ? '#22c55e' : 'rgba(0,0,0,0.2)',
              }}
              animate={isCompleted ? { scale: [0.8, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isCompleted && (
                <Check size={14} strokeWidth={3} className="text-white" />
              )}
            </motion.div>
          </div>
        </div>
      )}
    </motion.button>
  );
}
