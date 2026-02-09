import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { IndianRupee, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, isToday, startOfWeek, startOfMonth, endOfMonth, addMonths, isSameMonth } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EXPENSE_CATEGORIES, getCategoryInfo } from '@/lib/helpers';
import type { ExpenseCategory } from '@/types';

const MoneyPage = () => {
  const { expenses, addExpense, deleteExpense } = useLifeOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Food & Dining' as ExpenseCategory, date: format(new Date(), 'yyyy-MM-dd'), notes: '' });
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const today = new Date();
  const weekStart = startOfWeek(today);
  const monthStart2 = startOfMonth(selectedMonth);
  const monthEnd2 = endOfMonth(selectedMonth);
  const isCurrentMonth = isSameMonth(selectedMonth, today);

  const todayTotal = expenses.filter(e => isToday(new Date(e.date))).reduce((s, e) => s + e.amount, 0);
  const weekTotal = expenses.filter(e => new Date(e.date) >= weekStart).reduce((s, e) => s + e.amount, 0);
  const monthTotal = expenses.filter(e => {
    const expDate = new Date(e.date);
    return expDate >= monthStart2 && expDate <= monthEnd2;
  }).reduce((s, e) => s + e.amount, 0);

  const categoryTotals = EXPENSE_CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => {
      const expDate = new Date(e.date);
      return e.category === cat.name && expDate >= monthStart2 && expDate <= monthEnd2;
    }).reduce((s, e) => s + e.amount, 0),
  })).filter(c => c.total > 0).sort((a, b) => b.total - a.total);

  const maxCatTotal = Math.max(...categoryTotals.map(c => c.total), 1);

  const handleSave = () => {
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return;
    addExpense({ amount: amt, category: form.category, date: new Date(form.date).toISOString(), notes: form.notes });
    setModalOpen(false);
    setForm({ amount: '', category: 'Food & Dining', date: format(new Date(), 'yyyy-MM-dd'), notes: '' });
  };

  const sorted = expenses
    .filter(e => {
      const expDate = new Date(e.date);
      return expDate >= monthStart2 && expDate <= monthEnd2;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><IndianRupee className="w-8 h-8 text-primary" /> Money Tracker</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setSelectedMonth(addMonths(selectedMonth, -1))} className="p-2 rounded-xl hover:bg-white/30 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-foreground min-w-[140px] text-center">{format(selectedMonth, 'MMMM yyyy')}</span>
            <button onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))} disabled={isSameMonth(addMonths(selectedMonth, 1), addMonths(today, 1))} className="p-2 rounded-xl hover:bg-white/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {!isCurrentMonth && (
            <Button variant="outline" onClick={() => setSelectedMonth(new Date())} className="rounded-xl text-sm">
              Current
            </Button>
          )}
          <Button onClick={() => setModalOpen(true)} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard><p className="text-sm text-muted-foreground">Today</p><p className="text-3xl font-bold text-foreground">₹{todayTotal.toFixed(2)}</p></GlassCard>
        <GlassCard><p className="text-sm text-muted-foreground">This Week</p><p className="text-3xl font-bold text-foreground">₹{weekTotal.toFixed(2)}</p></GlassCard>
        <GlassCard><p className="text-sm text-muted-foreground">{isCurrentMonth ? 'This Month' : format(selectedMonth, 'MMM yyyy')}</p><p className="text-3xl font-bold text-foreground">₹{monthTotal.toFixed(2)}</p></GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GlassCard>
            <h3 className="font-semibold text-foreground mb-4">
              {isCurrentMonth ? 'Recent Expenses' : `Expenses - ${format(selectedMonth, 'MMMM yyyy')}`}
            </h3>
            <div className="space-y-2">
              {sorted.map(exp => {
                const cat = getCategoryInfo(exp.category);
                return (
                  <div key={exp.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/20 transition-colors group">
                    <span className="text-lg">{cat.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{exp.notes || exp.category}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(exp.date), 'MMM d')} · {exp.category}</p>
                    </div>
                    <span className="font-semibold text-foreground text-sm">₹{exp.amount.toFixed(2)}</span>
                    <button onClick={() => deleteExpense(exp.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                );
              })}
              {expenses.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No expenses yet</p>}
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard>
            <h3 className="font-semibold text-foreground mb-4">By Category</h3>
            <div className="space-y-3">
              {categoryTotals.map(cat => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">{cat.emoji} {cat.name}</span>
                    <span className="font-medium text-foreground">₹{cat.total.toFixed(2)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(cat.total / maxCatTotal) * 100}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><label className="text-xs text-muted-foreground">Amount (₹)</label><Input type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="rounded-xl bg-white/50 border-border/50 text-lg font-semibold" autoFocus /></div>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ExpenseCategory }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
              {EXPENSE_CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>)}
            </select>
            <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
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

export default MoneyPage;
