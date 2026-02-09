import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { Target, Plus, Trash2, Edit, Calendar } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const GoalsPage = () => {
  const { goals, projects, addGoal, updateGoal, deleteGoal } = useLifeOS();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', deadline: '', linkedProjects: [] as string[], colorTag: 'hsl(160,45%,48%)' });

  const filtered = goals.filter(g => {
    if (filter === 'active') return !g.completed;
    if (filter === 'completed') return g.completed;
    return true;
  });

  const openAdd = () => { setEditId(null); setForm({ name: '', description: '', deadline: format(new Date(Date.now() + 30 * 86400000), 'yyyy-MM-dd'), linkedProjects: [], colorTag: 'hsl(160,45%,48%)' }); setModalOpen(true); };
  const openEdit = (g: typeof goals[0]) => { setEditId(g.id); setForm({ name: g.name, description: g.description, deadline: format(new Date(g.deadline), 'yyyy-MM-dd'), linkedProjects: g.linkedProjects, colorTag: g.colorTag }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const data = { name: form.name, description: form.description, deadline: new Date(form.deadline).toISOString(), linkedProjects: form.linkedProjects, colorTag: form.colorTag, progress: 0, status: 'active' as const, completed: false };
    if (editId) { updateGoal(editId, data); } else { addGoal(data); }
    setModalOpen(false);
  };

  const filters = [{ key: 'all', label: 'All' }, { key: 'active', label: 'Active' }, { key: 'completed', label: 'Completed' }] as const;

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><Target className="w-8 h-8 text-primary" /> Goals</h1>
        <Button onClick={openAdd} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
          <Plus className="w-4 h-4" /> Add Goal
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f.key ? 'glass-strong text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((goal, i) => {
          const daysLeft = differenceInDays(new Date(goal.deadline), new Date());
          const urgency = daysLeft < 0 ? 'text-destructive' : daysLeft < 7 ? 'text-warning' : 'text-muted-foreground';
          return (
            <motion.div key={goal.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="hover-lift group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: goal.colorTag }} />
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => openEdit(goal)} className="p-1.5 rounded-lg hover:bg-white/40"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    <button onClick={() => deleteGoal(goal.id)} className="p-1.5 rounded-lg hover:bg-white/40"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-lg">{goal.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{goal.description}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{goal.progress}%</span></div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${goal.progress}%` }} /></div>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className={urgency}>{daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}</span>
                  <span className="text-muted-foreground">· {format(new Date(goal.deadline), 'MMM d')}</span>
                </div>
                {goal.completed && <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-success/15 text-success font-medium">Completed ✓</span>}
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">{editId ? 'Edit Goal' : 'New Goal'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Goal name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl border-border/50 bg-white/50" />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl border-border/50 bg-white/50" rows={3} />
            <div><label className="text-sm text-muted-foreground mb-1 block">Deadline</label><Input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="rounded-xl border-border/50 bg-white/50" /></div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setModalOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSave} className="rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default GoalsPage;
