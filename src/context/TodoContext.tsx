
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Task, Category, AppState, Priority } from '@/types';
import { generateId, defaultCategories, defaultTasks } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

type TodoAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'order'> }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'COMPLETE_TASK'; payload: { id: string; completed: boolean } }
  | { type: 'STAR_TASK'; payload: { id: string; starred: boolean } }
  | { type: 'REORDER_TASKS'; payload: Task[] }
  | { type: 'ADD_CATEGORY'; payload: Omit<Category, 'id' | 'order'> }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'REORDER_CATEGORIES'; payload: Category[] }
  | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
  | { type: 'SET_SELECTED_CATEGORY'; payload: string | null };

type TodoContextType = {
  state: AppState;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  completeTask: (id: string, completed: boolean) => void;
  starTask: (id: string, starred: boolean) => void;
  reorderTasks: (tasks: Task[]) => void;
  addCategory: (category: Omit<Category, 'id' | 'order'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (categories: Category[]) => void;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  setSelectedCategory: (id: string | null) => void;
  getFilteredTasks: () => Task[];
  getCategoryById: (id: string) => Category | undefined;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const initialState: AppState = {
  tasks: [],
  categories: [],
  filter: 'all',
  selectedCategory: null,
};

function todoReducer(state: AppState, action: TodoAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        id: generateId(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        order: state.tasks.filter(t => 
          t.categoryIds.some(c => action.payload.categoryIds.includes(c))
        ).length,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'COMPLETE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, completed: action.payload.completed }
            : task
        ),
      };
    case 'STAR_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, starred: action.payload.starred }
            : task
        ),
      };
    case 'REORDER_TASKS':
      return {
        ...state,
        tasks: action.payload,
      };
    case 'ADD_CATEGORY': {
      const newCategory: Category = {
        id: generateId(),
        ...action.payload,
        order: state.categories.length,
      };
      return {
        ...state,
        categories: [...state.categories, newCategory],
      };
    }
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY': {
      const filteredTasks = state.tasks.map(task => ({
        ...task,
        categoryIds: task.categoryIds.filter(id => id !== action.payload)
      }));
      
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        tasks: filteredTasks,
        selectedCategory: state.selectedCategory === action.payload ? null : state.selectedCategory,
      };
    }
    case 'REORDER_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_FILTER':
      return {
        ...state,
        filter: action.payload,
      };
    case 'SET_SELECTED_CATEGORY':
      return {
        ...state,
        selectedCategory: action.payload,
      };
    default:
      return state;
  }
}

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem('anime-todo-tasks');
    const savedCategories = localStorage.getItem('anime-todo-categories');
    
    if (savedTasks && savedCategories) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        const parsedCategories = JSON.parse(savedCategories);
        
        dispatch({ type: 'REORDER_TASKS', payload: parsedTasks });
        dispatch({ type: 'REORDER_CATEGORIES', payload: parsedCategories });
      } catch (e) {
        console.error('Error parsing saved data:', e);
        // Initialize with default data if parsing fails
        dispatch({ type: 'REORDER_TASKS', payload: defaultTasks });
        dispatch({ type: 'REORDER_CATEGORIES', payload: defaultCategories });
      }
    } else {
      // Initialize with default data if no saved data exists
      dispatch({ type: 'REORDER_TASKS', payload: defaultTasks });
      dispatch({ type: 'REORDER_CATEGORIES', payload: defaultCategories });
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('anime-todo-tasks', JSON.stringify(state.tasks));
    localStorage.setItem('anime-todo-categories', JSON.stringify(state.categories));
  }, [state.tasks, state.categories]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'order'>) => {
    dispatch({ type: 'ADD_TASK', payload: task });
    toast({
      title: "Task added!",
      description: `"${task.title}" has been added to your list`,
    });
  };

  const updateTask = (task: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: task });
  };

  const deleteTask = (id: string) => {
    const taskToDelete = state.tasks.find(task => task.id === id);
    dispatch({ type: 'DELETE_TASK', payload: id });
    
    if (taskToDelete) {
      toast({
        title: "Task deleted",
        description: `"${taskToDelete.title}" has been removed`,
        variant: "destructive",
      });
    }
  };

  const completeTask = (id: string, completed: boolean) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { id, completed } });
    
    const task = state.tasks.find(t => t.id === id);
    if (task && completed) {
      toast({
        title: "Task completed! 🎉",
        description: `"${task.title}" marked as complete`,
      });
    }
  };

  const starTask = (id: string, starred: boolean) => {
    dispatch({ type: 'STAR_TASK', payload: { id, starred } });
  };

  const reorderTasks = (tasks: Task[]) => {
    dispatch({ type: 'REORDER_TASKS', payload: tasks });
  };

  const addCategory = (category: Omit<Category, 'id' | 'order'>) => {
    dispatch({ type: 'ADD_CATEGORY', payload: category });
    toast({
      title: "Category created",
      description: `"${category.name}" category has been created`,
    });
  };

  const updateCategory = (category: Category) => {
    dispatch({ type: 'UPDATE_CATEGORY', payload: category });
  };

  const deleteCategory = (id: string) => {
    const categoryToDelete = state.categories.find(cat => cat.id === id);
    dispatch({ type: 'DELETE_CATEGORY', payload: id });
    
    if (categoryToDelete) {
      toast({
        title: "Category deleted",
        description: `"${categoryToDelete.name}" category has been removed`,
        variant: "destructive",
      });
    }
  };

  const reorderCategories = (categories: Category[]) => {
    dispatch({ type: 'REORDER_CATEGORIES', payload: categories });
  };

  const setFilter = (filter: 'all' | 'active' | 'completed') => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const setSelectedCategory = (id: string | null) => {
    dispatch({ type: 'SET_SELECTED_CATEGORY', payload: id });
  };

  const getFilteredTasks = () => {
    let filteredTasks = [...state.tasks];
    
    // Filter by selected category
    if (state.selectedCategory) {
      filteredTasks = filteredTasks.filter(task => 
        task.categoryIds.includes(state.selectedCategory!)
      );
    }
    
    // Filter by completion status
    switch (state.filter) {
      case 'active':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      default:
        break;
    }
    
    // Sort by order
    filteredTasks.sort((a, b) => a.order - b.order);
    
    return filteredTasks;
  };

  const getCategoryById = (id: string) => {
    return state.categories.find(category => category.id === id);
  };

  return (
    <TodoContext.Provider
      value={{
        state,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        starTask,
        reorderTasks,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        setFilter,
        setSelectedCategory,
        getFilteredTasks,
        getCategoryById,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};
