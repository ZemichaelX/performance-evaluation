import { create } from 'zustand';
import { User, KPI, EvaluationCycle, EvaluationSubmission } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  cycles: EvaluationCycle[];
  kpis: Record<string, KPI[]>; // UserId -> KPIs
  submissions: EvaluationSubmission[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  submitEvaluation: (submission: EvaluationSubmission) => void;
  createCycle: (cycle: EvaluationCycle) => void;
  getEmployeeKPIs: (userId: string) => KPI[];
  getEmployeeSubmissions: (userId: string, cycleId: string) => EvaluationSubmission[];
}

// MOCK DATA
const MOCK_USERS: User[] = [
  {
    id: 'emp1',
    name: 'Alex Johnson',
    role: 'employee',
    department: 'Engineering',
    email: 'alex@company.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'admin1',
    name: 'Sarah Connor',
    role: 'admin',
    department: 'HR',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const MOCK_KPIS: Record<string, KPI[]> = {
  'emp1': [
    {
      id: 'kpi1',
      title: 'Reduce API Latency',
      description: 'Decrease average endpoint response time by 20%',
      type: 'own',
      weight: 30, // Part of the 55% Own
      score: 85,
      target: 20,
      achieved: 18
    },
    {
      id: 'kpi2',
      title: 'Complete Cloud Migration',
      description: 'Migrate legacy services to AWS',
      type: 'own',
      weight: 25, // Part of the 55% Own (Total Own = 55)
      score: 92,
      target: 100,
      achieved: 95
    },
    {
      id: 'kpi3',
      title: 'Company Revenue Growth',
      description: 'Achieve 15% YoY revenue increase',
      type: 'shared',
      department: 'Sales & Marketing',
      weight: 20, // Part of 45% Shared
      score: 75,
      target: 15,
      achieved: 11
    },
    {
      id: 'kpi4',
      title: 'Employee Satisfaction',
      description: 'Maintain eNPS above 40',
      type: 'shared',
      department: 'HR & OD',
      weight: 25, // Part of 45% Shared (Total Shared = 45)
      score: 88,
      target: 40,
      achieved: 42
    }
  ]
};

const MOCK_CYCLES: EvaluationCycle[] = [
  {
    id: 'cycle-2025-annual',
    title: 'Annual Performance Review 2025',
    startDate: '2025-07-08',
    endDate: '2026-07-07',
    type: 'annual',
    status: 'active',
    weights: { own: 55, shared: 45 },
    competencies: { behavioral: true, technical: true, leadership: false }
  }
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null, // Start logged out
  users: MOCK_USERS,
  cycles: MOCK_CYCLES,
  kpis: MOCK_KPIS,
  submissions: [],

  login: (email) => {
    const user = get().users.find(u => u.email === email);
    if (user) set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  submitEvaluation: (submission) => {
    set((state) => ({
      submissions: [...state.submissions, { ...submission, submittedAt: new Date().toISOString() }]
    }));
  },

  createCycle: (cycle) => {
    set((state) => ({
      cycles: [...state.cycles, cycle]
    }));
  },

  getEmployeeKPIs: (userId) => {
    return get().kpis[userId] || [];
  },

  getEmployeeSubmissions: (userId, cycleId) => {
    return get().submissions.filter(s => s.evaluateeId === userId && s.cycleId === cycleId);
  }
}));
