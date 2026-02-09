import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { Lightbulb, Plus, Trash2, Clock, FolderOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const CATEGORIES = ['Technical', 'Creative', 'Business', 'Communication', 'Other'];

const SkillsPage = () => {
  const { skills, projects, addSkill, deleteSkill } = useLifeOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Technical', color: 'hsl(195,85%,55%)' });

  const totalHours = skills.reduce((s, sk) => s + sk.focusHours, 0);

  const handleSave = () => {
    if (!form.name.trim()) return;
    addSkill({ ...form, focusHours: 0, projectsApplied: [], lastUsed: new Date().toISOString(), workTypes: [] });
    setModalOpen(false);
    setForm({ name: '', category: 'Technical', color: 'hsl(195,85%,55%)' });
  };

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><Lightbulb className="w-8 h-8 text-primary" /> Skills</h1>
        <Button onClick={() => setModalOpen(true)} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <GlassCard className="mb-6">
        <div className="flex items-center gap-4">
          <div><p className="text-sm text-muted-foreground">Total Focus Hours</p><p className="text-2xl font-bold text-foreground">{totalHours.toFixed(1)}h</p></div>
          <div className="w-px h-10 bg-border/50" />
          <div><p className="text-sm text-muted-foreground">Skills Tracked</p><p className="text-2xl font-bold text-foreground">{skills.length}</p></div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill, i) => {
          const linkedProjects = projects.filter(p => skill.projectsApplied.includes(p.id));
          return (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className="hover-lift group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: skill.color }} />
                    <span className="text-xs font-medium text-muted-foreground">{skill.category}</span>
                  </div>
                  <button onClick={() => deleteSkill(skill.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-white/40"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">{skill.name}</h3>
                <div className="flex items-center gap-1.5 text-sm mb-2"><Clock className="w-4 h-4 text-muted-foreground" /><span className="font-medium text-foreground">{skill.focusHours}h</span><span className="text-muted-foreground">invested</span></div>
                {linkedProjects.length > 0 && (
                  <div className="flex items-center gap-1.5 text-sm mb-2"><FolderOpen className="w-4 h-4 text-muted-foreground" /><span className="text-muted-foreground truncate">{linkedProjects.map(p => p.name).join(', ')}</span></div>
                )}
                {skill.workTypes.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {skill.workTypes.map(wt => <span key={wt} className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{wt}</span>)}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">Last used {formatDistanceToNow(new Date(skill.lastUsed), { addSuffix: true })}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">Add Skill</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Skill name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
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

export default SkillsPage;
