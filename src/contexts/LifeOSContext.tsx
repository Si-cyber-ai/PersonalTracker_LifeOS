import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CalendarEvent, Goal, Project, Skill, Expense, Subscription } from '@/types';
import { generateSampleData } from '@/data/sampleData';
import { genId } from '@/lib/helpers';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

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

// Transform data between app format and DB format
function transformToDB(data: any, userId: string): any {
  const transformed: any = {};
  Object.keys(data).forEach(key => {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    transformed[snakeKey] = data[key];
  });
  if (userId) transformed.user_id = userId;
  return transformed;
}

function transformFromDB(data: any): any {
  const transformed: any = {};
  Object.keys(data).forEach(key => {
    if (key === 'user_id') return;
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    transformed[camelKey] = data[key];
  });
  return transformed;
}

export const LifeOSProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const sample = generateSampleData();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from Supabase
  useEffect(() => {
    if (!user) {
      // Use sample data when not logged in
      setEvents(sample.events);
      setGoals(sample.goals);
      setProjects(sample.projects);
      setSkills(sample.skills);
      setExpenses(sample.expenses);
      setSubscriptions(sample.subscriptions);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [eventsRes, goalsRes, projectsRes, skillsRes, expensesRes, subsRes] = await Promise.all([
          supabase.from('events').select('*').eq('user_id', user.id).order('start_time', { ascending: false }),
          supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('skills').select('*').eq('user_id', user.id).order('name'),
          supabase.from('expenses').select('*').eq('user_id', user.id).order('date', { ascending: false }),
          supabase.from('subscriptions').select('*').eq('user_id', user.id).order('service_name'),
        ]);

        if (eventsRes.data) setEvents(eventsRes.data.map(transformFromDB));
        if (goalsRes.data) setGoals(goalsRes.data.map(transformFromDB));
        if (projectsRes.data) setProjects(projectsRes.data.map(transformFromDB));
        if (skillsRes.data) setSkills(skillsRes.data.map(transformFromDB));
        if (expensesRes.data) setExpenses(expensesRes.data.map(transformFromDB));
        if (subsRes.data) setSubscriptions(subsRes.data.map(transformFromDB));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up real-time subscriptions for all tables
    const eventsChannel = supabase
      .channel('events_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setEvents(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setEvents(p => p.map(e => e.id === payload.new.id ? transformFromDB(payload.new) : e));
        if (payload.eventType === 'DELETE') setEvents(p => p.filter(e => e.id !== payload.old.id));
      })
      .subscribe();

    const goalsChannel = supabase
      .channel('goals_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setGoals(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setGoals(p => p.map(g => g.id === payload.new.id ? transformFromDB(payload.new) : g));
        if (payload.eventType === 'DELETE') setGoals(p => p.filter(g => g.id !== payload.old.id));
      })
      .subscribe();

    const projectsChannel = supabase
      .channel('projects_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setProjects(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setProjects(p => p.map(pr => pr.id === payload.new.id ? transformFromDB(payload.new) : pr));
        if (payload.eventType === 'DELETE') setProjects(p => p.filter(pr => pr.id !== payload.old.id));
      })
      .subscribe();

    const skillsChannel = supabase
      .channel('skills_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setSkills(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setSkills(p => p.map(s => s.id === payload.new.id ? transformFromDB(payload.new) : s));
        if (payload.eventType === 'DELETE') setSkills(p => p.filter(s => s.id !== payload.old.id));
      })
      .subscribe();

    const expensesChannel = supabase
      .channel('expenses_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setExpenses(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setExpenses(p => p.map(e => e.id === payload.new.id ? transformFromDB(payload.new) : e));
        if (payload.eventType === 'DELETE') setExpenses(p => p.filter(e => e.id !== payload.old.id));
      })
      .subscribe();

    const subscriptionsChannel = supabase
      .channel('subscriptions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === 'INSERT') setSubscriptions(p => [...p, transformFromDB(payload.new)]);
        if (payload.eventType === 'UPDATE') setSubscriptions(p => p.map(s => s.id === payload.new.id ? transformFromDB(payload.new) : s));
        if (payload.eventType === 'DELETE') setSubscriptions(p => p.filter(s => s.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      eventsChannel.unsubscribe();
      goalsChannel.unsubscribe();
      projectsChannel.unsubscribe();
      skillsChannel.unsubscribe();
      expensesChannel.unsubscribe();
      subscriptionsChannel.unsubscribe();
    };
  }, [user]);

  const now = () => new Date().toISOString();

  // Events
  const addEvent = useCallback(async (e: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEvent = { ...e, id: genId(), createdAt: now(), updatedAt: now() };
    // Optimistic update
    setEvents(p => [...p, newEvent]);
    if (user) {
      const { error } = await supabase.from('events').insert(transformToDB(newEvent, user.id));
      if (error) {
        setEvents(p => p.filter(ev => ev.id !== newEvent.id));
        console.error('Error adding event:', error);
      }
    }
  }, [user]);

  const updateEvent = useCallback(async (id: string, u: Partial<CalendarEvent>) => {
    const oldEvents = [...events];
    setEvents(p => p.map(e => e.id === id ? { ...e, ...u, updatedAt: now() } : e));
    if (user) {
      const { error } = await supabase.from('events').update(transformToDB({ ...u, updatedAt: now() }, user.id)).eq('id', id);
      if (error) {
        setEvents(oldEvents);
        console.error('Error updating event:', error);
      }
    }
  }, [user, events]);

  const deleteEvent = useCallback(async (id: string) => {
    const oldEvents = [...events];
    setEvents(p => p.filter(e => e.id !== id));
    if (user) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) {
        setEvents(oldEvents);
        console.error('Error deleting event:', error);
      }
    }
  }, [user, events]);

  // Goals
  const addGoal = useCallback(async (g: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newGoal = { ...g, id: genId(), createdAt: now(), updatedAt: now() };
    setGoals(p => [...p, newGoal]);
    if (user) {
      const { error } = await supabase.from('goals').insert(transformToDB(newGoal, user.id));
      if (error) {
        setGoals(p => p.filter(gl => gl.id !== newGoal.id));
        console.error('Error adding goal:', error);
      }
    }
  }, [user]);
  
  const updateGoal = useCallback(async (id: string, u: Partial<Goal>) => {
    const oldGoals = [...goals];
    setGoals(p => p.map(g => g.id === id ? { ...g, ...u, updatedAt: now() } : g));
    if (user) {
      const { error } = await supabase.from('goals').update(transformToDB({ ...u, updatedAt: now() }, user.id)).eq('id', id);
      if (error) {
        setGoals(oldGoals);
        console.error('Error updating goal:', error);
      }
    }
  }, [user, goals]);
  
  const deleteGoal = useCallback(async (id: string) => {
    const oldGoals = [...goals];
    setGoals(p => p.filter(g => g.id !== id));
    if (user) {
      const { error } = await supabase.from('goals').delete().eq('id', id);
      if (error) {
        setGoals(oldGoals);
        console.error('Error deleting goal:', error);
      }
    }
  }, [user, goals]);

  // Projects
  const addProject = useCallback(async (pr: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject = { ...pr, id: genId(), createdAt: now(), updatedAt: now() };
    setProjects(p => [...p, newProject]);
    if (user) {
      const { error } = await supabase.from('projects').insert(transformToDB(newProject, user.id));
      if (error) {
        setProjects(p => p.filter(proj => proj.id !== newProject.id));
        console.error('Error adding project:', error);
      }
    }
  }, [user]);
  
  const updateProject = useCallback(async (id: string, u: Partial<Project>) => {
    const oldProjects = [...projects];
    setProjects(p => p.map(pr => pr.id === id ? { ...pr, ...u, updatedAt: now() } : pr));
    if (user) {
      const { error } = await supabase.from('projects').update(transformToDB({ ...u, updatedAt: now() }, user.id)).eq('id', id);
      if (error) {
        setProjects(oldProjects);
        console.error('Error updating project:', error);
      }
    }
  }, [user, projects]);
  
  const deleteProject = useCallback(async (id: string) => {
    const oldProjects = [...projects];
    setProjects(p => p.filter(pr => pr.id !== id));
    if (user) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        setProjects(oldProjects);
        console.error('Error deleting project:', error);
      }
    }
  }, [user, projects]);

  const toggleProjectTask = useCallback(async (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const tasks = project.tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? now() : undefined } : t
    );
    const completion = tasks.length > 0 ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;
    
    if (user) {
      await supabase.from('projects').update({ tasks, completion, updated_at: now() }).eq('id', projectId);
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tasks, completion, updatedAt: now() } : p));
    }
  }, [projects, user]);

  const addProjectTask = useCallback(async (projectId: string, text: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const tasks = [...project.tasks, { id: genId(), text, completed: false }];
    const completion = Math.round(tasks.filter(t => t.completed).length / tasks.length * 100);
    
    if (user) {
      await supabase.from('projects').update({ tasks, completion, updated_at: now() }).eq('id', projectId);
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tasks, completion, updatedAt: now() } : p));
    }
  }, [projects, user]);

  const deleteProjectTask = useCallback(async (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const tasks = project.tasks.filter(t => t.id !== taskId);
    const completion = tasks.length > 0 ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0;
    
    if (user) {
      await supabase.from('projects').update({ tasks, completion, updated_at: now() }).eq('id', projectId);
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tasks, completion, updatedAt: now() } : p));
    }
  }, [projects, user]);

  // Skills
  const addSkill = useCallback(async (s: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill = { ...s, id: genId(), createdAt: now(), updatedAt: now() };
    setSkills(p => [...p, newSkill]);
    if (user) {
      const { error } = await supabase.from('skills').insert(transformToDB(newSkill, user.id));
      if (error) {
        setSkills(p => p.filter(sk => sk.id !== newSkill.id));
        console.error('Error adding skill:', error);
      }
    }
  }, [user]);
  
  const updateSkill = useCallback(async (id: string, u: Partial<Skill>) => {
    const oldSkills = [...skills];
    setSkills(p => p.map(s => s.id === id ? { ...s, ...u, updatedAt: now() } : s));
    if (user) {
      const { error } = await supabase.from('skills').update(transformToDB({ ...u, updatedAt: now() }, user.id)).eq('id', id);
      if (error) {
        setSkills(oldSkills);
        console.error('Error updating skill:', error);
      }
    }
  }, [user, skills]);
  
  const deleteSkill = useCallback(async (id: string) => {
    const oldSkills = [...skills];
    setSkills(p => p.filter(s => s.id !== id));
    if (user) {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) {
        setSkills(oldSkills);
        console.error('Error deleting skill:', error);
      }
    }
  }, [user, skills]);

  // Expenses
  const addExpense = useCallback(async (e: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense = { ...e, id: genId(), createdAt: now() };
    // Optimistic update - update UI immediately
    setExpenses(p => [...p, newExpense]);
    if (user) {
      const { error } = await supabase.from('expenses').insert(transformToDB(newExpense, user.id));
      if (error) {
        // Rollback on error
        setExpenses(p => p.filter(exp => exp.id !== newExpense.id));
        console.error('Error adding expense:', error);
      }
    }
  }, [user]);
  const updateExpense = useCallback(async (id: string, u: Partial<Expense>) => {
    // Optimistic update
    const oldExpenses = [...expenses];
    setExpenses(p => p.map(e => e.id === id ? { ...e, ...u } : e));
    if (user) {
      const { error } = await supabase.from('expenses').update(transformToDB(u, user.id)).eq('id', id);
      if (error) {
        // Rollback on error
        setExpenses(oldExpenses);
        console.error('Error updating expense:', error);
      }
    }
  }, [user, expenses]);
  
  const deleteExpense = useCallback(async (id: string) => {
    // Optimistic update
    const oldExpenses = [...expenses];
    setExpenses(p => p.filter(e => e.id !== id));
    if (user) {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) {
        // Rollback on error
        setExpenses(oldExpenses);
        console.error('Error deleting expense:', error);
      }
    }
  }, [user, expenses]);

  // Subscriptions
  const addSubscription = useCallback(async (s: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSub = { ...s, id: genId(), createdAt: now(), updatedAt: now() };
    setSubscriptions(p => [...p, newSub]);
    if (user) {
      const { error } = await supabase.from('subscriptions').insert(transformToDB(newSub, user.id));
      if (error) {
        setSubscriptions(p => p.filter(sub => sub.id !== newSub.id));
        console.error('Error adding subscription:', error);
      }
    }
  }, [user]);
  
  const updateSubscription = useCallback(async (id: string, u: Partial<Subscription>) => {
    const oldSubscriptions = [...subscriptions];
    setSubscriptions(p => p.map(s => s.id === id ? { ...s, ...u, updatedAt: now() } : s));
    if (user) {
      const { error } = await supabase.from('subscriptions').update(transformToDB({ ...u, updatedAt: now() }, user.id)).eq('id', id);
      if (error) {
        setSubscriptions(oldSubscriptions);
        console.error('Error updating subscription:', error);
      }
    }
  }, [user, subscriptions]);
  
  const deleteSubscription = useCallback(async (id: string) => {
    const oldSubscriptions = [...subscriptions];
    setSubscriptions(p => p.filter(s => s.id !== id));
    if (user) {
      const { error } = await supabase.from('subscriptions').delete().eq('id', id);
      if (error) {
        setSubscriptions(oldSubscriptions);
        console.error('Error deleting subscription:', error);
      }
    }
  }, [user, subscriptions]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your data...</p>
        </div>
      </div>
    );
  }

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
