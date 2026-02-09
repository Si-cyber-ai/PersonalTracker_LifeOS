import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { Rocket, Plus, Trash2, CheckSquare, Square, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Project } from '@/types';

const STATUS_OPTIONS: Project['status'][] = ['Planning', 'Active', 'Paused', 'Completed'];

const ProjectsPage = () => {
  const { projects, addProject, updateProject, deleteProject, toggleProjectTask, addProjectTask, deleteProjectTask } = useLifeOS();
  const [filter, setFilter] = useState<string>('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newTask, setNewTask] = useState('');
  const [form, setForm] = useState({ name: '', description: '', status: 'Active' as Project['status'], color: 'hsl(160,50%,48%)', notes: '' });
  const [editId, setEditId] = useState<string | null>(null);

  const filtered = filter === 'All' ? projects : projects.filter(p => p.status === filter);

  const openAdd = () => { setEditId(null); setForm({ name: '', description: '', status: 'Active', color: 'hsl(160,50%,48%)', notes: '' }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editId) {
      updateProject(editId, form);
    } else {
      addProject({ ...form, completion: 0, linkedSkills: [], linkedGoals: [], tasks: [] });
    }
    setModalOpen(false);
  };

  const handleAddTask = (projectId: string) => {
    if (!newTask.trim()) return;
    addProjectTask(projectId, newTask.trim());
    setNewTask('');
  };

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><Rocket className="w-8 h-8 text-primary" /> Projects</h1>
        <Button onClick={openAdd} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
          <Plus className="w-4 h-4" /> New Project
        </Button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...STATUS_OPTIONS].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'glass-strong text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((project, i) => (
          <motion.div key={project.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <GlassCard className="hover-lift">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: project.status === 'Active' ? 'hsla(140,50%,46%,0.12)' : project.status === 'Completed' ? 'hsla(210,70%,50%,0.12)' : 'hsla(0,0%,50%,0.12)', color: project.status === 'Active' ? 'hsl(140,50%,40%)' : 'hsl(0,0%,45%)' }}>
                    {project.status}
                  </span>
                </div>
                <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-lg hover:bg-white/40 opacity-50 hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
              </div>

              <h3 className="font-semibold text-foreground text-lg mb-1 cursor-pointer" onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}>
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Completion</span><span className="font-medium text-foreground">{project.completion}%</span></div>
                <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${project.completion}%` }} /></div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{project.tasks.filter(t => t.completed).length}/{project.tasks.length} tasks</p>

              {expandedId === project.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 pt-3 border-t border-border/30">
                  <div className="space-y-1.5 mb-3">
                    {project.tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2 group">
                        <button onClick={() => toggleProjectTask(project.id, task.id)} className="flex-shrink-0">
                          {task.completed ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <span className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{task.text}</span>
                        <button onClick={() => deleteProjectTask(project.id, task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add task..." className="rounded-xl text-sm bg-white/50 border-border/50 h-8" onKeyDown={e => e.key === 'Enter' && handleAddTask(project.id)} />
                    <Button size="sm" onClick={() => handleAddTask(project.id)} className="rounded-xl h-8 px-3" style={{ background: 'hsl(160,45%,48%)', color: 'white' }}><Plus className="w-3.5 h-3.5" /></Button>
                  </div>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">New Project</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Project name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
            <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" rows={3} />
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Project['status'] }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
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

export default ProjectsPage;
