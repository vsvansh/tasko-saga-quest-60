import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Category, AppState } from '@/types';
import { toast } from "@/components/ui/use-toast"

interface TodoContextType {
  state: AppState;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'order'>) => void;
  updateTask: (task: Task) => void;
  completeTask: (taskId: string, completed: boolean) => void;
  deleteTask: (taskId: string) => void;
  starTask: (taskId: string, starred: boolean) => void;
  reorderTasks: (tasks: Task[]) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  reorderCategories: (categories: Category[]) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  getFilteredTasks: () => Task[];
  getCategoryById: (categoryId: string) => Category | undefined;
  pinTask: (taskId: string, isPinned: boolean) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialState: AppState = {
  tasks: [],
  categories: [
    { id: 'cat-1', name: 'Personal', color: 'anime-red', order: 0 },
    { id: 'cat-2', name: 'Work', color: 'anime-blue', order: 1 },
    { id: 'cat-3', name: 'Study', color: 'anime-yellow', order: 2 },
  ],
  filter: 'all',
  selectedCategory: null,
  view: 'list',
  tags: [],
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  // Load state from local storage on component mount
  useEffect(() => {
    try {
      const storedState = localStorage.getItem('todoAppState');
      if (storedState) {
        setState(JSON.parse(storedState));
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error);
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('todoAppState', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to local storage", error);
    }
  }, [state]);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'order' | 'starred'>) => {
    const newTask: Task = {
      id: uuidv4(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
      order: state.tasks.length,
      starred: false,
    };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    toast({
      title: "Task added",
      description: `Task "${task.title}" added successfully`,
    })
  };

  const updateTask = (task: Task) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => (t.id === task.id ? task : t)),
    }));
    toast({
      title: "Task updated",
      description: `Task "${task.title}" updated successfully`,
    })
  };

  const completeTask = (taskId: string, completed: boolean) => {
    setState(prev => {
      const updatedTasks = prev.tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed, 
              completedAt: completed ? new Date().toISOString() : undefined 
            } 
          : task
      );
      return {
        ...prev,
        tasks: updatedTasks
      };
    });
  };

  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
    }));
  };

  const starTask = (taskId: string, starred: boolean) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, starred } : task
      ),
    }));
  };

  const reorderTasks = (tasks: Task[]) => {
    setState(prev => ({ ...prev, tasks }));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: uuidv4(),
      ...category,
      order: state.categories.length,
    };
    setState(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const updateCategory = (category: Category) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.map(cat => (cat.id === category.id ? category : cat)),
    }));
  };

  const deleteCategory = (categoryId: string) => {
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category.id !== categoryId),
    }));
  };

  const reorderCategories = (categories: Category[]) => {
    setState(prev => ({ ...prev, categories }));
  };

  const setSelectedCategory = (categoryId: string | null) => {
    setState(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  const getFilteredTasks = () => {
    let filteredTasks = state.tasks;

    if (state.selectedCategory) {
      filteredTasks = filteredTasks.filter(task =>
        task.categoryIds.includes(state.selectedCategory)
      );
    }

    if (state.filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (state.filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }

    return filteredTasks.sort((a, b) => a.order - b.order);
  };

  const getCategoryById = (categoryId: string) => {
    return state.categories.find(category => category.id === categoryId);
  };

  const pinTask = (taskId: string, isPinned: boolean) => {
    setState(prev => {
      const updatedTasks = prev.tasks.map(task => 
        task.id === taskId ? { ...task, pinned: isPinned } : task
      );
      
      // Sort tasks so pinned ones are at the top
      updatedTasks.sort((a, b) => {
        // First sort by pinned status
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        
        // Then by completion status
        if (!a.completed && b.completed) return -1;
        if (a.completed && !b.completed) return 1;
        
        // Then by order
        return a.order - b.order;
      });
      
      return {
        ...prev,
        tasks: updatedTasks
      };
    });
  };

  const value = {
    state,
    addTask,
    updateTask,
    completeTask,
    deleteTask,
    starTask,
    reorderTasks,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setSelectedCategory,
    getFilteredTasks,
    getCategoryById,
    pinTask,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
export default TodoContext;
