export type TimePeriod = 'morning' | 'afternoon' | 'evening' | 'night';

export type EventType = 'Deep Work' | 'Learning' | 'Personal' | 'Health' | 'Meeting' | 'Bills' | 'Other';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  type: EventType;
  linkedSkill?: string;
  linkedProject?: string;
  notes?: string;
  checklist: ChecklistItem[];
  completed: boolean;
  color?: string;
  isSubscriptionEvent?: boolean;
  linkedSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  deadline: string;
  linkedProjects: string[];
  progress: number;
  status: 'active' | 'completed' | 'overdue';
  colorTag: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Planning' | 'Active' | 'Paused' | 'Completed';
  completion: number;
  linkedSkills: string[];
  linkedGoals: string[];
  tasks: ProjectTask[];
  notes?: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  focusHours: number;
  projectsApplied: string[];
  lastUsed: string;
  workTypes: string[];
  color: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Shopping'
  | 'Bills & Utilities'
  | 'Health & Fitness'
  | 'Entertainment'
  | 'Education'
  | 'Travel'
  | 'Home'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  serviceName: string;
  cost: number;
  billingCycle: 'Monthly' | 'Yearly' | 'Quarterly';
  nextRenewal: string;
  paymentMethod: string;
  category: string;
  notes?: string;
  active: boolean;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}
