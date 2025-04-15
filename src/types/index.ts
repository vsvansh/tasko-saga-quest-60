
export type Priority = 'high' | 'medium' | 'low' | 'none';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  priority: Priority;
  categoryIds: string[];
  createdAt: string;
  order: number;
  starred: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface AppState {
  tasks: Task[];
  categories: Category[];
  filter: 'all' | 'active' | 'completed';
  selectedCategory: string | null;
}
