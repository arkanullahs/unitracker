'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import type { CourseId } from '@/config/courses';
import { COURSES } from '@/config/courses';
import { CourseSection } from './CourseSection';

interface AssessmentDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export function AssessmentDrawer({ open, onClose, onAdd }: AssessmentDrawerProps) {
  const assessments = useStore((s) => s.assessments);

  const grouped = assessments.reduce(
    (acc, a) => {
      if (!acc[a.courseId]) acc[a.courseId] = [];
      acc[a.courseId].push(a);
      return acc;
    },
    {} as Record<CourseId, typeof assessments>
  );

  const courseOrder: CourseId[] = ['dip', 'cg', 'da', 'cc'];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-40">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm glass-card rounded-l-2xl rounded-r-none p-5 overflow-y-auto"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Assessments</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAdd}
                  className="text-xs font-semibold text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  + Add
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-white/60" />
                </button>
              </div>
            </div>

            {assessments.length === 0 ? (
              <p className="text-white/25 text-sm text-center py-12">
                No assessments yet. Tap + to add one.
              </p>
            ) : (
              <div className="space-y-1">
                {courseOrder.map((cid) => {
                  const items = grouped[cid];
                  if (!items || items.length === 0) return null;
                  return (
                    <CourseSection
                      key={cid}
                      courseId={cid}
                      assessments={items}
                    />
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
