
import { AppState } from '@/types';

export const initialState: AppState = {
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
