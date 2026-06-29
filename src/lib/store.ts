import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CourseId } from '@/config/courses';

export type AssessmentType =
  | 'class_test'
  | 'lab_test'
  | 'lab_mid'
  | 'lab_final'
  | 'lab_project';

export interface Assessment {
  id: string;
  courseId: CourseId;
  type: AssessmentType;
  title: string;
  date?: string;
  totalMarks?: number;
  obtainedMarks?: number;
  notes?: string;
  status: 'upcoming' | 'completed';
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate?: string;
  completed: boolean;
}

export interface LabProject {
  id: string;
  courseId: 'dip' | 'cg' | 'da';
  title: string;
  description?: string;
  milestones: Milestone[];
  createdAt: string;
}

export type CompletionKey = string;

let uuidCounter = 0;
function uid(): string {
  uuidCounter += 1;
  return `${Date.now()}-${uuidCounter}-${Math.random().toString(36).slice(2, 9)}`;
}

export interface AppState {
  completions: Record<CompletionKey, boolean>;
  assessments: Assessment[];
  labProjects: LabProject[];

  toggleCompletion: (key: CompletionKey) => void;
  addAssessment: (data: Omit<Assessment, 'id' | 'createdAt'>) => void;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  addLabProject: (data: Omit<LabProject, 'id' | 'createdAt'>) => void;
  updateLabProject: (id: string, updates: Partial<LabProject>) => void;
  deleteLabProject: (id: string) => void;
  addMilestone: (projectId: string, m: Omit<Milestone, 'id'>) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  deleteMilestone: (projectId: string, milestoneId: string) => void;
  hydrateFromKV: (data: { completions?: Record<string, boolean>; assessments?: Assessment[]; labProjects?: LabProject[] }) => void;
  toKVPayload: () => { completions: Record<string, boolean>; assessments: Assessment[]; labProjects: LabProject[] };
}

const kvStorage = {
  getItem: async (): Promise<string | null> => {
    try {
      const res = await fetch('/api/kv');
      if (!res.ok) return null;
      return JSON.stringify(await res.json());
    } catch {
      return null;
    }
  },
  setItem: async (_key: string, value: string): Promise<void> => {
    try {
      await fetch('/api/kv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: value,
      });
    } catch {}
  },
  removeItem: async (): Promise<void> => {
    try {
      await fetch('/api/kv', { method: 'DELETE' });
    } catch {}
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      completions: {},
      assessments: [],
      labProjects: [],

      toggleCompletion: (key) =>
        set((s) => ({
          completions: {
            ...s.completions,
            [key]: !s.completions[key],
          },
        })),

      addAssessment: (data) =>
        set((s) => ({
          assessments: [
            ...s.assessments,
            {
              ...data,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateAssessment: (id, updates) =>
        set((s) => ({
          assessments: s.assessments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAssessment: (id) =>
        set((s) => ({
          assessments: s.assessments.filter((a) => a.id !== id),
        })),

      addLabProject: (data) =>
        set((s) => ({
          labProjects: [
            ...s.labProjects,
            {
              ...data,
              id: uid(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateLabProject: (id, updates) =>
        set((s) => ({
          labProjects: s.labProjects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteLabProject: (id) =>
        set((s) => ({
          labProjects: s.labProjects.filter((p) => p.id !== id),
        })),

      addMilestone: (projectId, m) =>
        set((s) => ({
          labProjects: s.labProjects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  milestones: [
                    ...p.milestones,
                    { ...m, id: uid() },
                  ],
                }
              : p
          ),
        })),

      toggleMilestone: (projectId, milestoneId) =>
        set((s) => ({
          labProjects: s.labProjects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  milestones: p.milestones.map((m) =>
                    m.id === milestoneId
                      ? { ...m, completed: !m.completed }
                      : m
                  ),
                }
              : p
          ),
        })),

      deleteMilestone: (projectId, milestoneId) =>
        set((s) => ({
          labProjects: s.labProjects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  milestones: p.milestones.filter(
                    (m) => m.id !== milestoneId
                  ),
                }
              : p
          ),
        })),

      hydrateFromKV: (data) =>
        set((s) => ({
          completions: { ...s.completions, ...data.completions },
          assessments:
            data.assessments && data.assessments.length > 0
              ? data.assessments
              : s.assessments,
          labProjects:
            data.labProjects && data.labProjects.length > 0
              ? data.labProjects
              : s.labProjects,
        })),

      toKVPayload: () => {
        const { completions, assessments, labProjects } = get();
        return { completions, assessments, labProjects };
      },
    }),
    {
      name: 'final-tracker-store',
      storage: createJSONStorage(() => kvStorage),
    }
  )
);
