
import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import FilterBar from '@/components/FilterBar';
import TaskForm from '@/components/TaskForm';
import CategoryForm from '@/components/CategoryForm';
import DashboardView from '@/components/DashboardView';
import CalendarView from '@/components/CalendarView';
import Profile from '@/components/Profile';
import { Task, Category } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AnimatePresence, motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListFilter, CalendarDays, LayoutDashboard, List, Star, BellRing, Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const { getFilteredTasks, state, setView } = useTodo();
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

  const handleViewChange = (view: string) => {
    setView(view as 'list' | 'calendar' | 'dashboard');
  };
  
  const handleNotificationClick = () => {
    toast({
      title: "Notifications",
      description: "You have no new notifications"
    });
  };
  
  const handleBookmarkClick = () => {
    toast({
      title: "Bookmarked",
      description: "Current view has been bookmarked"
    });
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
        className="flex-1 px-4 md:px-6 lg:px-8 lg:ml-64 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="max-w-5xl mx-auto pt-16 lg:pt-6 pb-20">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold hidden md:block gradient-text">Anime Task Manager</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden md:flex items-center gap-1 px-3 py-1 bg-primary/5">
                <Star size={12} className="text-anime-yellow" />
                <span>Pro</span>
              </Badge>
              <Profile userName="Anime Fan" />
            </div>
          </div>
          
          <FilterBar 
            onAddTask={handleAddTask}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            className="mb-8"
          />
          
          <div className="mb-6">
            <Tabs defaultValue={state.view} onValueChange={handleViewChange} value={state.view} className="space-y-6">
              <TabsList className="w-full gap-1 p-1 h-12 bg-muted/80">
                <TabsTrigger value="list" className="flex-1 h-10">
                  <List className="w-4 h-4 mr-2" />
                  List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex-1 h-10">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex-1 h-10">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="list" className="mt-0 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Your Tasks</h2>
                    <Badge variant="outline" className="bg-primary/5">
                      {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card p-2 rounded-full cursor-pointer"
                      onClick={handleNotificationClick}
                    >
                      <BellRing size={18} className="text-muted-foreground" />
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="glass-card p-2 rounded-full cursor-pointer"
                      onClick={handleBookmarkClick}
                    >
                      <Bookmark size={18} className="text-muted-foreground" />
                    </motion.div>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <TaskList onEditTask={handleEditTask} />
                </AnimatePresence>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-0 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Calendar View</h2>
                  <Badge variant="outline" className="bg-primary/5">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Badge>
                </div>
                <CalendarView />
              </TabsContent>
              
              <TabsContent value="dashboard" className="mt-0 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
                  <Badge variant="outline" className="bg-primary/5">
                    Last 30 days
                  </Badge>
                </div>
                <DashboardView />
              </TabsContent>
            </Tabs>
          </div>
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
