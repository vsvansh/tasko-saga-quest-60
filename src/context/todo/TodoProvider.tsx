import React, { useState, useEffect } from 'react';
import TodoContext from './TodoContext';
import { initialState } from './initialState';
import { useTaskActions } from './hooks/useTaskActions';
import { useCategoryActions } from './hooks/useCategoryActions';
import { useFilterActions } from './hooks/useFilterActions';
import { useLocalStorage } from './hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { v4 as uuidv4 } from 'uuid';
import { Task, Category } from '@/types';

// Sample initial data for the app
const sampleCategories: Category[] = [
  { id: 'cat-1', name: 'Work', color: 'red', order: 0 },
  { id: 'cat-2', name: 'Personal', color: 'blue', order: 1 },
  { id: 'cat-3', name: 'Study', color: 'green', order: 2 },
  { id: 'cat-4', name: 'Health', color: 'yellow', order: 3 },
  { id: 'cat-5', name: 'Projects', color: 'purple', order: 4 }
];

const today = new Date();
const generateDate = (daysOffset: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString();
};

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Finish the draft and send it to the team for review',
    completed: true,
    dueDate: generateDate(0),
    priority: 'high',
    categoryIds: ['cat-1'],
    starred: true,
    createdAt: generateDate(-7),
    completedAt: generateDate(0),
    order: 0
  },
  {
    id: 'task-2',
    title: 'Morning workout',
    description: 'Complete 30-minute cardio session',
    completed: true,
    dueDate: generateDate(-1),
    priority: 'medium',
    categoryIds: ['cat-4'],
    starred: false,
    createdAt: generateDate(-8),
    completedAt: generateDate(-1),
    order: 1
  },
  {
    id: 'task-3',
    title: 'Study for certification',
    description: 'Review chapters 3-5 and complete practice tests',
    completed: false,
    dueDate: generateDate(2),
    priority: 'high',
    categoryIds: ['cat-3'],
    starred: true,
    createdAt: generateDate(-3),
    order: 2
  },
  {
    id: 'task-4',
    title: 'Weekly team meeting',
    description: 'Discuss project progress and roadblocks',
    completed: true,
    dueDate: generateDate(-5),
    priority: 'medium',
    categoryIds: ['cat-1'],
    starred: false,
    createdAt: generateDate(-10),
    completedAt: generateDate(-5),
    order: 3
  },
  {
    id: 'task-5',
    title: 'Client presentation',
    description: 'Prepare slides for the quarterly review',
    completed: false,
    dueDate: generateDate(1),
    priority: 'high',
    categoryIds: ['cat-1', 'cat-5'],
    starred: true,
    createdAt: generateDate(-2),
    order: 4
  },
  {
    id: 'task-6',
    title: 'Update personal blog',
    description: 'Write new article about productivity tips',
    completed: false,
    dueDate: generateDate(4),
    priority: 'low',
    categoryIds: ['cat-2'],
    starred: false,
    createdAt: generateDate(-1),
    order: 5
  },
  {
    id: 'task-7',
    title: 'Read technical documentation',
    description: 'Review new framework features',
    completed: true,
    dueDate: generateDate(-3),
    priority: 'medium',
    categoryIds: ['cat-3'],
    starred: false,
    createdAt: generateDate(-6),
    completedAt: generateDate(-3),
    order: 6
  },
  {
    id: 'task-8',
    title: 'Quarterly planning',
    description: 'Define objectives and key results for next quarter',
    completed: false,
    dueDate: generateDate(7),
    priority: 'high',
    categoryIds: ['cat-1', 'cat-5'],
    starred: true,
    createdAt: generateDate(0),
    order: 7
  },
  {
    id: 'task-9',
    title: 'Health checkup',
    description: 'Annual medical examination',
    completed: false,
    dueDate: generateDate(5),
    priority: 'medium',
    categoryIds: ['cat-2', 'cat-4'],
    starred: false,
    createdAt: generateDate(-1),
    order: 8
  },
  {
    id: 'task-10',
    title: 'Project milestone review',
    description: 'Evaluate progress and update timeline',
    completed: true,
    dueDate: generateDate(-1),
    priority: 'high',
    categoryIds: ['cat-1', 'cat-5'],
    starred: false,
    createdAt: generateDate(-4),
    completedAt: generateDate(-1),
    order: 9
  }
];

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedState = localStorage.getItem('todoAppState');
      if (storedState) {
        return JSON.parse(storedState);
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error);
    }
    
    // If no stored state or error, initialize with sample data
    return {
      ...initialState,
      categories: sampleCategories,
      tasks: sampleTasks
    };
  });
  
  // Initialize hooks for different concerns
  useLocalStorage(state, setState);
  const taskActions = useTaskActions(state, setState);
  const categoryActions = useCategoryActions(state, setState);
  const filterActions = useFilterActions(state, setState);

  // Check if all tasks are completed to trigger confetti
  useEffect(() => {
    if (state.tasks.length > 0 && state.tasks.every(task => task.completed)) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast({
        title: "All tasks completed!",
        description: "🎉 Congratulations! You've completed all your tasks!"
      });
    }
  }, [state.tasks]);

  const value = {
    state,
    ...taskActions,
    ...categoryActions,
    ...filterActions,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
