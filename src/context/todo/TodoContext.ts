
import { createContext } from 'react';
import { TodoContextType } from './types';

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export default TodoContext;
