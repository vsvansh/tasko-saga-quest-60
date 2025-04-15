
import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import FilterBar from '@/components/FilterBar';
import TaskForm from '@/components/TaskForm';
import CategoryForm from '@/components/CategoryForm';
import { Task, Category } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const { getFilteredTasks } = useTodo();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);

  // Filter tasks by search query
  useEffect(() => {
    const tasks = getFilteredTasks();
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
      return;
    }
    
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(
      task => 
        task.title.toLowerCase().includes(lowercaseQuery) || 
        (task.description && task.description.toLowerCase().includes(lowercaseQuery))
    );
    
    setFilteredTasks(filtered);
  }, [searchQuery, getFilteredTasks]);

  // Hide welcome message after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="text-center"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <motion.h1 
                className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1.5, times: [0, 0.5, 1] }}
              >
                Anime Task Manager
              </motion.h1>
              <p className="text-muted-foreground">Your tasks, organized with style</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Sidebar
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
      />
      
      <motion.main 
        className="flex-1 px-6 lg:ml-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto pt-16 lg:pt-8 pb-20">
          <FilterBar 
            onAddTask={handleAddTask}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <AnimatePresence mode="wait">
            <TaskList onEditTask={handleEditTask} />
          </AnimatePresence>
        </div>
      </motion.main>
      
      <TaskForm
        open={taskFormOpen}
        onOpenChange={setTaskFormOpen}
        editingTask={editingTask}
      />
      
      <CategoryForm
        open={categoryFormOpen}
        onOpenChange={setCategoryFormOpen}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default Index;
