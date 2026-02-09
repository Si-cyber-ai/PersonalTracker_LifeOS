import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard = ({ children, className, onClick }: GlassCardProps) => (
  <div className={cn('glass rounded-2xl p-6', className)} onClick={onClick}>
    {children}
  </div>
);

export default GlassCard;
