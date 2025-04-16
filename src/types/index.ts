
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
  completedAt?: string;
  order: number;
  starred: boolean;
  pinned?: boolean;
  subtasks?: SubTask[];
  tags?: string[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  order: number;
}

export type TaskView = 'list' | 'board' | 'calendar' | 'dashboard' | 'starred' | 'settings' | 'analytics' | 'archived';

export interface AppState {
  tasks: Task[];
  categories: Category[];
  filter: 'all' | 'active' | 'completed';
  selectedCategory: string | null;
  view: TaskView;
  tags: string[];
}
