
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: string | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function isOverdue(date: string | undefined): boolean {
  if (!date) return false;
  const dueDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-anime-red';
    case 'medium':
      return 'text-anime-yellow';
    case 'low':
      return 'text-anime-green';
    default:
      return 'text-gray-400';
  }
}

export function getCategoryColor(color: string): string {
  switch (color) {
    case 'purple':
      return 'bg-anime-primary text-white';
    case 'pink':
      return 'bg-anime-secondary text-white';
    case 'blue':
      return 'bg-anime-blue text-white';
    case 'red':
      return 'bg-anime-red text-white';
    case 'yellow':
      return 'bg-anime-yellow text-white';
    case 'green':
      return 'bg-anime-green text-white';
    default:
      return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
}

export const defaultCategories = [
  { id: 'cat-1', name: 'Personal', color: 'purple', order: 0 },
  { id: 'cat-2', name: 'Work', color: 'blue', order: 1 },
  { id: 'cat-3', name: 'Shopping', color: 'green', order: 2 },
  { id: 'cat-4', name: 'Important', color: 'red', order: 3 },
];

export const defaultTasks = [
  {
    id: 'task-1',
    title: 'Watch new anime episode',
    description: 'New episode of My Hero Academia is out!',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    priority: 'high' as Priority,
    categoryIds: ['cat-1'],
    createdAt: new Date().toISOString(),
    order: 0,
    starred: true,
  },
  {
    id: 'task-2',
    title: 'Finish project report',
    description: 'Complete the quarterly report for the team meeting',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    priority: 'medium' as Priority,
    categoryIds: ['cat-2'],
    createdAt: new Date().toISOString(),
    order: 0,
    starred: false,
  },
  {
    id: 'task-3',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, and fruit',
    completed: true,
    dueDate: new Date().toISOString(),
    priority: 'low' as Priority,
    categoryIds: ['cat-3'],
    createdAt: new Date().toISOString(),
    order: 0,
    starred: false,
  },
  {
    id: 'task-4',
    title: 'Pay rent',
    description: 'Transfer money for this month\'s rent',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    priority: 'high' as Priority,
    categoryIds: ['cat-1', 'cat-4'],
    createdAt: new Date().toISOString(),
    order: 1,
    starred: true,
  },
];
