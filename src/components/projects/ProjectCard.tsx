'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, Trash2 } from 'lucide-react';
import { COURSES, type CourseId } from '@/config/courses';
import type { LabProject } from '@/lib/store';
import { useStore } from '@/lib/store';
import { MilestoneRow } from './MilestoneRow';

const PROGRESS_RING_RADIUS = 18;
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS;

export function ProjectCard({ project }: { project: LabProject }) {
  const toggleMilestone = useStore((s) => s.toggleMilestone);
  const deleteMilestone = useStore((s) => s.deleteMilestone);
  const addMilestone = useStore((s) => s.addMilestone);
  const deleteLabProject = useStore((s) => s.deleteLabProject);

  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const course = COURSES[project.courseId];
  const total = project.milestones.length;
  const done = project.milestones.filter((m) => m.completed).length;
  const progress = total > 0 ? done / total : 0;
  const strokeDashoffset = PROGRESS_CIRCUMFERENCE * (1 - progress);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    addMilestone(project.id, { title: newTitle.trim(), completed: false });
    setNewTitle('');
    setAdding(false);
  };

  return (
    <motion.div
      layout
      className="glass-card p-4"
      style={{ borderLeft: `3px solid ${course.color}` }}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-start gap-3 flex-1 min-w-0 text-left"
        >
          <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
            <svg width={40} height={40} className="-rotate-90">
              <circle
                cx={20}
                cy={20}
                r={PROGRESS_RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={3}
              />
              <circle
                cx={20}
                cy={20}
                r={PROGRESS_RING_RADIUS}
                fill="none"
                stroke={course.color}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={PROGRESS_CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-white/90">
              {total > 0 ? `${Math.round(progress * 100)}%` : '—'}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white/90 truncate">
              {project.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-semibold uppercase"
                style={{ color: course.color }}
              >
                {course.shortName}
              </span>
              <span className="text-[10px] text-white/25">
                {done}/{total} milestones
              </span>
            </div>
            {project.description && (
              <p className="text-[11px] text-white/30 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
        </button>

        <div className="flex items-center gap-1 flex-shrink-0">
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown
              size={16}
              className="text-white/30"
              onClick={() => setOpen(!open)}
            />
          </motion.div>
          <button
            onClick={() => deleteLabProject(project.id)}
            className="p-1 rounded hover:bg-white/10 transition-colors"
          >
            <Trash2 size={14} className="text-white/20 hover:text-red-400" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-[52px]"
          >
            <div className="pt-3 space-y-1">
              {project.milestones.map((m) => (
                <MilestoneRow
                  key={m.id}
                  milestone={m}
                  onToggle={() => toggleMilestone(project.id, m.id)}
                  onDelete={() => deleteMilestone(project.id, m.id)}
                />
              ))}

              {adding ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAdd();
                      if (e.key === 'Escape') setAdding(false);
                    }}
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-xs text-white placeholder-white/20 focus:outline-none focus:border-white/20"
                    placeholder="Milestone title..."
                    autoFocus
                  />
                  <button
                    onClick={handleAdd}
                    disabled={!newTitle.trim()}
                    className="text-[10px] text-white/50 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAdding(true)}
                  className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-white/50 transition-colors pt-1"
                >
                  <Plus size={12} />
                  Add milestone
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
