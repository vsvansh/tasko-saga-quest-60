
import React, { useState } from 'react';
import TodoContext from './TodoContext';
import { initialState } from './initialState';
import { useTaskActions } from './hooks/useTaskActions';
import { useCategoryActions } from './hooks/useCategoryActions';
import { useFilterActions } from './hooks/useFilterActions';
import { useLocalStorage } from './hooks/useLocalStorage';

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  // Initialize hooks for different concerns
  useLocalStorage(state, setState);
  const taskActions = useTaskActions(state, setState);
  const categoryActions = useCategoryActions(state, setState);
  const filterActions = useFilterActions(state, setState);

  const value = {
    state,
    ...taskActions,
    ...categoryActions,
    ...filterActions,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
