'use client';

import { useEffect, useState, useCallback } from 'react';
import { addDays, subDays } from 'date-fns';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { BreakScreen } from '@/components/layout/BreakScreen';
import { WeekView } from '@/components/schedule/WeekView';
import { AssessmentDrawer } from '@/components/assessments/AssessmentDrawer';
import { AddAssessmentModal } from '@/components/assessments/AddAssessmentModal';
import { ProjectsDrawer } from '@/components/projects/ProjectsDrawer';
import { AddProjectModal } from '@/components/projects/AddProjectModal';
import { FAB } from '@/components/ui/FAB';
import {
  getWeekStart,
  getWeekParity,
} from '@/lib/semester';
import { useStore, type AssessmentType } from '@/lib/store';
import { SEMESTER } from '@/lib/semester';
import type { CourseId } from '@/config/courses';

export default function Home() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessmentAddOpen, setAssessmentAddOpen] = useState(false);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [projectAddOpen, setProjectAddOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const hydrateFromKV = useStore((s) => s.hydrateFromKV);
  const addAssessment = useStore((s) => s.addAssessment);
  const addLabProject = useStore((s) => s.addLabProject);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/kv');
        if (res.ok) {
          const data = await res.json();
          if (data && (data.completions || data.assessments || data.labProjects)) {
            hydrateFromKV(data);
          }
        }
      } catch {}
      setHydrated(true);
    };
    load();
  }, [hydrateFromKV]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = setInterval(async () => {
      const payload = useStore.getState().toKVPayload();
      try {
        await fetch('/api/kv', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [hydrated]);

  const parity = getWeekParity(currentDate);

  const canGoPrev = currentDate > SEMESTER.startDate;
  const canGoNext = addDays(currentDate, 1) <= SEMESTER.endDate;

  const goToPrevDay = useCallback(() => {
    setCurrentDate((d) => subDays(d, 1));
  }, []);

  const goToNextDay = useCallback(() => {
    setCurrentDate((d) => addDays(d, 1));
  }, []);

  const handleAddAssessment = (data: {
    courseId: CourseId;
    type: AssessmentType;
    title: string;
    date?: string;
    totalMarks?: number;
    obtainedMarks?: number;
    notes?: string;
  }) => {
    addAssessment({ ...data, status: 'upcoming' });
    setAssessmentAddOpen(false);
  };

  const handleAddProject = (data: {
    courseId: 'dip' | 'cg' | 'da';
    title: string;
    description?: string;
    milestones: { title: string; dueDate?: string }[];
  }) => {
    addLabProject({
      ...data,
      milestones: data.milestones.map((m) => ({
        ...m,
        id: Math.random().toString(36).slice(2),
        completed: false,
      })),
    });
    setProjectAddOpen(false);
  };

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-white/10 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <Header
        weekStart={currentDate}
        onPrevWeek={goToPrevDay}
        onNextWeek={goToNextDay}
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        onOpenAssessments={() => setAssessmentOpen(true)}
        onOpenProjects={() => setProjectsOpen(true)}
      />

      <AnimatePresence mode="wait">
        {parity === 'break' ? (
          <BreakScreen key="break" />
        ) : (
          <WeekView key="day" selectedDate={currentDate} />
        )}
      </AnimatePresence>

      <AssessmentDrawer
        open={assessmentOpen}
        onClose={() => setAssessmentOpen(false)}
        onAdd={() => {
          setAssessmentOpen(false);
          setAssessmentAddOpen(true);
        }}
      />

      <AddAssessmentModal
        open={assessmentAddOpen}
        onClose={() => setAssessmentAddOpen(false)}
        onSave={handleAddAssessment}
      />

      <ProjectsDrawer
        open={projectsOpen}
        onClose={() => setProjectsOpen(false)}
        onAdd={() => {
          setProjectsOpen(false);
          setProjectAddOpen(true);
        }}
      />

      <AddProjectModal
        open={projectAddOpen}
        onClose={() => setProjectAddOpen(false)}
        onAdd={handleAddProject}
      />

      <FAB
        onClick={() => setAssessmentAddOpen(true)}
        label="Add Assessment"
      />
    </div>
  );
}
