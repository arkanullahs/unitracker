'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BarChart3, Beaker } from 'lucide-react';
import { ProgressBar } from '@/components/ui/GlassCard';
import { getTeachingWeekNumber } from '@/lib/semester';
import { useStore } from '@/lib/store';
import { SCHEDULE } from '@/config/schedule';
import { format } from 'date-fns';

interface HeaderProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  onOpenAssessments: () => void;
  onOpenProjects: () => void;
}

export function Header({
  weekStart,
  onPrevWeek,
  onNextWeek,
  canGoPrev,
  canGoNext,
  onOpenAssessments,
  onOpenProjects,
}: HeaderProps) {
  const completions = useStore((s) => s.completions);
  const progress = useMemo(() => {
    const total = SCHEDULE.length * 14; // 12 sessions x 14 weeks
    const done = Object.values(completions).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }, [completions]);

  const weekNum = getTeachingWeekNumber(weekStart);

  return (
    <motion.header
      className="sticky top-0 z-30 glass-card mx-2 mt-2 mb-3 p-4 rounded-2xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-[22px] font-bold text-white leading-tight">
            Final Tracker
          </h1>
          {weekNum && (
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mt-0.5">
              Week {weekNum} of 14
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenAssessments}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Assessments"
          >
            <BarChart3 size={18} className="text-white/60" />
          </button>
          <button
            onClick={onOpenProjects}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Lab Projects"
          >
            <Beaker size={18} className="text-white/60" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-2">
        <button
          onClick={onPrevWeek}
          disabled={!canGoPrev}
          className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} className="text-white/70" />
        </button>

        <span className="text-sm text-white/50 font-medium flex-1 text-center tabular-nums">
          {format(weekStart, 'EEE, MMM d, yyyy')}
        </span>

        <button
          onClick={onNextWeek}
          disabled={!canGoNext}
          className="p-1 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} className="text-white/70" />
        </button>
      </div>

      <ProgressBar value={progress} />
      <p className="text-[10px] text-white/25 text-right mt-1">{progress}% done</p>
    </motion.header>
  );
}
