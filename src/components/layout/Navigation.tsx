import { Link, useLocation } from 'react-router-dom';
import { Home, Target, Rocket, Lightbulb, CalendarDays, IndianRupee, CreditCard, Maximize, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import LifeOSLogo from '@/components/logo/LifeOSLogo';
import NavWindEffect from '@/components/layout/NavWindEffect';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/projects', label: 'Projects', icon: Rocket },
  { path: '/skills', label: 'Skills', icon: Lightbulb },
  { path: '/calendar', label: 'Calendar', icon: CalendarDays },
  { path: '/money', label: 'Money', icon: IndianRupee },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
];

const Navigation = () => {
  const location = useLocation();
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (location.pathname === '/focus') return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav h-16">
      <NavWindEffect />
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <LifeOSLogo size="small" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? 'bg-primary/15 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/30'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground font-mono hidden sm:block">
            {format(time, 'h:mm:ss a')}
          </span>
          <Link
            to="/focus"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, hsl(160, 45%, 48%), hsl(160, 50%, 38%))',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
            }}
          >
            <Maximize className="w-4 h-4" />
            <span className="hidden sm:inline">Focus</span>
          </Link>

          <button className="lg:hidden p-2 rounded-lg hover:bg-white/30 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden glass-strong absolute top-16 left-0 right-0 p-3 space-y-1" style={{ animation: 'modal-in 0.2s ease-out' }}>
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  active ? 'bg-primary/15 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
