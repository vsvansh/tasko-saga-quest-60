
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
  { id: 'cat-4', name: 'Health', color: 'yellow', order: 3 }
];

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Complete project proposal',
    description: 'Finish the draft and send it to the team for review',
    completed: false,
    dueDate: nextWeek.toISOString(),
    priority: 'high',
    categoryIds: ['cat-1'],
    starred: true,
    createdAt: new Date(today).setDate(today.getDate() - 7),
    order: 0
  },
  {
    id: 'task-2',
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and fruits',
    completed: false,
    dueDate: tomorrow.toISOString(),
    priority: 'medium',
    categoryIds: ['cat-2'],
    starred: false,
    createdAt: new Date(today).setDate(today.getDate() - 5),
    order: 1
  },
  {
    id: 'task-3',
    title: 'Study for exam',
    description: 'Review chapters 3-5 and solve practice problems',
    completed: false,
    dueDate: nextWeek.toISOString(),
    priority: 'high',
    categoryIds: ['cat-3'],
    starred: true,
    createdAt: new Date(today).setDate(today.getDate() - 3),
    order: 2
  },
  {
    id: 'task-4',
    title: 'Morning jog',
    description: 'Run for 30 minutes in the park',
    completed: true,
    dueDate: today.toISOString(),
    priority: 'low',
    categoryIds: ['cat-4'],
    starred: false,
    createdAt: new Date(today).setDate(today.getDate() - 2),
    order: 3
  },
  {
    id: 'task-5',
    title: 'Team meeting',
    description: 'Discuss project progress and assign new tasks',
    completed: false,
    dueDate: tomorrow.toISOString(),
    priority: 'medium',
    categoryIds: ['cat-1'],
    starred: false,
    createdAt: new Date(today).setDate(today.getDate() - 1),
    order: 4
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
