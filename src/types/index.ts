export type Role = 'admin' | 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  role: Role;
  department: string;
  avatar: string;
  email: string;
  phone?: string;
  status?: 'active' | 'deactivated';
  employedOn?: string;
}

export interface Objective {
  id: string;
  userId: string;
  cycleId: string;
  title: string;
  description: string;
  weight: number; // Weight within its category (e.g., 25% of "Own" weight)
  type: 'own' | 'shared';
  division?: string; // e.g. "OD", "RMS", "F&I"
}

export interface KPI {
  id: string;
  objectiveId: string;
  title: string;
  description: string;
  weight: number; // Weight within the objective (Total KPIs in objective = 100%)
  score: number; // 0-100 (The "result" mentioned by user)
  target: number;
  achieved: number;
}

export interface CompetencyQuestion {
  id: string;
  text: string;
}

export interface CompetencyFramework {
  id: string;
  name: string;
  description: string;
  questions: CompetencyQuestion[];
}

export interface CompetencyScore {
  questionId: string;
  score: number; // 1-5
}

export interface SharedContributor {
  id: string;
  name: string;  // Department, division, or employee name
  type: 'department' | 'division' | 'employee';
  percentage: number;  // Contribution to SHARED performance
  entityId?: string;  // Optional: reference to actual entity
}

export interface PerformanceConfiguration {
  ownPercentage: number;  // e.g., 55
  sharedPercentage: number;  // e.g., 45
  // Division breakdown within SHARED (e.g., "OD": 20, "RMS": 10, "F&I": 10)
  divisionWeights: {
    [divisionName: string]: number;
  };
  locked: boolean;  // Lock after evaluation launch
}

export interface EvaluationSubmission {
  id: string;
  evaluatorId: string;
  evaluateeId: string;
  cycleId: string;
  type: 'self' | 'peer' | 'supervisor' | 'subordinate';
  status: 'pending' | 'submitted';
  submittedAt?: string;
  scores: CompetencyScore[];
  formId?: string; // Differentiates forms for peer vs supervisor
  improvementAreas?: string;
  nextGoals?: string;
  employeeComments?: string;
  signatures?: {
    employee?: string;
    supervisor?: string;
    ceo?: string;
    date?: string;
  };
}

export interface EvaluationCycle {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  type: 'annual' | 'semi-annual';
  status: 'active' | 'completed' | 'upcoming';
  weights: {
    own: number;
    shared: number;
  };
  competencies: {
    behavioral: boolean;
    technical: boolean;
    leadership: boolean;
  };
  customCompetencyFrameworkIds?: string[];
  performanceConfig?: PerformanceConfiguration;
}
