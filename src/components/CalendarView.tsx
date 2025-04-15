import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, getPriorityColor } from '@/lib/utils';
import { format, isSameDay, addMonths, subMonths, startOfMonth } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Calendar, Clock, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, CalendarRange,
  ArrowUpDown, List, Grid
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const CalendarView: React.FC = () => {
  const { state } = useTodo();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [jumpDate, setJumpDate] = useState('');
  const [showJumpDatePopover, setShowJumpDatePopover] = useState(false);
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');
  
  // Function to get tasks for a specific date
  const getTasksForDate = (date: Date): Task[] => {
    return state.tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };
  
  // Get tasks for selected date
  const tasksForSelectedDate = selectedDate 
    ? getTasksForDate(selectedDate) 
    : [];

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

  const navigationButtons = (
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentMonth(prev => startOfMonth(subMonths(prev, 12)))}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentMonth(prev => subMonths(prev, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => setCurrentMonth(new Date())}
      >
        Today
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentMonth(prev => addMonths(prev, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setCurrentMonth(prev => startOfMonth(addMonths(prev, 12)))}
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
        <PopoverContent className="w-80">
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('month')}
          className={cn(viewMode === 'month' && "bg-primary text-primary-foreground")}
        >
          Month
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('week')}
          className={cn(viewMode === 'week' && "bg-primary text-primary-foreground")}
        >
          Week
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode('day')}
          className={cn(viewMode === 'day' && "bg-primary text-primary-foreground")}
        >
          Day
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDisplayMode(prev => prev === 'list' ? 'grid' : 'list')}
        >
          {displayMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  // Function to generate a class name for days with tasks
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
      <div className="md:col-span-2">
        <Card>
          <CardContent className="p-4">
            {navigationButtons}
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
              month={currentMonth}
              modifiersClassNames={{
                selected: "bg-primary text-primary-foreground",
              }}
              modifiers={{
                taskDay: (date) => getTasksForDate(date).length > 0
              }}
              modifiersStyles={{
                taskDay: {
                  fontWeight: "bold"
                }
              }}
              components={{
                DayContent: ({ date, ...props }) => {
                  const tasks = getTasksForDate(date);
                  const className = getDayClassName(date);
                  
                  return (
                    <div 
                      className={cn(
                        "relative h-9 w-9 flex items-center justify-center",
                        className
                      )}
                      {...props}
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
          <CardContent className="p-4">
            {tasksForSelectedDate.length > 0 ? (
              <div className="space-y-3">
                {tasksForSelectedDate.map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-3 rounded-md border",
                      task.completed ? "bg-gray-50 dark:bg-gray-800/50" : "bg-white dark:bg-gray-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className={cn(task.completed && "line-through text-muted-foreground")}>
                        <h3 className="font-medium">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "ml-2",
                          getPriorityColor(task.priority).replace('text-', 'bg-').replace('anime-', '') + "/20",
                          getPriorityColor(task.priority)
                        )}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks scheduled for this date</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
