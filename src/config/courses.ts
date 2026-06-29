export type CourseId = 'dip' | 'cg' | 'da' | 'cc';

export interface Course {
  id: CourseId;
  shortName: string;
  fullName: string;
  theoryCode: string;
  labCode?: string;
  hasLab: boolean;
  color: string;
  tailwindColor: string;
}

export const COURSES: Record<CourseId, Course> = {
  dip: {
    id: 'dip',
    shortName: 'DIP',
    fullName: 'Digital Image Processing',
    theoryCode: '4227',
    labCode: '4228',
    hasLab: true,
    color: '#a855f7',
    tailwindColor: 'purple',
  },
  cg: {
    id: 'cg',
    shortName: 'CG',
    fullName: 'Computer Graphics',
    theoryCode: '4203',
    labCode: '4204',
    hasLab: true,
    color: '#3b82f6',
    tailwindColor: 'blue',
  },
  da: {
    id: 'da',
    shortName: 'DA',
    fullName: 'Data Analytics',
    theoryCode: '4261',
    labCode: '4262',
    hasLab: true,
    color: '#ec4899',
    tailwindColor: 'pink',
  },
  cc: {
    id: 'cc',
    shortName: 'CC',
    fullName: 'Cloud Computing',
    theoryCode: '4267',
    hasLab: false,
    color: '#f59e0b',
    tailwindColor: 'amber',
  },
};

export const COURSE_LIST = Object.values(COURSES);
export const LAB_COURSES = COURSE_LIST.filter((c) => c.hasLab);
