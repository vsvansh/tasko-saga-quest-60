
import { Task, Category, AppState } from '@/types';

export interface TodoContextType {
  state: AppState;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'order' | 'starred'>) => void;
  updateTask: (task: Task) => void;
  completeTask: (taskId: string, completed: boolean) => void;
  deleteTask: (taskId: string) => void;
  starTask: (taskId: string, starred: boolean) => void;
  reorderTasks: (tasks: Task[]) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (categories: Category[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  getFilteredTasks: () => Task[];
  getCategoryById: (categoryId: string) => Category | undefined;
  pinTask: (taskId: string, isPinned: boolean) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
}
