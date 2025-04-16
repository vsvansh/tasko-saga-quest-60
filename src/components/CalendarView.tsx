import React, { useState, useEffect } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getPriorityColor } from '@/lib/utils';
import { format, isSameDay, addMonths, subMonths, startOfMonth, isSameMonth, addWeeks, subWeeks, addDays, subDays } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, CalendarRange,
  Moon, Sun, Monitor,
  Settings
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/components/ThemeProvider';
import { WeekView, DayView, GridView } from './CalendarViewComponents';
import { motion, AnimatePresence } from 'framer-motion';

const CalendarView: React.FC = () => {
  const { state } = useTodo();
  const { theme, setTheme } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [jumpDate, setJumpDate] = useState('');
  const [showJumpDatePopover, setShowJumpDatePopover] = useState(false);
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [showWeekends, setShowWeekends] = useState(true);
  const [taskDetailId, setTaskDetailId] = useState<string | null>(null);
  
  const getTasksForDate = (date: Date): Task[] => {
    if (!date) return [];
    
    return state.tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const tasksForSelectedDate = selectedDate 
    ? getTasksForDate(selectedDate) 
    : [];

  const navigateToPreviousUnit = () => {
    if (viewMode === 'month') {
      setCurrentMonth(prev => subMonths(prev, 1));
    } else if (viewMode === 'week') {
      const newDate = subWeeks(selectedDate || new Date(), 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    } else if (viewMode === 'day') {
      const newDate = subDays(selectedDate || new Date(), 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  };

  const navigateToNextUnit = () => {
    if (viewMode === 'month') {
      setCurrentMonth(prev => addMonths(prev, 1));
    } else if (viewMode === 'week') {
      const newDate = addWeeks(selectedDate || new Date(), 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    } else if (viewMode === 'day') {
      const newDate = addDays(selectedDate || new Date(), 1);
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  };

  const navigateToPreviousYear = () => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setFullYear(newDate.getFullYear() - 1);
    
    if (viewMode === 'month') {
      setCurrentMonth(startOfMonth(newDate));
    } else {
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  };

  const navigateToNextYear = () => {
    const newDate = new Date(selectedDate || new Date());
    newDate.setFullYear(newDate.getFullYear() + 1);
    
    if (viewMode === 'month') {
      setCurrentMonth(startOfMonth(newDate));
    } else {
      setSelectedDate(newDate);
      setCurrentMonth(newDate);
    }
  };

  const navigateToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const handleJumpToDate = () => {
    const date = new Date(jumpDate);
    if (isNaN(date.getTime())) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date",
        variant: "destructive"
      });
      return;
    }
    setSelectedDate(date);
    setCurrentMonth(date);
    setShowJumpDatePopover(false);
    toast({
      title: "Date selected",
      description: `Jumped to ${format(date, 'PPP')}`
    });
  };

  const handleAppearanceChange = (mode: 'light' | 'dark' | 'system') => {
    setTheme(mode);
    
    toast({
      title: "Appearance changed",
      description: `Calendar view set to ${mode} mode`
    });
  };
  
  const handleSettingsSave = () => {
    toast({
      title: "Settings saved",
      description: "Your calendar preferences have been updated"
    });
    setShowSettingsDialog(false);
  };

  const handleTaskClick = (taskId: string) => {
    setTaskDetailId(taskId === taskDetailId ? null : taskId);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      if (!isSameMonth(date, currentMonth)) {
        setCurrentMonth(date);
      }
      
      toast({
        title: "Date selected",
        description: `Selected ${format(date, 'PPP')}`
      });
      
      console.log('Tasks for selected date:', getTasksForDate(date));
    }
  };

  const handleMonthChange = (newMonth: Date) => {
    setCurrentMonth(newMonth);
  };

  const navigationButtons = (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={navigateToPreviousYear}
        title="Previous year"
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={navigateToPreviousUnit}
        title={`Previous ${viewMode}`}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={navigateToToday}
      >
        Today
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={navigateToNextUnit}
        title={`Next ${viewMode}`}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={navigateToNextYear}
        title="Next year"
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
      
      <Popover open={showJumpDatePopover} onOpenChange={setShowJumpDatePopover}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="ml-2">
            <CalendarRange className="mr-2 h-4 w-4" />
            Jump to Date
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 pointer-events-auto">
          <div className="flex flex-col gap-2">
            <Input
              type="date"
              value={jumpDate}
              onChange={(e) => setJumpDate(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleJumpToDate}>Go to Date</Button>
          </div>
        </PopoverContent>
      </Popover>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode('day')}
          >
            Day
          </Button>
        </div>
        
        <div className="ml-2">
          <Button
            variant={displayMode === 'list' ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode('list')}
            className="mr-1"
          >
            List
          </Button>
          <Button
            variant={displayMode === 'grid' ? "default" : "outline"}
            size="sm"
            onClick={() => setDisplayMode('grid')}
          >
            Grid
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="pointer-events-auto">
            <DropdownMenuItem onClick={() => handleAppearanceChange('light')}>
              <Sun className="h-4 w-4 mr-2" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAppearanceChange('dark')}>
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAppearanceChange('system')}>
              <Monitor className="h-4 w-4 mr-2" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const getDayClassName = (date: Date) => {
    const tasks = getTasksForDate(date);
    if (tasks.length === 0) return "";
    
    const hasHighPriority = tasks.some(task => task.priority === 'high' && !task.completed);
    const hasMediumPriority = tasks.some(task => task.priority === 'medium' && !task.completed);
    const hasOverdueTasks = tasks.some(task => 
      !task.completed && 
      task.dueDate && 
      new Date(task.dueDate) < new Date()
    );
    
    if (hasOverdueTasks) return "bg-red-100 dark:bg-red-900/30";
    if (hasHighPriority) return "bg-orange-100 dark:bg-orange-900/30";
    if (hasMediumPriority) return "bg-yellow-100 dark:bg-yellow-900/30";
    
    return "bg-green-100 dark:bg-green-900/30";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {viewMode === 'month' && (
        <>
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4">
                {navigationButtons}
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
                  className="mx-auto pointer-events-auto"
                  month={currentMonth}
                  onMonthChange={handleMonthChange}
                  modifiersClassNames={{
                    selected: "bg-primary text-primary-foreground",
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const tasks = getTasksForDate(date);
                      const className = getDayClassName(date);
                      
                      return (
                        <div 
                          className={cn(
                            "relative h-9 w-9 flex items-center justify-center",
                            className
                          )}
                        >
                          {date.getDate()}
                          {tasks.length > 0 && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                          )}
                        </div>
                      );
                    }
                  }}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 overflow-auto max-h-[calc(100vh-250px)]">
                {displayMode === 'list' ? (
                  <div className="space-y-4">
                    {tasksForSelectedDate.length > 0 ? tasksForSelectedDate.map(task => (
                      <motion.div 
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleTaskClick(task.id)}
                        className={cn(
                          "p-4 rounded-md border cursor-pointer",
                          task.completed ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div className={cn("flex-1", task.completed && "line-through text-muted-foreground")}>
                            <h3 className="font-medium mb-2">{task.title}</h3>
                            
                            <AnimatePresence>
                              {taskDetailId === task.id && task.description && (
                                <motion.p 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-sm text-muted-foreground mt-1"
                                >
                                  {task.description}
                                </motion.p>
                              )}
                            </AnimatePresence>
                            
                            {taskDetailId !== task.id && task.description && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "ml-2 whitespace-nowrap",
                              getPriorityColor(task.priority).replace('text-', 'bg-').replace('anime-', '') + "/20",
                              getPriorityColor(task.priority)
                            )}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      </motion.div>
                    )) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>No tasks scheduled for this date</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <GridView tasksForSelectedDate={tasksForSelectedDate} />
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {viewMode === 'week' && (
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-4">
              {navigationButtons}
              <WeekView 
                selectedDate={selectedDate}
                tasks={state.tasks}
                onSelectDate={setSelectedDate}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === 'day' && (
        <div className="md:col-span-3">
          <Card>
            <CardContent className="p-4">
              {navigationButtons}
              <DayView 
                selectedDate={selectedDate}
                tasks={state.tasks}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
