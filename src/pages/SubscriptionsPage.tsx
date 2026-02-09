import { useState } from 'react';
import { useLifeOS } from '@/contexts/LifeOSContext';
import GlassCard from '@/components/layout/GlassCard';
import { motion } from 'framer-motion';
import { CreditCard, Plus, Trash2, Pause, Play } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Subscription } from '@/types';

const SubscriptionsPage = () => {
  const { subscriptions, addSubscription, updateSubscription, deleteSubscription } = useLifeOS();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ serviceName: '', cost: '', billingCycle: 'Monthly' as Subscription['billingCycle'], nextRenewal: format(new Date(), 'yyyy-MM-dd'), paymentMethod: 'Credit Card', category: 'Productivity', notes: '' });

  const activeSubs = subscriptions.filter(s => s.active);
  const monthlyTotal = activeSubs.reduce((s, sub) => {
    if (sub.billingCycle === 'Monthly') return s + sub.cost;
    if (sub.billingCycle === 'Yearly') return s + sub.cost / 12;
    if (sub.billingCycle === 'Quarterly') return s + sub.cost / 3;
    return s;
  }, 0);
  const yearlyTotal = monthlyTotal * 12;

  const handleSave = () => {
    if (!form.serviceName.trim() || !form.cost) return;
    addSubscription({
      serviceName: form.serviceName, cost: parseFloat(form.cost), billingCycle: form.billingCycle,
      nextRenewal: new Date(form.nextRenewal).toISOString(), paymentMethod: form.paymentMethod,
      category: form.category, notes: form.notes, active: true, autoRenew: true,
    });
    setModalOpen(false);
    setForm({ serviceName: '', cost: '', billingCycle: 'Monthly', nextRenewal: format(new Date(), 'yyyy-MM-dd'), paymentMethod: 'Credit Card', category: 'Productivity', notes: '' });
  };

  const togglePause = (id: string, active: boolean) => updateSubscription(id, { active: !active });

  const sorted = [...subscriptions].sort((a, b) => new Date(a.nextRenewal).getTime() - new Date(b.nextRenewal).getTime());

  return (
    <motion.div className="max-w-6xl mx-auto" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3"><CreditCard className="w-8 h-8 text-primary" /> Subscriptions</h1>
        <Button onClick={() => setModalOpen(true)} className="rounded-xl gap-2" style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}>
          <Plus className="w-4 h-4" /> Add Subscription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <GlassCard><p className="text-sm text-muted-foreground">Monthly Total</p><p className="text-3xl font-bold text-foreground">₹{monthlyTotal.toFixed(2)}</p></GlassCard>
        <GlassCard><p className="text-sm text-muted-foreground">Yearly Total</p><p className="text-3xl font-bold text-foreground">₹{yearlyTotal.toFixed(2)}</p></GlassCard>
        <GlassCard><p className="text-sm text-muted-foreground">Active Subscriptions</p><p className="text-3xl font-bold text-foreground">{activeSubs.length}</p></GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((sub, i) => {
          const daysUntil = differenceInDays(new Date(sub.nextRenewal), new Date());
          const urgency = daysUntil < 3 ? 'text-destructive' : daysUntil < 7 ? 'text-warning' : 'text-muted-foreground';
          return (
            <motion.div key={sub.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlassCard className={`hover-lift group ${!sub.active ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold" style={{ background: 'hsl(160,45%,48%,0.1)', color: 'hsl(160,45%,48%)' }}>
                    {sub.serviceName.charAt(0)}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button onClick={() => togglePause(sub.id, sub.active)} className="p-1.5 rounded-lg hover:bg-white/40">
                      {sub.active ? <Pause className="w-3.5 h-3.5 text-muted-foreground" /> : <Play className="w-3.5 h-3.5 text-success" />}
                    </button>
                    <button onClick={() => deleteSubscription(sub.id)} className="p-1.5 rounded-lg hover:bg-white/40"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                  </div>
                </div>
                <h3 className="font-semibold text-foreground text-lg">{sub.serviceName}</h3>
                <p className="text-2xl font-bold text-foreground mt-1">₹{sub.cost.toFixed(2)}<span className="text-sm font-normal text-muted-foreground"> / {sub.billingCycle.toLowerCase()}</span></p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={`text-sm font-medium ${urgency}`}>
                    {daysUntil < 0 ? 'Overdue' : daysUntil === 0 ? 'Renews today' : `${daysUntil}d until renewal`}
                  </span>
                  <span className="text-xs text-muted-foreground">{format(new Date(sub.nextRenewal), 'MMM d')}</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{sub.paymentMethod}</span>
                  {sub.category && <><span>·</span><span>{sub.category}</span></>}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="glass-strong rounded-2xl border-0 sm:max-w-md" style={{ animation: 'modal-in 0.3s ease-out' }}>
          <DialogHeader><DialogTitle className="font-display">Add Subscription</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Service name" value={form.serviceName} onChange={e => setForm(f => ({ ...f, serviceName: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs text-muted-foreground">Cost (₹)</label><Input type="number" step="0.01" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" /></div>
              <div><label className="text-xs text-muted-foreground">Billing</label>
                <select value={form.billingCycle} onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as Subscription['billingCycle'] }))} className="w-full rounded-xl border border-border/50 bg-white/50 px-3 py-2 text-sm">
                  <option value="Monthly">Monthly</option><option value="Yearly">Yearly</option><option value="Quarterly">Quarterly</option>
                </select>
              </div>
            </div>
            <div><label className="text-xs text-muted-foreground">Next Renewal</label><Input type="date" value={form.nextRenewal} onChange={e => setForm(f => ({ ...f, nextRenewal: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" /></div>
            <Input placeholder="Payment method" value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} className="rounded-xl bg-white/50 border-border/50" />
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

export default SubscriptionsPage;
