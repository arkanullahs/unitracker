'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { COURSES, type CourseId } from '@/config/courses';
import type { Assessment } from '@/lib/store';
import { AssessmentItem } from './AssessmentItem';

interface CourseSectionProps {
  courseId: CourseId;
  assessments: Assessment[];
}

export function CourseSection({ courseId, assessments }: CourseSectionProps) {
  const [open, setOpen] = useState(true);
  const course = COURSES[courseId];
  if (assessments.length === 0) return null;

  const completed = assessments.filter((a) => a.status === 'completed').length;

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 px-1"
      >
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: course.color }}
          />
          <span className="text-sm font-semibold text-white/80">
            {course.shortName}
          </span>
          <span className="text-[11px] text-white/25">
            {completed}/{assessments.length}
          </span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} className="text-white/30" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pb-2 pl-1">
              {assessments.map((a) => (
                <AssessmentItem key={a.id} a={a} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
