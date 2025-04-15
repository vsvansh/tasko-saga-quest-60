
import { useEffect } from 'react';
import { AppState } from '@/types';

export const useLocalStorage = (state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>) => {
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

  useEffect(() => {
    try {
      localStorage.setItem('todoAppState', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to local storage", error);
    }
  }, [state]);
};
