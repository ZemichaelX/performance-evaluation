import { create } from 'zustand';
import type { User, Objective, KPI, EvaluationCycle, EvaluationSubmission, CompetencyFramework } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  cycles: EvaluationCycle[];
  objectives: Objective[];
  kpis: KPI[];
  submissions: EvaluationSubmission[];
  competencyFrameworks: CompetencyFramework[];
  
  // Actions
  login: (email: string) => void;
  logout: () => void;
  submitEvaluation: (submission: EvaluationSubmission) => void;
  createCycle: (cycle: EvaluationCycle) => void;
  addCompetencyFramework: (framework: CompetencyFramework) => void;
  getEmployeeObjectives: (userId: string, cycleId: string) => Objective[];
  getObjectKPIs: (objectiveId: string) => KPI[];
  getEmployeeSubmissions: (userId: string, cycleId: string) => EvaluationSubmission[];
  deployEvaluationCycle: (cycle: EvaluationCycle, assignments: Record<string, { peerIds: string[], supervisorIds: string[] }>) => void;
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

const MOCK_OBJECTIVES: Objective[] = [
  // Own Objectives for emp1
  { id: 'obj-1', userId: 'emp1', cycleId: 'cycle-2025-annual', title: 'System Architecture Optimization', description: 'Enhance core infrastructure performance', weight: 40, type: 'own' },
  { id: 'obj-2', userId: 'emp1', cycleId: 'cycle-2025-annual', title: 'Product Integration & API', description: 'Streamline third-party connections', weight: 30, type: 'own' },
  { id: 'obj-3', userId: 'emp1', cycleId: 'cycle-2025-annual', title: 'Security & Compliance', description: 'Ensure SOC2 readiness', weight: 20, type: 'own' },
  { id: 'obj-4', userId: 'emp1', cycleId: 'cycle-2025-annual', title: 'Mentorship & Culture', description: 'Dev-team growth and leadership', weight: 10, type: 'own' }
];

