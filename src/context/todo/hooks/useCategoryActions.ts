
import { v4 as uuidv4 } from 'uuid';
import { Category, AppState } from '@/types';

export const useCategoryActions = (state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>) => {
  const addCategory = (category: Omit<Category, 'id' | 'order'>) => {
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

  const getCategoryById = (categoryId: string) => {
    return state.categories.find(category => category.id === categoryId);
  };

  return {
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    setSelectedCategory,
    getCategoryById
  };
};
