import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import GlassCard from '@/components/layout/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';
import LifeOSLogo from '@/components/logo/LifeOSLogo';

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = mode === 'login' 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
      } else {
        if (mode === 'signup') {
          setError('Check your email to confirm your account!');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <LifeOSLogo size="large" />
          </div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Welcome to LifeOS</h1>
          <p className="text-muted-foreground">Your personal productivity companion</p>
        </div>

        <GlassCard className="p-8">
          <div className="flex gap-2 mb-6">
            <Button
              variant={mode === 'login' ? 'default' : 'outline'}
              onClick={() => { setMode('login'); setError(''); }}
              className="flex-1 rounded-xl"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button
              variant={mode === 'signup' ? 'default' : 'outline'}
              onClick={() => { setMode('signup'); setError(''); }}
              className="flex-1 rounded-xl"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl bg-white/50 border-border/50"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl bg-white/50 border-border/50"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl"
              style={{ background: 'linear-gradient(135deg, hsl(160,45%,48%), hsl(160,50%,38%))', color: 'white' }}
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border/50">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full rounded-xl text-muted-foreground"
            >
              Continue without account (demo mode)
            </Button>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-muted-foreground mt-4">
          {mode === 'login' 
            ? "Don't have an account? Click Sign Up above."
            : 'Already have an account? Click Login above.'}
        </p>
      </motion.div>
    </div>
  );
};

export default AuthPage;
