'use client';

import { Check, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Milestone } from '@/lib/store';

interface MilestoneRowProps {
  milestone: Milestone;
  onToggle: () => void;
  onDelete: () => void;
}

export function MilestoneRow({ milestone, onToggle, onDelete }: MilestoneRowProps) {
  return (
    <motion.div
      layout
      className="flex items-center gap-3 py-1.5"
    >
      <button
        onClick={onToggle}
        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
          milestone.completed
            ? 'border-green-500 bg-green-500'
            : 'border-white/15'
        }`}
      >
        {milestone.completed && (
          <Check size={10} strokeWidth={3} className="text-white" />
        )}
      </button>
      <span
        className={`text-xs flex-1 ${
          milestone.completed
            ? 'line-through text-white/20'
            : 'text-white/60'
        }`}
      >
        {milestone.title}
      </span>
      {milestone.dueDate && (
        <span className="text-[10px] text-white/20">{milestone.dueDate}</span>
      )}
      <button
        onClick={onDelete}
        className="p-0.5 rounded hover:bg-white/10 transition-colors"
      >
        <Trash2 size={12} className="text-white/15 hover:text-red-400 transition-colors" />
      </button>
    </motion.div>
  );
}
