import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { Task, AppState } from '@/types';

export const useTaskActions = (state: AppState, setState: React.Dispatch<React.SetStateAction<AppState>>) => {
    const addTask = (task: Omit<Task, 'id' | 'completed' | 'createdAt' | 'order' | 'starred'>) => {
        const newTask: Task = {
            id: uuidv4(),
            ...task,
            completed: false,
            createdAt: new Date().toISOString(),
            order: state.tasks.length,
            starred: false
        };
        setState((prev) => ({
            ...prev,
            tasks: [
                ...prev.tasks,
                newTask
            ]
        }));
        toast({
            title: "Task added",
            description: `Task "${task.title}" added successfully`
        });
    };

    const updateTask = (task: Task) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(t => (t.id === task.id ? task : t)),
        }));
        toast({
            title: "Task updated",
            description: `Task "${task.title}" updated successfully`,
        });
    };

    const completeTask = (taskId: string, completed: boolean) => {
        setState(prev => {
            const updatedTasks = prev.tasks.map(task => 
                task.id === taskId 
                    ? { 
                        ...task, 
                        completed, 
                        completedAt: completed ? new Date().toISOString() : undefined 
                    } 
                    : task
            );
            return {
                ...prev,
                tasks: updatedTasks
            };
        });
    };

    const deleteTask = (taskId: string) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== taskId),
        }));
    };

    const starTask = (taskId: string, starred: boolean) => {
        setState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, starred } : task
            ),
        }));
    };

    const reorderTasks = (tasks: Task[]) => {
        setState(prev => ({ ...prev, tasks }));
    };

    const pinTask = (taskId: string, isPinned: boolean) => {
        setState(prev => {
            const updatedTasks = prev.tasks.map(task => 
                task.id === taskId ? { ...task, pinned: isPinned } : task
            );
            
            updatedTasks.sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                
                if (!a.completed && b.completed) return -1;
                if (a.completed && !b.completed) return 1;
                
                return a.order - b.order;
            });
            
            return {
                ...prev,
                tasks: updatedTasks
            };
        });
    };

    return {
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        starTask,
        reorderTasks,
        pinTask
    };
};
