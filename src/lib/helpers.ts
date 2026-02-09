import type { EventType, ExpenseCategory } from '@/types';

export function getEventTypeColor(type: EventType | string): string {
  const colors: Record<string, string> = {
    'Deep Work': 'hsl(220, 70%, 60%)',
    'Learning': 'hsl(140, 60%, 50%)',
    'Personal': 'hsl(280, 60%, 60%)',
    'Health': 'hsl(0, 70%, 60%)',
    'Meeting': 'hsl(30, 80%, 55%)',
    'Bills': 'hsl(40, 80%, 55%)',
    'Other': 'hsl(0, 0%, 55%)',
  };
  return colors[type] || colors['Other'];
}

export const EXPENSE_CATEGORIES: { name: ExpenseCategory; emoji: string; color: string }[] = [
  { name: 'Food & Dining', emoji: '🍔', color: 'hsl(30, 80%, 55%)' },
  { name: 'Transportation', emoji: '🚗', color: 'hsl(200, 70%, 50%)' },
  { name: 'Shopping', emoji: '🛍️', color: 'hsl(330, 70%, 55%)' },
  { name: 'Bills & Utilities', emoji: '💳', color: 'hsl(45, 80%, 50%)' },
  { name: 'Health & Fitness', emoji: '🏥', color: 'hsl(0, 70%, 55%)' },
  { name: 'Entertainment', emoji: '🎉', color: 'hsl(280, 65%, 55%)' },
  { name: 'Education', emoji: '📚', color: 'hsl(160, 60%, 45%)' },
  { name: 'Travel', emoji: '✈️', color: 'hsl(210, 75%, 55%)' },
  { name: 'Home', emoji: '🏠', color: 'hsl(25, 70%, 50%)' },
  { name: 'Other', emoji: '💼', color: 'hsl(0, 0%, 50%)' },
];

export function getCategoryInfo(category: string) {
  return EXPENSE_CATEGORIES.find(c => c.name === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

export function genId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export const EVENT_TYPES: EventType[] = ['Deep Work', 'Learning', 'Personal', 'Health', 'Meeting', 'Bills', 'Other'];
