'use client';

import { type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'button';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function GlassCard({
  children,
  className = '',
  as = 'div',
  onClick,
  style,
}: GlassCardProps) {
  const Component = motion.create(as);
  return (
    <Component
      className={`glass-card ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </Component>
  );
}

export function CourseBadge({
  courseId,
  className = '',
}: {
  courseId: string;
  className?: string;
}) {
  const colors: Record<string, { bg: string; text: string }> = {
    dip: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
    cg: { bg: 'rgba(59,130,246,0.15)', text: '#60a5fa' },
    da: { bg: 'rgba(236,72,153,0.15)', text: '#f472b6' },
    cc: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
  };
  const c = colors[courseId] || colors.dip;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${className}`}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {courseId.toUpperCase()}
    </span>
  );
}

export function ProgressBar({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  return (
    <div className={`relative h-2 rounded-full overflow-hidden bg-white/5 ${className}`}>
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: '#a855f7' }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />
    </div>
  );
}
