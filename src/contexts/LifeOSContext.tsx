import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CalendarEvent, Goal, Project, Skill, Expense, Subscription } from '@/types';
import { generateSampleData } from '@/data/sampleData';
import { genId } from '@/lib/helpers';

interface LifeOSContextType {
  events: CalendarEvent[];
  goals: Goal[];
  projects: Project[];
  skills: Skill[];
  expenses: Expense[];
  subscriptions: Subscription[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, text: string) => void;
  deleteProjectTask: (projectId: string, taskId: string) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  addSubscription: (sub: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
}

const LifeOSContext = createContext<LifeOSContextType | null>(null);

export const useLifeOS = () => {
  const ctx = useContext(LifeOSContext);
  if (!ctx) throw new Error('useLifeOS must be used within LifeOSProvider');
  return ctx;
};

function load<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(`lifeos_${key}`);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

function save(key: string, val: unknown) {
  localStorage.setItem(`lifeos_${key}`, JSON.stringify(val));
}

export const LifeOSProvider = ({ children }: { children: ReactNode }) => {
  const sample = generateSampleData();
  const [events, setEvents] = useState<CalendarEvent[]>(() => load('events', sample.events));
  const [goals, setGoals] = useState<Goal[]>(() => load('goals', sample.goals));
  const [projects, setProjects] = useState<Project[]>(() => load('projects', sample.projects));
  const [skills, setSkills] = useState<Skill[]>(() => load('skills', sample.skills));
  const [expenses, setExpenses] = useState<Expense[]>(() => load('expenses', sample.expenses));
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(() => load('subscriptions', sample.subscriptions));

  useEffect(() => { save('events', events); }, [events]);
  useEffect(() => { save('goals', goals); }, [goals]);
  useEffect(() => { save('projects', projects); }, [projects]);
  useEffect(() => { save('skills', skills); }, [skills]);
  useEffect(() => { save('expenses', expenses); }, [expenses]);
  useEffect(() => { save('subscriptions', subscriptions); }, [subscriptions]);

  const now = () => new Date().toISOString();

  // Events
  const addEvent = useCallback((e: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    setEvents(p => [...p, { ...e, id: genId(), createdAt: now(), updatedAt: now() }]);
  }, []);
  const updateEvent = useCallback((id: string, u: Partial<CalendarEvent>) => {
    setEvents(p => p.map(e => e.id === id ? { ...e, ...u, updatedAt: now() } : e));
  }, []);
  const deleteEvent = useCallback((id: string) => {
    setEvents(p => p.filter(e => e.id !== id));
  }, []);

  // Goals
  const addGoal = useCallback((g: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    setGoals(p => [...p, { ...g, id: genId(), createdAt: now(), updatedAt: now() }]);
  }, []);
  const updateGoal = useCallback((id: string, u: Partial<Goal>) => {
    setGoals(p => p.map(g => g.id === id ? { ...g, ...u, updatedAt: now() } : g));
  }, []);
  const deleteGoal = useCallback((id: string) => {
    setGoals(p => p.filter(g => g.id !== id));
  }, []);

  // Projects
  const addProject = useCallback((pr: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setProjects(p => [...p, { ...pr, id: genId(), createdAt: now(), updatedAt: now() }]);
  }, []);
  const updateProject = useCallback((id: string, u: Partial<Project>) => {
    setProjects(p => p.map(pr => pr.id === id ? { ...pr, ...u, updatedAt: now() } : pr));
  }, []);
  const deleteProject = useCallback((id: string) => {
    setProjects(p => p.filter(pr => pr.id !== id));
  }, []);

  const toggleProjectTask = useCallback((projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const tasks = p.tasks.map(t =>
        t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? now() : undefined } : t
      );
      const completion = tasks.length > 0 ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;
      const newProject = { ...p, tasks, completion, updatedAt: now() };
      return newProject;
    }));
  }, []);

  const addProjectTask = useCallback((projectId: string, text: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const tasks = [...p.tasks, { id: genId(), text, completed: false }];
      const completion = Math.round(tasks.filter(t => t.completed).length / tasks.length * 100);
      return { ...p, tasks, completion, updatedAt: now() };
    }));
  }, []);

  const deleteProjectTask = useCallback((projectId: string, taskId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const tasks = p.tasks.filter(t => t.id !== taskId);
      const completion = tasks.length > 0 ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;
      return { ...p, tasks, completion, updatedAt: now() };
    }));
  }, []);

  // Skills
  const addSkill = useCallback((s: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSkills(p => [...p, { ...s, id: genId(), createdAt: now(), updatedAt: now() }]);
  }, []);
  const updateSkill = useCallback((id: string, u: Partial<Skill>) => {
    setSkills(p => p.map(s => s.id === id ? { ...s, ...u, updatedAt: now() } : s));
  }, []);
  const deleteSkill = useCallback((id: string) => {
    setSkills(p => p.filter(s => s.id !== id));
  }, []);

  // Expenses
  const addExpense = useCallback((e: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses(p => [...p, { ...e, id: genId(), createdAt: now() }]);
  }, []);
  const updateExpense = useCallback((id: string, u: Partial<Expense>) => {
    setExpenses(p => p.map(e => e.id === id ? { ...e, ...u } : e));
  }, []);
  const deleteExpense = useCallback((id: string) => {
    setExpenses(p => p.filter(e => e.id !== id));
  }, []);

  // Subscriptions
  const addSubscription = useCallback((s: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    setSubscriptions(p => [...p, { ...s, id: genId(), createdAt: now(), updatedAt: now() }]);
  }, []);
  const updateSubscription = useCallback((id: string, u: Partial<Subscription>) => {
    setSubscriptions(p => p.map(s => s.id === id ? { ...s, ...u, updatedAt: now() } : s));
  }, []);
  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions(p => p.filter(s => s.id !== id));
  }, []);

  return (
    <LifeOSContext.Provider value={{
      events, goals, projects, skills, expenses, subscriptions,
      addEvent, updateEvent, deleteEvent,
      addGoal, updateGoal, deleteGoal,
      addProject, updateProject, deleteProject, toggleProjectTask, addProjectTask, deleteProjectTask,
      addSkill, updateSkill, deleteSkill,
      addExpense, updateExpense, deleteExpense,
      addSubscription, updateSubscription, deleteSubscription,
    }}>
      {children}
    </LifeOSContext.Provider>
  );
};