const MOCK_KPIS: KPI[] = [
  // KPIs for Objective 1 (Total weight must be 100)
  { id: 'kpi-1-1', objectiveId: 'obj-1', title: 'Latency Reduction', description: 'Reduce avg latency by 25%', weight: 30, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-1-2', objectiveId: 'obj-1', title: 'Uptime Maintenance', description: 'Achieve 99.99% availability', weight: 25, score: 95, target: 100, achieved: 95 },
  { id: 'kpi-1-3', objectiveId: 'obj-1', title: 'Query Optimization', description: 'Reduce expensive query counts', weight: 15, score: 70, target: 100, achieved: 70 },
  { id: 'kpi-1-4', objectiveId: 'obj-1', title: 'Cache Implementation', description: 'Increase cache hit ratio', weight: 20, score: 88, target: 100, achieved: 88 },
  { id: 'kpi-1-5', objectiveId: 'obj-1', title: 'Load Balancing', description: 'Even traffic distribution', weight: 10, score: 90, target: 100, achieved: 90 },

  // KPIs for Objective 2
  { id: 'kpi-2-1', objectiveId: 'obj-2', title: 'API Version Migration', description: 'Move to v3 schema', weight: 30, score: 60, target: 100, achieved: 60 },
  { id: 'kpi-2-2', objectiveId: 'obj-2', title: 'Partner Integration', description: 'Onboard 5 new partners', weight: 25, score: 80, target: 100, achieved: 80 },
  { id: 'kpi-2-3', objectiveId: 'obj-2', title: 'Token Auth Revamp', description: 'Secure JWT rotation', weight: 25, score: 100, target: 100, achieved: 100 },
  { id: 'kpi-2-4', objectiveId: 'obj-2', title: 'Webhooks Stability', description: 'Zero dropped events', weight: 20, score: 75, target: 100, achieved: 75 },

  // KPIs for Objective 3
  { id: 'kpi-3-1', objectiveId: 'obj-3', title: 'Encryption at Rest', description: 'All DB volumes encrypted', weight: 40, score: 100, target: 100, achieved: 100 },
  { id: 'kpi-3-2', objectiveId: 'obj-3', title: 'Security Audits', description: 'Finish quarterly scans', weight: 20, score: 90, target: 100, achieved: 90 },
  { id: 'kpi-3-3', objectiveId: 'obj-3', title: 'IAM Policy Review', description: 'Principle of least privilege', weight: 20, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-3-4', objectiveId: 'obj-3', title: 'Phishing Training', description: '95% completion rate', weight: 20, score: 100, target: 100, achieved: 100 },

  // KPIs for Objective 4
  { id: 'kpi-4-1', objectiveId: 'obj-4', title: 'Junior Dev Mentorship', description: '2 hours weekly per dev', weight: 50, score: 100, target: 100, achieved: 100 },
  { id: 'kpi-4-2', objectiveId: 'obj-4', title: 'Internal Workshops', description: 'Lead 2 sessions per quarter', weight: 30, score: 66, target: 100, achieved: 66 },
  { id: 'kpi-4-3', objectiveId: 'obj-4', title: 'Culture Surveys', description: 'Lead eNPS feedback loop', weight: 20, score: 90, target: 100, achieved: 90 }
];

const MOCK_CYCLES: EvaluationCycle[] = [
  {
    id: 'cycle-2025-annual',
    title: 'Annual Performance Review 2025',
    startDate: '2025-07-08',
    endDate: '2026-06-07',
    type: 'annual',
    status: 'active',
    weights: { own: 55, shared: 45 },
    competencies: { behavioral: true, technical: true, leadership: false },
    customCompetencyFrameworkIds: ['cf-1']
  },
  {
    id: 'cycle-2024-annual',
    title: 'Annual Performance Review 2024',
    startDate: '2024-07-08',
    endDate: '2025-06-07',
    type: 'annual',
    status: 'completed',
    weights: { own: 50, shared: 50 },
    competencies: { behavioral: true, technical: true, leadership: false }
  }
];

const MOCK_FRAMEWORKS: CompetencyFramework[] = [
  {
    id: 'cf-1',
    name: 'Strategic Thinking',
    description: 'Ability to align decisions with long-term company goals',
    questions: [
      { id: 'q-s1', category: 'Strategic', text: 'Does the employee focus on high-impact tasks?' },
      { id: 'q-s2', category: 'Strategic', text: 'Ability to anticipate future bottlenecks.' }
    ]
  }
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: MOCK_USERS,
  cycles: MOCK_CYCLES,
  objectives: MOCK_OBJECTIVES,
  kpis: MOCK_KPIS,
  submissions: [
    {
      id: 'sub-peer1',
      evaluatorId: 'emp2',
      evaluateeId: 'emp1',
      cycleId: 'cycle-2025-annual',
      type: 'peer',
      status: 'submitted',
      submittedAt: '2025-12-25T10:00:00Z',
      scores: [{ questionId: 'q1', score: 4 }, { questionId: 'q2', score: 5 }, { questionId: 'q3', score: 4 }]
    },
    {
      id: 'sub-sup1',
      evaluatorId: 'admin1',
      evaluateeId: 'emp1',
      cycleId: 'cycle-2025-annual',
      type: 'supervisor',
      status: 'submitted',
      submittedAt: '2025-12-26T09:00:00Z',
      scores: [{ questionId: 'q1', score: 5 }, { questionId: 'q2', score: 4 }, { questionId: 'q3', score: 5 }]
    }
  ],
  competencyFrameworks: MOCK_FRAMEWORKS,

  login: (email: string) => {
    const user = get().users.find(u => u.email === email);
    if (user) set({ currentUser: user });
  },

  logout: () => set({ currentUser: null }),

  submitEvaluation: (submission: EvaluationSubmission) => {
    set((state) => ({
      submissions: [...state.submissions, { ...submission, submittedAt: new Date().toISOString() }]
    }));
  },

  createCycle: (cycle: EvaluationCycle) => {
    set((state) => ({
      cycles: [...state.cycles, cycle]
    }));
  },

  addCompetencyFramework: (framework: CompetencyFramework) => {
    set((state) => ({
      competencyFrameworks: [...state.competencyFrameworks, framework]
    }));
  },

  getEmployeeObjectives: (userId: string, cycleId: string) => {
    return get().objectives.filter(o => o.userId === userId && o.cycleId === cycleId);
  },

  getObjectKPIs: (objectiveId: string) => {
    return get().kpis.filter(k => k.objectiveId === objectiveId);
  },

  getEmployeeSubmissions: (userId: string, cycleId: string) => {
    return get().submissions.filter(s => s.evaluateeId === userId && s.cycleId === cycleId);
  },

  deployEvaluationCycle: (cycle, assignments) => {
    const newSubmissions: EvaluationSubmission[] = [];
    
    Object.entries(assignments).forEach(([evaluateeId, { peerIds, supervisorIds }]) => {
      // 1. Self Evaluation
      newSubmissions.push({
        id: `sub-self-${Date.now()}-${evaluateeId}`,
        evaluatorId: evaluateeId,
        evaluateeId,
        cycleId: cycle.id,
        type: 'self',
        status: 'pending',
        scores: []
      });

      // 2. Peer Evaluations
      peerIds.forEach(peerId => {
        newSubmissions.push({
          id: `sub-peer-${Date.now()}-${evaluateeId}-${peerId}`,
          evaluatorId: peerId,
          evaluateeId,
          cycleId: cycle.id,
          type: 'peer',
          status: 'pending',
          scores: []
        });
      });

      // 3. Supervisor Evaluations
      supervisorIds.forEach(supId => {
        newSubmissions.push({
          id: `sub-sup-${Date.now()}-${evaluateeId}-${supId}`,
          evaluatorId: supId,
          evaluateeId,
          cycleId: cycle.id,
          type: 'supervisor',
          status: 'pending',
          scores: []
        });
      });
    });

    set((state) => ({
      cycles: [...state.cycles, cycle],
      submissions: [...state.submissions, ...newSubmissions]
    }));
  }
}));
