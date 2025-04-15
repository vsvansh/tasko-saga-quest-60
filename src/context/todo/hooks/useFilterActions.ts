
import { AppState, Task } from '@/types';

export const useFilterActions = (state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>) => {
  const setFilter = (filter: 'all' | 'active' | 'completed') => {
    setState(prev => ({ ...prev, filter }));
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

  return {
    setFilter,
    getFilteredTasks
  };
};
