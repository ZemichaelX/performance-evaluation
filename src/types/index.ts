export type Role = 'admin' | 'employee' | 'manager';

export interface User {
  id: string;
  name: string;
  role: Role;
  department: string;
  avatar: string;
  email: string;
}

export interface KPI {
  id: string;
  title: string;
  description: string;
  type: 'own' | 'shared';
  weight: number;
  score: number; // 0-100
  target: number;
  achieved: number;
  department?: string; // For shared KPIs
}

export interface CompetencyQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'leadership';
  text: string;
}

export interface CompetencyScore {
  questionId: string;
  score: number; // 1-5
}

export interface EvaluationSubmission {
  id: string;
  evaluatorId: string;
  evaluateeId: string;
  cycleId: string;
  type: 'self' | 'peer' | 'supervisor';
  status: 'pending' | 'submitted';
  submittedAt?: string;
  scores: CompetencyScore[];
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
}
