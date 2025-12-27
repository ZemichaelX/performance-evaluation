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
    id: 'emp2',
    name: 'Jessica Chen',
    role: 'employee',
    department: 'Engineering',
    email: 'jessica@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'emp3',
    name: 'Marcus Thorne',
    role: 'employee',
    department: 'Design',
    email: 'marcus@company.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'emp4',
    name: 'Amara Okafor',
    role: 'employee',
    department: 'Design',
    email: 'amara@company.com',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'admin1',
    name: 'Sarah Connor',
    role: 'admin',
    department: 'HR',
    email: 'sarah@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'mgr1',
    name: 'Robert Miller',
    role: 'manager',
    department: 'Engineering',
    email: 'robert@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const MOCK_OBJECTIVES: Objective[] = [
  { 
    id: 'obj-1', 
    userId: 'emp1', 
    cycleId: 'cycle-2025-annual', 
    title: 'Strategic Bid Management & RFP Orchestration', 
    description: 'High-stakes lifecycle management for Stress Management training proposals (Gafat & BGI).', 
    weight: 40, 
    type: 'own' 
  },
  { 
    id: 'obj-2', 
    userId: 'emp1', 
    cycleId: 'cycle-2025-annual', 
    title: 'Operational Analytics & Performance Logs', 
    description: 'Data integrity maintenance via performance report logbooks and tracking sheet telemetry.', 
    weight: 40, 
    type: 'own' 
  },
  { 
    id: 'obj-3', 
    userId: 'emp1', 
    cycleId: 'cycle-2025-annual', 
    title: 'Training Frameworks & Corporate Alignment', 
    description: 'Preparing and refining technical responses for Stress Management Training protocols.', 
    weight: 20, 
    type: 'own' 
  }
];

const MOCK_KPIS: KPI[] = [
  // Objective 1 (Total Weight: 40)
  { id: 'kpi-1-1', objectiveId: 'obj-1', title: 'Review Gafat RFP', description: 'Technical appraisal of Stress Management RFP', weight: 10, score: 84, target: 100, achieved: 84 },
  { id: 'kpi-1-2', objectiveId: 'obj-1', title: 'Technical Proposal - Gafat', description: 'Preparing technical response core', weight: 10, score: 88, target: 100, achieved: 88 },
  { id: 'kpi-1-3', objectiveId: 'obj-1', title: 'Financial Proposal - BGI', description: 'Preparing financial modeling for BGI RFP', weight: 10, score: 82, target: 100, achieved: 82 },
  { id: 'kpi-1-4', objectiveId: 'obj-1', title: 'Corporate Alignment - LEAD', description: 'Refining corporate response for LEAD RFP', weight: 10, score: 90, target: 100, achieved: 90 },

  // Objective 2 (Total Weight: 40)
  { id: 'kpi-2-1', objectiveId: 'obj-2', title: 'Finalize performance report logbook', description: 'Bi-weekly validation of audit entries', weight: 10, score: 86, target: 100, achieved: 86 },
  { id: 'kpi-2-2', objectiveId: 'obj-2', title: 'Update the tracking sheet', description: 'Real-time sync of project milestones', weight: 10, score: 86, target: 100, achieved: 86 },
  { id: 'kpi-2-3', objectiveId: 'obj-2', title: 'Logistics Data Sanitization', description: 'Ensuring logbook record purity', weight: 10, score: 86, target: 100, achieved: 86 },
  { id: 'kpi-2-4', objectiveId: 'obj-2', title: 'Compliance Reporting', description: 'Final report generation logic', weight: 10, score: 86, target: 100, achieved: 86 },

  // Objective 3 (Total Weight: 20)
  { id: 'kpi-3-1', objectiveId: 'obj-3', title: 'Stress Management Training Framework', description: 'Drafting new training curricula', weight: 10, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-3-2', objectiveId: 'obj-3', title: 'Proposal Refinement Loop', description: 'Iterative refinement of existing training bids', weight: 10, score: 87, target: 100, achieved: 87 }
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
      scores: [{ questionId: 'q-s1', score: 4 }, { questionId: 'q-s2', score: 5 }, { questionId: 'q-s1', score: 4 }]
    },
    {
      id: 'sub-sup1',
      evaluatorId: 'admin1',
      evaluateeId: 'emp1',
      cycleId: 'cycle-2025-annual',
      type: 'supervisor',
      status: 'submitted',
      submittedAt: '2025-12-26T09:00:00Z',
      scores: [{ questionId: 'q-s1', score: 5 }, { questionId: 'q-s2', score: 4 }, { questionId: 'q-s1', score: 4 }]
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
