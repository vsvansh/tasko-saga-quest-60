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
import { Button } from '@/components/ui/button';
import { ListFilter, CalendarDays, LayoutDashboard, List, Star, BellRing, Bookmark, Menu, PanelLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useTheme } from '@/components/ThemeProvider';
import { useSidebarToggle } from '@/context/SidebarToggleContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

interface IndexProps {
  view?: 'list' | 'calendar' | 'dashboard' | 'starred' | 'settings' | 'analytics' | 'archived';
}

const Index: React.FC<IndexProps> = ({
  view = 'list'
}) => {
  const {
    getFilteredTasks,
    state,
    setView
  } = useTodo();
  const {
    theme
  } = useTheme();
  const {
    isOpen,
    toggle
  } = useSidebarToggle();
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [categoryFormOpen, setCategoryFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    setView(view);
  }, [view, setView]);

  useEffect(() => {
    const tasks = getFilteredTasks();
    if (searchQuery.trim() === '') {
      setFilteredTasks(tasks);
      return;
    }
    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = tasks.filter(task => task.title.toLowerCase().includes(lowercaseQuery) || task.description && task.description.toLowerCase().includes(lowercaseQuery));
    setFilteredTasks(filtered);
  }, [searchQuery, getFilteredTasks]);

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

  const handleViewChange = (viewValue: string) => {
    const newView = viewValue as 'list' | 'calendar' | 'dashboard' | 'starred' | 'settings' | 'archived' | 'analytics';
    setView(newView);
    navigate(`/${viewValue === 'list' ? '' : viewValue}`);
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

  const starredTasks = state.tasks.filter(task => task.starred);

  return <div className="min-h-screen flex flex-col lg:flex-row bg-background overflow-hidden">
      <AnimatePresence>
        {showWelcome && <motion.div className="fixed inset-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} transition={{
        duration: 0.5
      }}>
            <motion.div className="text-center" initial={{
          scale: 0.8,
          y: 20
        }} animate={{
          scale: 1,
          y: 0
        }} exit={{
          scale: 0.8,
          y: 20
        }} transition={{
          delay: 0.2,
          type: "spring"
        }}>
              <motion.h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" animate={{
            scale: [1, 1.1, 1]
          }} transition={{
            duration: 1.5,
            times: [0, 0.5, 1]
          }}>
                Anime Task Manager
              </motion.h1>
              <p className="text-muted-foreground">Your tasks, organized with style</p>
            </motion.div>
          </motion.div>}
      </AnimatePresence>
      
      <div className={cn("fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 ease-in-out", isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-64")}>
        <Sidebar onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} />
      </div>
      
      <motion.main className={cn("flex-1 px-4 md:px-6 pb-6 transition-all duration-300 ease-in-out", isOpen ? "lg:ml-64" : "ml-0")} initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5,
      delay: 0.2
    }}>
        <div className="max-w-5xl mx-auto pt-16 lg:pt-6 pb-20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              
              <h1 className="text-2xl md:text-3xl font-bold hidden md:block gradient-text">Anime Task Manager</h1>
            </div>
            <Profile userName="Anime Fan" />
          </div>
          
          <FilterBar onAddTask={handleAddTask} searchQuery={searchQuery} setSearchQuery={setSearchQuery} className="mb-8" />
          
          <div className="mb-6">
            <Tabs defaultValue={state.view} onValueChange={handleViewChange} value={state.view} className="space-y-6">
              <TabsList className="w-full gap-1 p-1 h-12 bg-muted/80 flex flex-wrap justify-center sm:flex-nowrap">
                <TabsTrigger value="list" className="flex-1 h-10 min-w-[80px]">
                  <List className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">List View</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex-1 h-10 min-w-[80px]">
                  <CalendarDays className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex-1 h-10 min-w-[80px]">
                  <LayoutDashboard className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="starred" className="flex-1 h-10 min-w-[80px]">
                  <Star className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Starred</span>
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
                    <motion.div whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="glass-card p-2 rounded-full cursor-pointer" onClick={handleNotificationClick}>
                      <BellRing size={18} className="text-muted-foreground" />
                    </motion.div>
                    <motion.div whileHover={{
                    scale: 1.05
                  }} whileTap={{
                    scale: 0.95
                  }} className="glass-card p-2 rounded-full cursor-pointer" onClick={handleBookmarkClick}>
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
                    {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
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
              
              <TabsContent value="starred" className="mt-0 pt-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">Starred Tasks</h2>
                    <Badge variant="outline" className="bg-primary/5">
                      {starredTasks.length} {starredTasks.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </div>
                </div>
                {starredTasks.length > 0 ? <AnimatePresence mode="wait">
                    <div className="space-y-4">
                      {starredTasks.map(task => <motion.div key={task.id} initial={{
                    opacity: 0,
                    y: 10
                  }} animate={{
                    opacity: 1,
                    y: 0
                  }} exit={{
                    opacity: 0,
                    y: -10
                  }} transition={{
                    duration: 0.2
                  }} className="border rounded-lg p-4 bg-background" onClick={() => handleEditTask(task)}>
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{task.title}</h3>
                              {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                            </div>
                            <Badge variant="outline" className={cn("ml-2", task.priority === 'high' ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : task.priority === 'medium' ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")}>
                              {task.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center mt-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                            <Star className="h-3 w-3 ml-3 mr-1 fill-yellow-400 text-yellow-400" />
                          </div>
                        </motion.div>)}
                    </div>
                  </AnimatePresence> : <div className="text-center py-10">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No starred tasks</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">You haven't starred any tasks yet. Star your important tasks to see them here.</p>
                    <Button onClick={handleAddTask}>Create a new task</Button>
                  </div>}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.main>
      
      <TaskForm open={taskFormOpen} onOpenChange={setTaskFormOpen} editingTask={editingTask} />
      
      <CategoryForm open={categoryFormOpen} onOpenChange={setCategoryFormOpen} editingCategory={editingCategory} />
    </div>;
};

const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default Index;
