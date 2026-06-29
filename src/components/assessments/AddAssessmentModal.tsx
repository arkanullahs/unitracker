'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { COURSES, type CourseId } from '@/config/courses';
import type { AssessmentType } from '@/lib/store';

const ASSESSMENT_TYPES: { value: AssessmentType; label: string }[] = [
  { value: 'class_test', label: 'Class Test' },
  { value: 'lab_test', label: 'Lab Test' },
  { value: 'lab_mid', label: 'Lab Mid' },
  { value: 'lab_final', label: 'Lab Final' },
];

const LAB_ONLY: AssessmentType[] = ['lab_test', 'lab_mid', 'lab_final'];

interface AddAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    courseId: CourseId;
    type: AssessmentType;
    title: string;
    date?: string;
    totalMarks?: number;
    obtainedMarks?: number;
    notes?: string;
  }) => void;
}

export function AddAssessmentModal({
  open,
  onClose,
  onSave,
}: AddAssessmentModalProps) {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<CourseId | null>(null);
  const [type, setType] = useState<AssessmentType | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [totalMarks, setTotalMarks] = useState<number | undefined>();
  const [obtainedMarks, setObtainedMarks] = useState<number | undefined>();
  const [notes, setNotes] = useState('');

  const course = courseId ? COURSES[courseId] : null;
  const availableTypes = courseId
    ? courseId === 'cc'
      ? ASSESSMENT_TYPES.filter((t) => !LAB_ONLY.includes(t.value))
      : ASSESSMENT_TYPES
    : [];

  const reset = () => {
    setStep(1);
    setCourseId(null);
    setType(null);
    setTitle('');
    setDate('');
    setTotalMarks(undefined);
    setObtainedMarks(undefined);
    setNotes('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!courseId || !type || !title.trim()) return;
    onSave({
      courseId,
      type,
      title: title.trim(),
      date: date || undefined,
      totalMarks,
      obtainedMarks,
      notes: notes.trim() || undefined,
    });
    reset();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Assessment">
      <motion.div className="space-y-4" key={step}>
        {step === 1 && (
          <>
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
              Select Course
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(COURSES).map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => {
                    setCourseId(c.id);
                    setStep(2);
                  }}
                  className="p-3 rounded-xl text-sm font-semibold text-white transition-colors"
                  style={{
                    backgroundColor: `${c.color}20`,
                    border: `1px solid ${c.color}40`,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {c.shortName}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {step === 2 && courseId && (
          <>
            <button
              onClick={() => setStep(1)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              ← Back
            </button>
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
              Select Type
            </p>
            <div className="grid grid-cols-2 gap-2">
              {availableTypes.map((t) => (
                <motion.button
                  key={t.value}
                  onClick={() => {
                    setType(t.value);
                    setStep(3);
                  }}
                  className="p-3 rounded-xl text-sm font-semibold text-white/80 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {t.label}
                </motion.button>
              ))}
            </div>
          </>
        )}

        {step === 3 && type && (
          <>
            <button
              onClick={() => setStep(2)}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              ← Back
            </button>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                placeholder="e.g. Week 3 Class Test"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  value={totalMarks ?? ''}
                  onChange={(e) =>
                    setTotalMarks(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                  placeholder="100"
                />
              </div>
              <div>
                <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                  Obtained
                </label>
                <input
                  type="number"
                  value={obtainedMarks ?? ''}
                  onChange={(e) =>
                    setObtainedMarks(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                  placeholder="85"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 resize-none"
                placeholder="Optional notes..."
              />
            </div>

            <motion.button
              onClick={handleSave}
              disabled={!title.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: course ? course.color : '#a855f7',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Save Assessment
            </motion.button>
          </>
        )}
      </motion.div>
    </Modal>
  );
}
