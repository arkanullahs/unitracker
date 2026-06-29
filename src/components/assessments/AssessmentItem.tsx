'use client';

import { motion } from 'framer-motion';
import { Check, Trash2 } from 'lucide-react';
import type { Assessment } from '@/lib/store';
import { useStore } from '@/lib/store';
import { COURSES } from '@/config/courses';

export function AssessmentItem({ a }: { a: Assessment }) {
  const updateAssessment = useStore((s) => s.updateAssessment);
  const deleteAssessment = useStore((s) => s.deleteAssessment);
  const course = COURSES[a.courseId];

  const isCompleted = a.status === 'completed';

  const toggle = () => {
    updateAssessment(a.id, {
      status: isCompleted ? 'upcoming' : 'completed',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className={`p-3 rounded-xl border transition-colors ${
        isCompleted
          ? 'bg-white/[0.02] border-white/5'
          : 'bg-white/[0.04] border-white/10'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={toggle}
          className="flex items-start gap-3 flex-1 min-w-0 text-left"
        >
          <div
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
              isCompleted
                ? 'border-green-500 bg-green-500'
                : 'border-white/15'
            }`}
          >
            {isCompleted && <Check size={12} strokeWidth={3} className="text-white" />}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-medium truncate ${
                isCompleted
                  ? 'line-through text-white/25'
                  : 'text-white/80'
              }`}
            >
              {a.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-semibold uppercase"
                style={{ color: course.color }}
              >
                {course.shortName}
              </span>
              {a.date && (
                <span className="text-[10px] text-white/25">
                  {a.date}
                </span>
              )}
              {a.totalMarks && (
                <span className="text-[10px] text-white/25">
                  {a.obtainedMarks ?? '—'}/{a.totalMarks}
                </span>
              )}
            </div>
            {a.notes && (
              <p className="text-[11px] text-white/20 mt-1">{a.notes}</p>
            )}
          </div>
        </button>

        <button
          onClick={() => deleteAssessment(a.id)}
          className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
        >
          <Trash2 size={14} className="text-white/20 hover:text-red-400 transition-colors" />
        </button>
      </div>
    </motion.div>
  );
}
