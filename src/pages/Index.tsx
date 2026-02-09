import { useLifeOS } from '@/contexts/LifeOSContext';
import { useTimeOfDay } from '@/hooks/useTimeOfDay';
import GlassCard from '@/components/layout/GlassCard';
import { Link } from 'react-router-dom';
import { Target, Rocket, Lightbulb, CalendarDays, IndianRupee, CreditCard, Clock } from 'lucide-react';
import { format, isToday, differenceInDays, startOfWeek } from 'date-fns';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { greeting } = useTimeOfDay();
  const { events, goals, projects, expenses, subscriptions } = useLifeOS();

  const today = new Date();
  const weekStart = startOfWeek(today);

  const deepWorkHours = events
    .filter(e => e.type === 'Deep Work' && e.completed && new Date(e.startTime) >= weekStart)
    .reduce((sum, e) => sum + (new Date(e.endTime).getTime() - new Date(e.startTime).getTime()) / 3600000, 0);

  const todaysEvents = events
    .filter(e => isToday(new Date(e.startTime)))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 3);

  const activeGoals = goals.filter(g => !g.completed).slice(0, 3);
  const activeProjects = projects.filter(p => p.status === 'Active').slice(0, 3);

  const todaySpending = expenses
    .filter(e => isToday(new Date(e.date)))
    .reduce((sum, e) => sum + e.amount, 0);
  const weekSpending = expenses
    .filter(e => new Date(e.date) >= weekStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const upcomingRenewals = subscriptions
    .filter(s => s.active)
    .sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime())
    .slice(0, 3);

  const quotes = [
    "The only way to do great work is to love what you do.",
    "Deep work produces deep results.",
    "Focus is a superpower.",
    "Small consistent actions create remarkable results.",
    "Your time is your most valuable asset.",
  ];
  const dailyQuote = quotes[today.getDate() % quotes.length];

  const cardDelay = (i: number) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 + i * 0.08, duration: 0.4 } });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div className="text-center py-8" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{greeting}</h1>
        <p className="text-lg text-muted-foreground">{format(today, 'EEEE, MMMM d, yyyy')}</p>
        <p className="text-sm text-muted-foreground/70 mt-2 italic font-accent">"{dailyQuote}"</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div {...cardDelay(0)}>
          <Link to="/calendar"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl" style={{ background: 'hsla(220,70%,60%,0.12)' }}><Clock className="w-5 h-5" style={{ color: 'hsl(220,70%,60%)' }} /></div>
              <h3 className="font-semibold text-foreground">Deep Work</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">{deepWorkHours.toFixed(1)}h</p>
            <p className="text-sm text-muted-foreground">this week</p>
          </GlassCard></Link>
        </motion.div>

        <motion.div {...cardDelay(1)}>
          <Link to="/calendar"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-primary/10"><CalendarDays className="w-5 h-5 text-primary" /></div>
              <h3 className="font-semibold text-foreground">Today's Schedule</h3>
            </div>
            {todaysEvents.length > 0 ? (
              <div className="space-y-2">
                {todaysEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: event.color || 'hsl(160,45%,48%)' }} />
                    <span className="text-foreground truncate">{event.title}</span>
                    <span className="text-muted-foreground ml-auto text-xs whitespace-nowrap">{format(new Date(event.startTime), 'h:mm a')}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-sm">No events today</p>}
          </GlassCard></Link>
        </motion.div>

        <motion.div {...cardDelay(2)}>
          <Link to="/goals"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-accent/10"><Target className="w-5 h-5 text-accent" /></div>
              <h3 className="font-semibold text-foreground">Goals</h3>
            </div>
            {activeGoals.length > 0 ? (
              <div className="space-y-3">
                {activeGoals.map(goal => (
                  <div key={goal.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground truncate">{goal.name}</span>
                      <span className="text-muted-foreground text-xs">{goal.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${goal.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-sm">No active goals</p>}
          </GlassCard></Link>
        </motion.div>

        <motion.div {...cardDelay(3)}>
          <Link to="/projects"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-success/10"><Rocket className="w-5 h-5 text-success" /></div>
              <h3 className="font-semibold text-foreground">Projects</h3>
            </div>
            {activeProjects.length > 0 ? (
              <div className="space-y-2">
                {activeProjects.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-foreground truncate">{p.name}</span>
                    <span className="text-muted-foreground ml-auto text-xs">{p.completion}%</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-muted-foreground text-sm">No active projects</p>}
          </GlassCard></Link>
        </motion.div>

        <motion.div {...cardDelay(4)}>
          <Link to="/money"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-warning/10"><IndianRupee className="w-5 h-5 text-warning" /></div>
              <h3 className="font-semibold text-foreground">Spending</h3>
            </div>
            <p className="text-3xl font-bold text-foreground">₹{todaySpending.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">today · ₹{weekSpending.toFixed(2)} this week</p>
          </GlassCard></Link>
        </motion.div>

        <motion.div {...cardDelay(5)}>
          <Link to="/subscriptions"><GlassCard className="hover-lift h-full">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-destructive/10"><CreditCard className="w-5 h-5 text-destructive" /></div>
              <h3 className="font-semibold text-foreground">Renewals</h3>
            </div>
            {upcomingRenewals.length > 0 ? (
              <div className="space-y-2">
                {upcomingRenewals.map(sub => {
                  const d = differenceInDays(new Date(sub.nextRenewal), today);
                  return (
                    <div key={sub.id} className="flex items-center gap-2 text-sm">
                      <span className="text-foreground truncate">{sub.serviceName}</span>
                      <span className={`ml-auto text-xs font-medium ${d < 7 ? 'text-destructive' : d < 30 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {d}d · ₹{sub.cost}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : <p className="text-muted-foreground text-sm">No upcoming renewals</p>}
          </GlassCard></Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
