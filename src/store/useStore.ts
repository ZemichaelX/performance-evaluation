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
    department: 'OD',
    email: 'alex@company.com',
    phone: '+251 911 234 567',
    status: 'active',
    employedOn: '2022-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'emp2',
    name: 'Jessica Chen',
    role: 'employee',
    department: 'RMS',
    email: 'jessica@company.com',
    phone: '+251 922 345 678',
    status: 'active',
    employedOn: '2021-07-22',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'emp3',
    name: 'Marcus Thorne',
    role: 'employee',
    department: 'KSP',
    email: 'marcus@company.com',
    phone: '+251 933 456 789',
    status: 'active',
    employedOn: '2023-01-10',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'emp4',
    name: 'Amara Okafor',
    role: 'employee',
    department: 'F&I',
    email: 'amara@company.com',
    phone: '+251 944 567 890',
    status: 'deactivated',
    employedOn: '2020-11-05',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'admin1',
    name: 'Sarah Connor',
    role: 'admin',
    department: 'OD',
    email: 'sarah@company.com',
    phone: '+251 955 678 901',
    status: 'active',
    employedOn: '2019-05-12',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'mgr1',
    name: 'Robert Miller',
    role: 'manager',
    department: 'RMS',
    email: 'robert@company.com',
    phone: '+251 966 789 012',
    status: 'active',
    employedOn: '2018-09-20',
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
  { id: 'kpi-1-1', objectiveId: 'obj-1', title: 'Review Gafat RFP', description: 'Technical appraisal of Stress Management RFP', weight: 12, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-1-2', objectiveId: 'obj-1', title: 'Technical Proposal - Gafat', description: 'Preparing technical response core', weight: 12, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-1-3', objectiveId: 'obj-1', title: 'Financial Proposal - BGI', description: 'Preparing financial modeling for BGI RFP', weight: 8, score: 85, target: 100, achieved: 85 },
  { id: 'kpi-1-4', objectiveId: 'obj-1', title: 'Corporate Alignment - LEAD', description: 'Refining corporate response for LEAD RFP', weight: 8, score: 85, target: 100, achieved: 85 },

  // Objective 2 (Total Weight: 40)
  { id: 'kpi-2-1', objectiveId: 'obj-2', title: 'Finalize performance report logbook', description: 'Bi-weekly validation of audit entries', weight: 10, score: 87, target: 100, achieved: 87 },
  { id: 'kpi-2-2', objectiveId: 'obj-2', title: 'Update the tracking sheet', description: 'Real-time sync of project milestones', weight: 10, score: 87, target: 100, achieved: 87 },
  { id: 'kpi-2-3', objectiveId: 'obj-2', title: 'Logistics Data Sanitization', description: 'Ensuring logbook record purity', weight: 10, score: 87, target: 100, achieved: 87 },
  { id: 'kpi-2-4', objectiveId: 'obj-2', title: 'Compliance Reporting', description: 'Final report generation logic', weight: 10, score: 87, target: 100, achieved: 87 },

  // Objective 3 (Total Weight: 20)
  { id: 'kpi-3-1', objectiveId: 'obj-3', title: 'Stress Management Training Framework', description: 'Drafting new training curricula', weight: 8, score: 86, target: 100, achieved: 86 },
  { id: 'kpi-3-2', objectiveId: 'obj-3', title: 'Proposal Refinement Loop', description: 'Iterative refinement of existing training bids', weight: 12, score: 86, target: 100, achieved: 86 }
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
    id: 'fw-behavioral',
    name: 'Behavioral Competency',
    description: 'Core behavioral expectations and organizational values',
    questions: [
      // 1.1 Thought Leadership
      { id: 'q-bl-1', category: '1.1 Thought Leadership', text: 'Regularly introduces new ideas and approaches, fostering an environment of innovation.' },
      { id: 'q-bl-2', category: '1.1 Thought Leadership', text: 'Demonstrates deep understanding of industry trends and anticipates future challenges/opportunities.' },
      { id: 'q-bl-3', category: '1.1 Thought Leadership', text: 'Inspires others through vision and expertise, influencing stakeholders and driving growth.' },
      { id: 'q-bl-4', category: '1.1 Thought Leadership', text: 'Willing to share knowledge, expertise, and tools to guide colleagues toward development.' },
      // 1.2 Professionalism
      { id: 'q-prof-1', category: '1.2 Professionalism', text: 'Consistently adheres to ethical standards and promotes integrity within the organization.' },
      { id: 'q-prof-2', category: '1.2 Professionalism', text: 'Takes responsibility for actions and decisions, ensuring transparency and reliability.' },
      { id: 'q-prof-3', category: '1.2 Professionalism', text: 'Maintains high standards of work quality and continuously seeks performance improvements.' },
      { id: 'q-prof-4', category: '1.2 Professionalism', text: 'Shows exemplary character by being punctual to work, meetings, and deadlines.' },
      { id: 'q-prof-5', category: '1.2 Professionalism', text: 'Makes effective use of organizational time and resources for the sole purpose of duties.' },
      // 1.3 Client Centricity
      { id: 'q-client-1', category: '1.3 Client Centricity', text: 'Prioritizes needs and expectations of clients, ensuring requirements are met or exceeded.' },
      { id: 'q-client-2', category: '1.3 Client Centricity', text: 'Contributes to building long-term relationships and providing tailored client solutions.' },
      { id: 'q-client-3', category: '1.3 Client Centricity', text: 'Demonstrates commitment to outstanding service, proactively addressing client feedback.' },
      // 1.4 Results Orientation
      { id: 'q-res-1', category: '1.4 Results Orientation', text: 'Sets clear, measurable goals and consistently works towards achieving them.' },
      { id: 'q-res-2', category: '1.4 Results Orientation', text: 'Implements PMS and regularly assesses performance using logbook data for decisions.' },
      { id: 'q-res-3', category: '1.4 Results Orientation', text: 'Demonstrates determination and resilience in the face of challenges to meet objectives.' },
      { id: 'q-res-4', category: '1.4 Results Orientation', text: 'Prioritizes organizational interests and goals over personal interests.' },
      // 1.5 Connectedness
      { id: 'q-conn-1', category: '1.5 Connectedness', text: 'Actively seeks and values input from others, promoting teamwork and cooperation.' },
      { id: 'q-conn-2', category: '1.5 Connectedness', text: 'Establishes and maintains a wide network of contacts inside and outside for mutual benefit.' },
      { id: 'q-conn-3', category: '1.5 Connectedness', text: 'Communicates effectively across all levels, ensuring clarity and understanding.' },
      { id: 'q-conn-4', category: '1.5 Connectedness', text: 'Respects supervisors and peers, shows interest in connecting with others.' },
      { id: 'q-conn-5', category: '1.5 Connectedness', text: 'Spreads positive energy by avoiding office politics and discouraging statements.' },
      // 1.6 Disruption
      { id: 'q-dis-1', category: '1.6 Disruption', text: 'Adapts quickly to change, avoids resistance, and continuously challenges the status quo.' },
      { id: 'q-dis-2', category: '1.6 Disruption', text: 'Seeks opportunities to improve processes, questioning methods and proposing alternatives.' },
      { id: 'q-dis-3', category: '1.6 Disruption', text: 'Takes calculated risks to drive progress, learning from both successes and failures.' },
      { id: 'q-dis-4', category: '1.6 Disruption', text: 'Has the ability to continually learn, unlearn, and relearn.' }
    ]
  },
  {
    id: 'fw-technical',
    name: 'Technical Competency',
    description: 'Departmental and domain-specific technical skills',
    questions: [
      // 2.1 Plan
      { id: 'q-plan-1', category: '2.1 Plan', text: 'Lead the preparation of operations unit strategic and operational plan.' },
      { id: 'q-plan-2', category: '2.1 Plan', text: 'Lead the preparation of operations unit annual budget.' },
      { id: 'q-plan-3', category: '2.1 Plan', text: 'Ensure timely and robust reports about advisory, learning, and knowledge solutions.' },
      // 2.2 Design
      { id: 'q-des-1', category: '2.2 Design', text: 'Lead the design of in-house customized methods, tools, and frameworks for projects.' },
      { id: 'q-des-2', category: '2.2 Design', text: 'Stay up-to-date with industry trends and best practices related to unit solutions.' },
      { id: 'q-des-3', category: '2.2 Design', text: 'Continuously refine and develop methods in line with industry/business priorities.' },
      // 2.3 Deliver
      { id: 'q-del-1', category: '2.3 Deliver', text: 'Lead the execution of activities involved in the delivery of operations solutions.' },
      // 2.4 Review
      { id: 'q-rev-1', category: '2.4 Review', text: 'Lead the measurement of effectiveness and impact on performance indicators.' },
      { id: 'q-rev-2', category: '2.4 Review', text: 'Evaluate unit performance and recommend strategic improvements to CEO.' },
      // 2.5 Lead
      { id: 'q-lead-1', category: '2.5 Lead', text: 'Assign and lead teams across needs assessment, instructional design, and delivery.' },
      { id: 'q-lead-2', category: '2.5 Lead', text: 'Develop capacity of line managers through continuous coaching and mentorship.' },
      // 2.6 Collaborate
      { id: 'q-coll-1', category: '2.6 Collaborate', text: 'Lead collaboration with clients to identify needs and develop aligned solutions.' },
      { id: 'q-coll-2', category: '2.6 Collaborate', text: 'Collaborate with Marketing/Sales to prepare proposals and pitching documents.' },
      { id: 'q-coll-3', category: '2.6 Collaborate', text: 'Identify and manage relationship with a sufficient pool of delivery partners.' }
    ]
  },
  {
    id: 'fw-leadership',
    name: 'Leadership Competency',
    description: 'Strategic leadership and people management protocols',
    questions: [
      // 3.1 Leading the Organization
      { id: 'q-lorg-1', category: '3.1 Leading the Organization', text: 'Social Intelligence: knows when to talk/listen, what to say, and when to say it.' },
      { id: 'q-lorg-2', category: '3.1 Leading the Organization', text: 'Problem-solving: able to use knowledge and experience to analyze problems.' },
      { id: 'q-lorg-3', category: '3.1 Leading the Organization', text: 'Decision-making: knows when to consult team vs. peers vs. deciding independently.' },
      { id: 'q-lorg-4', category: '3.1 Leading the Organization', text: 'Setting Vision: able to inspire others to translate vision into positive action.' },
      { id: 'q-lorg-5', category: '3.1 Leading the Organization', text: 'Change Management: able to prepare and guide teams through organizational change.' },
      { id: 'q-lorg-6', category: '3.1 Leading the Organization', text: 'Innovation: encourages subordinates to be creative and views failure as a precursor to success.' },
      // 3.2 Leading Others
      { id: 'q-loth-1', category: '3.2 Leading Others', text: 'Conflict Management: able to reduce and manage conflict for stronger performance.' },
      { id: 'q-loth-2', category: '3.2 Leading Others', text: 'Interpersonal Skills: treats people with respect, active listening, and giving feedback.' },
      { id: 'q-loth-3', category: '3.2 Leading Others', text: 'Emotional Intelligence: understands and manages own and others’ emotional situations.' },
      { id: 'q-loth-4', category: '3.2 Leading Others', text: 'Coaching Ability: effective coach and mentor for team members and peers.' },
      { id: 'q-loth-5', category: '3.2 Leading Others', text: 'Inclusivity: creates an environment where everyone feels welcome and treated equally.' },
      { id: 'q-loth-6', category: '3.2 Leading Others', text: 'People Management: oversees training, motivation, and day-to-day management.' }
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
      scores: [{ questionId: 'q-bl-1', score: 4 }, { questionId: 'q-bl-2', score: 5 }, { questionId: 'q-prof-1', score: 4 }]
    },
    {
      id: 'sub-sup1',
      evaluatorId: 'admin1',
      evaluateeId: 'emp1',
      cycleId: 'cycle-2025-annual',
      type: 'supervisor',
      status: 'submitted',
      submittedAt: '2025-12-26T09:00:00Z',
      scores: [{ questionId: 'q-bl-1', score: 5 }, { questionId: 'q-bl-2', score: 4 }, { questionId: 'q-prof-1', score: 4 }]
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
