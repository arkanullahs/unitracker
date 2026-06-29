'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ProjectCard } from './ProjectCard';
import { LAB_COURSES } from '@/config/courses';

interface ProjectsDrawerProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export function ProjectsDrawer({ open, onClose, onAdd }: ProjectsDrawerProps) {
  const labProjects = useStore((s) => s.labProjects);

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
              <h2 className="text-lg font-bold text-white">Lab Projects</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onAdd}
                  className="text-xs font-semibold text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  + New
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={18} className="text-white/60" />
                </button>
              </div>
            </div>

            {labProjects.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-white/25 text-sm">
                  No lab projects yet.
                </p>
                <p className="text-white/15 text-xs mt-1">
                  For {LAB_COURSES.map((c) => c.shortName).join(', ')} only.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {labProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
