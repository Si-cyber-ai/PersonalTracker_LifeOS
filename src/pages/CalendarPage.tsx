import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getEventTypeColor, EVENT_TYPES } from '@/lib/helpers';
import type { EventType } from '@/types';
import { cn } from '@/lib/utils';

const CalendarPage = () => {
  const { events, skills, projects, addEvent, deleteEvent } = useLifeOS();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', startTime: '09:00', endTime: '10:00', type: 'Deep Work' as EventType, notes: '', linkedSkill: '', linkedProject: '' });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart);
  const calEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let d = calStart;
  while (d <= calEnd) { days.push(d); d = addDays(d, 1); }

  const selectedEvents = events
    .filter(e => isSameDay(new Date(e.startTime), selectedDate))
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const handleSave = () => {
    if (!form.title.trim()) return;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    addEvent({
      title: form.title,
      startTime: new Date(`${dateStr}T${form.startTime}`).toISOString(),
      endTime: new Date(`${dateStr}T${form.endTime}`).toISOString(),
      type: form.type, notes: form.notes,
      linkedSkill: form.linkedSkill || undefined,
      linkedProject: form.linkedProject || undefined,
      checklist: [], completed: false,
      color: getEventTypeColor(form.type),
    });
    setModalOpen(false);
    setForm({ title: '', startTime: '09:00', endTime: '10:00', type: 'Deep Work', notes: '', linkedSkill: '', linkedProject: '' });
  };

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><CalendarDays className="w-8 h-8 text-primary" /> Calendar</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-white/30 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <span className="font-semibold text-foreground min-w-[140px] text-center">{format(currentMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-xl hover:bg-white/30 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <Button onClick={() => { setCurrentMonth(new Date()); setSelectedDate(new Date()); }} variant="outline" className="rounded-xl text-sm">Today</Button>
          <Button onClick={() => setModalOpen(true)} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
            <Plus className="w-4 h-4" /> Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), day));
                const isSelected = isSameDay(day, selectedDate);
                const today = isToday(day);
                const inMonth = isSameMonth(day, currentMonth);
                return (
                  <button key={day.toISOString()} onClick={() => setSelectedDate(day)}
                    className={cn('aspect-square p-1 rounded-xl text-sm flex flex-col items-center justify-start gap-0.5 transition-all duration-200',
                      !inMonth && 'opacity-25', isSelected && 'bg-primary/15 ring-2 ring-primary/50',
                      today && !isSelected && 'bg-accent/10', !isSelected && 'hover:bg-white/30'
                    )}>
                    <span className={cn('text-xs', today && 'font-bold text-primary')}>{format(day, 'd')}</span>
                    <div className="flex gap-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map(e => (
                        <div key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color || getEventTypeColor(e.type) }} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <h3 className="font-semibold text-foreground mb-4">{format(selectedDate, 'EEEE, MMM d')}</h3>
            <div className="space-y-3">
              {selectedEvents.length > 0 ? selectedEvents.map(event => (
                <div key={event.id} className="p-3 rounded-xl bg-white/25 group">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 rounded-full min-h-[36px] mt-0.5 flex-shrink-0" style={{ backgroundColor: event.color || getEventTypeColor(event.type) }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(event.startTime), 'h:mm a')} – {format(new Date(event.endTime), 'h:mm a')}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: `${getEventTypeColor(event.type)}20`, color: getEventTypeColor(event.type) }}>{event.type}</span>
                    </div>
                    <button onClick={() => deleteEvent(event.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground text-center py-4">No events this day</p>}
            </div>
          </GlassCard>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">New Event – {format(selectedDate, 'MMM d')}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Event title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Start</label><Input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" /></div>
              <div><label className="text-xs text-muted-foreground">End</label><Input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" /></div>
            </div>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as EventType }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.linkedSkill} onChange={e => setForm(f => ({ ...f, linkedSkill: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              <option value="">Link to skill (optional)</option>
              {skills.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={form.linkedProject} onChange={e => setForm(f => ({ ...f, linkedProject: e.target.value }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              <option value="">Link to project (optional)</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Textarea placeholder="Notes (optional)" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" rows={2} />
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

export default CalendarPage;
