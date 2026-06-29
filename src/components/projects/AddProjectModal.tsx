'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { LAB_COURSES, type CourseId } from '@/config/courses';

interface AddProjectModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    courseId: 'dip' | 'cg' | 'da';
    title: string;
    description?: string;
    milestones: { title: string; dueDate?: string }[];
  }) => void;
}

export function AddProjectModal({ open, onClose, onAdd }: AddProjectModalProps) {
  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<'dip' | 'cg' | 'da' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [milestones, setMilestones] = useState<{ title: string }[]>([]);

  const reset = () => {
    setStep(1);
    setCourseId(null);
    setTitle('');
    setDescription('');
    setMilestoneInput('');
    setMilestones([]);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    if (!courseId || !title.trim()) return;
    onAdd({
      courseId,
      title: title.trim(),
      description: description.trim() || undefined,
      milestones: milestones.map((m) => ({ title: m.title })),
    });
    reset();
  };

  const addMilestone = () => {
    if (!milestoneInput.trim()) return;
    setMilestones([...milestones, { title: milestoneInput.trim() }]);
    setMilestoneInput('');
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Lab Project">
      <div className="space-y-4">
        {step === 1 && (
          <>
            <p className="text-xs text-white/40 uppercase tracking-wider font-semibold">
              Select Course
            </p>
            <div className="grid grid-cols-3 gap-2">
              {LAB_COURSES.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => {
                    setCourseId(c.id as 'dip' | 'cg' | 'da');
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

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                placeholder="e.g. Image Filter App"
                autoFocus
              />
            </div>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 resize-none"
                placeholder="Optional..."
              />
            </div>

            <div>
              <label className="text-[11px] text-white/40 uppercase tracking-wider font-semibold block mb-1">
                Milestones
              </label>
              {milestones.length > 0 && (
                <div className="space-y-1 mb-2">
                  {milestones.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-1.5 text-xs text-white/60"
                    >
                      <span>{m.title}</span>
                      <button
                        onClick={() =>
                          setMilestones(milestones.filter((_, j) => j !== i))
                        }
                        className="text-white/20 hover:text-red-400 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addMilestone()}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                  placeholder="Milestone title..."
                />
                <button
                  onClick={addMilestone}
                  disabled={!milestoneInput.trim()}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 disabled:opacity-20 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            <motion.button
              onClick={handleSave}
              disabled={!title.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#a855f7',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Save Project
            </motion.button>
          </>
        )}
      </div>
    </Modal>
  );
}
