import type { CalendarEvent, Goal, Project, Skill, Expense, Subscription } from '@/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

function todayAt(hour: number, min = 0): string {
  const d = new Date();
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export function generateSampleData() {
  const events: CalendarEvent[] = [
    {
      id: 'evt_1', title: 'Deep Work: Code Review', startTime: todayAt(9), endTime: todayAt(11),
      type: 'Deep Work', linkedSkill: 'skill_react', linkedProject: 'proj_portfolio',
      notes: 'Review authentication module', checklist: [
        { id: 't1', text: 'Review PR #42', completed: true },
        { id: 't2', text: 'Test locally', completed: false },
      ], completed: false, color: 'hsl(220, 70%, 60%)', createdAt: daysAgo(1), updatedAt: daysAgo(0),
    },
    {
      id: 'evt_2', title: 'Morning Run', startTime: todayAt(7), endTime: todayAt(7, 45),
      type: 'Health', notes: '5K route', checklist: [], completed: true,
      color: 'hsl(0, 70%, 60%)', createdAt: daysAgo(1), updatedAt: daysAgo(0),
    },
    {
      id: 'evt_3', title: 'Team Standup', startTime: todayAt(13), endTime: todayAt(13, 30),
      type: 'Meeting', checklist: [], completed: false,
      color: 'hsl(30, 80%, 55%)', createdAt: daysAgo(2), updatedAt: daysAgo(0),
    },
    {
      id: 'evt_4', title: 'Learn TypeScript Generics', startTime: todayAt(15), endTime: todayAt(16, 30),
      type: 'Learning', linkedSkill: 'skill_ts', checklist: [
        { id: 't3', text: 'Read docs on conditional types', completed: true },
        { id: 't4', text: 'Practice exercises', completed: true },
      ], completed: true, color: 'hsl(140, 60%, 50%)', createdAt: daysAgo(1), updatedAt: daysAgo(0),
    },
    {
      id: 'evt_5', title: 'Evening Reading', startTime: todayAt(20), endTime: todayAt(21),
      type: 'Personal', checklist: [], completed: false,
      color: 'hsl(280, 60%, 60%)', createdAt: daysAgo(0), updatedAt: daysAgo(0),
    },
  ];

  const goals: Goal[] = [
    {
      id: 'goal_1', name: 'Launch Personal Portfolio', description: 'Build and deploy a professional portfolio website',
      deadline: daysFromNow(35), linkedProjects: ['proj_portfolio'], progress: 65, status: 'active',
      colorTag: 'hsl(280, 60%, 60%)', completed: false, createdAt: daysAgo(30), updatedAt: daysAgo(1),
    },
    {
      id: 'goal_2', name: 'Master TypeScript', description: 'Complete advanced TypeScript course and build 3 projects',
      deadline: daysFromNow(60), linkedProjects: ['proj_ts_course'], progress: 40, status: 'active',
      colorTag: 'hsl(210, 75%, 55%)', completed: false, createdAt: daysAgo(45), updatedAt: daysAgo(3),
    },
    {
      id: 'goal_3', name: 'Read 12 Books This Year', description: 'One book per month across technical and non-technical topics',
      deadline: daysFromNow(300), linkedProjects: [], progress: 25, status: 'active',
      colorTag: 'hsl(140, 55%, 50%)', completed: false, createdAt: daysAgo(40), updatedAt: daysAgo(7),
    },
  ];

  const projects: Project[] = [
    {
      id: 'proj_portfolio', name: 'Portfolio Website', description: 'Modern, responsive portfolio with React and Tailwind',
      status: 'Active', completion: 65, linkedSkills: ['skill_react', 'skill_tailwind'],
      linkedGoals: ['goal_1'], tasks: [
        { id: 'pt1', text: 'Design mockups in Figma', completed: true, completedAt: daysAgo(20) },
        { id: 'pt2', text: 'Set up React project', completed: true, completedAt: daysAgo(18) },
        { id: 'pt3', text: 'Build homepage', completed: true, completedAt: daysAgo(5) },
        { id: 'pt4', text: 'Create project showcase', completed: true, completedAt: daysAgo(2) },
        { id: 'pt5', text: 'Add contact form', completed: false },
        { id: 'pt6', text: 'Deploy to Vercel', completed: false },
      ], color: 'hsl(160, 50%, 48%)', createdAt: daysAgo(25), updatedAt: daysAgo(1),
    },
    {
      id: 'proj_ts_course', name: 'TypeScript Mastery Course', description: 'Complete advanced TS course with projects',
      status: 'Active', completion: 40, linkedSkills: ['skill_ts'],
      linkedGoals: ['goal_2'], tasks: [
        { id: 'pt7', text: 'Basic types & interfaces', completed: true, completedAt: daysAgo(15) },
        { id: 'pt8', text: 'Generics deep dive', completed: true, completedAt: daysAgo(3) },
        { id: 'pt9', text: 'Utility types', completed: false },
        { id: 'pt10', text: 'Build CLI tool project', completed: false },
        { id: 'pt11', text: 'Build full-stack project', completed: false },
      ], color: 'hsl(210, 75%, 55%)', createdAt: daysAgo(20), updatedAt: daysAgo(3),
    },
    {
      id: 'proj_blog', name: 'Technical Blog', description: 'Blog platform for writing technical articles',
      status: 'Planning', completion: 0, linkedSkills: ['skill_react'],
      linkedGoals: ['goal_1'], tasks: [
        { id: 'pt12', text: 'Choose CMS platform', completed: false },
        { id: 'pt13', text: 'Design blog layout', completed: false },
        { id: 'pt14', text: 'Write first 3 articles', completed: false },
      ], color: 'hsl(30, 80%, 55%)', createdAt: daysAgo(10), updatedAt: daysAgo(10),
    },
  ];

  const skills: Skill[] = [
    {
      id: 'skill_react', name: 'React Development', category: 'Technical',
      focusHours: 47.5, projectsApplied: ['proj_portfolio', 'proj_blog'],
      lastUsed: daysAgo(0), workTypes: ['Deep Work', 'Learning'],
      color: 'hsl(195, 85%, 55%)', createdAt: daysAgo(90), updatedAt: daysAgo(0),
    },
    {
      id: 'skill_ts', name: 'TypeScript', category: 'Technical',
      focusHours: 23.0, projectsApplied: ['proj_ts_course'],
      lastUsed: daysAgo(1), workTypes: ['Deep Work', 'Learning'],
      color: 'hsl(210, 75%, 50%)', createdAt: daysAgo(60), updatedAt: daysAgo(1),
    },
    {
      id: 'skill_tailwind', name: 'Tailwind CSS', category: 'Technical',
      focusHours: 18.5, projectsApplied: ['proj_portfolio'],
      lastUsed: daysAgo(2), workTypes: ['Deep Work'],
      color: 'hsl(190, 80%, 50%)', createdAt: daysAgo(50), updatedAt: daysAgo(2),
    },
    {
      id: 'skill_design', name: 'UI/UX Design', category: 'Creative',
      focusHours: 12.0, projectsApplied: ['proj_portfolio'],
      lastUsed: daysAgo(5), workTypes: ['Deep Work'],
      color: 'hsl(330, 65%, 55%)', createdAt: daysAgo(40), updatedAt: daysAgo(5),
    },
  ];

  const expenses: Expense[] = [
    { id: 'exp_1', amount: 12.50, category: 'Food & Dining', date: daysAgo(0), notes: 'Lunch - veggie wrap & coffee', createdAt: daysAgo(0) },
    { id: 'exp_2', amount: 45.00, category: 'Transportation', date: daysAgo(0), notes: 'Gas fill-up', createdAt: daysAgo(0) },
    { id: 'exp_3', amount: 89.99, category: 'Shopping', date: daysAgo(1), notes: 'New running shoes', createdAt: daysAgo(1) },
    { id: 'exp_4', amount: 15.00, category: 'Entertainment', date: daysAgo(1), notes: 'Movie ticket', createdAt: daysAgo(1) },
    { id: 'exp_5', amount: 8.50, category: 'Food & Dining', date: daysAgo(2), notes: 'Morning coffee & pastry', createdAt: daysAgo(2) },
    { id: 'exp_6', amount: 35.00, category: 'Health & Fitness', date: daysAgo(3), notes: 'Yoga class', createdAt: daysAgo(3) },
    { id: 'exp_7', amount: 120.00, category: 'Bills & Utilities', date: daysAgo(4), notes: 'Electric bill', createdAt: daysAgo(4) },
    { id: 'exp_8', amount: 22.00, category: 'Food & Dining', date: daysAgo(5), notes: 'Dinner out', createdAt: daysAgo(5) },
    { id: 'exp_9', amount: 49.99, category: 'Education', date: daysAgo(6), notes: 'Online course', createdAt: daysAgo(6) },
  ];

  const subscriptions: Subscription[] = [
    {
      id: 'sub_1', serviceName: 'Spotify Premium', cost: 10.99, billingCycle: 'Monthly',
      nextRenewal: daysFromNow(6), paymentMethod: 'Credit Card', category: 'Streaming',
      notes: 'Student discount', active: true, autoRenew: true, createdAt: daysAgo(180), updatedAt: daysAgo(30),
    },
    {
      id: 'sub_2', serviceName: 'Notion Pro', cost: 96.00, billingCycle: 'Yearly',
      nextRenewal: daysFromNow(280), paymentMethod: 'PayPal', category: 'Productivity',
      active: true, autoRenew: true, createdAt: daysAgo(90), updatedAt: daysAgo(90),
    },
    {
      id: 'sub_3', serviceName: 'Netflix', cost: 15.49, billingCycle: 'Monthly',
      nextRenewal: daysFromNow(18), paymentMethod: 'Credit Card', category: 'Streaming',
      active: true, autoRenew: true, createdAt: daysAgo(365), updatedAt: daysAgo(15),
    },
    {
      id: 'sub_4', serviceName: 'GitHub Pro', cost: 4.00, billingCycle: 'Monthly',
      nextRenewal: daysFromNow(12), paymentMethod: 'Credit Card', category: 'Productivity',
      active: true, autoRenew: true, createdAt: daysAgo(200), updatedAt: daysAgo(20),
    },
    {
      id: 'sub_5', serviceName: 'Adobe Creative Cloud', cost: 54.99, billingCycle: 'Monthly',
      nextRenewal: daysFromNow(3), paymentMethod: 'Credit Card', category: 'Productivity',
      notes: 'All Apps plan', active: true, autoRenew: true, createdAt: daysAgo(120), updatedAt: daysAgo(28),
    },
  ];

  return { events, goals, projects, skills, expenses, subscriptions };
}
