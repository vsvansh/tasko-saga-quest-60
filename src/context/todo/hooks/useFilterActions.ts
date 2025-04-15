
import { AppState, TaskView } from '@/types';

export const useFilterActions = (state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>) => {
  const setFilter = (filter: 'all' | 'active' | 'completed') => {
    setState(prev => ({ ...prev, filter }));
  };

  const setView = (view: TaskView) => {
    setState(prev => ({ ...prev, view }));
  };

  const getFilteredTasks = () => {
    let filteredTasks = state.tasks;
    
    if (state.selectedCategory) {
      filteredTasks = filteredTasks.filter(task => 
        task.categoryIds.includes(state.selectedCategory as string)
      );
    }
    
    if (state.filter === 'active') {
      filteredTasks = filteredTasks.filter(task => !task.completed);
    } else if (state.filter === 'completed') {
      filteredTasks = filteredTasks.filter(task => task.completed);
    }
    
    return filteredTasks.sort((a, b) => {
      // First sort by pinned status
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      
      // Then by completion status
      if (!a.completed && b.completed) return -1;
      if (a.completed && !b.completed) return 1;
      
      // Then by order
      return a.order - b.order;
    });
  };

  return {
    setFilter,
    setView,
    getFilteredTasks
  };
};
