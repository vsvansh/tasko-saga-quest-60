
import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn, getPriorityColor } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const CalendarView: React.FC = () => {
  const { state } = useTodo();
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  
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
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="mx-auto"
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
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-medium">
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </h2>
            </div>
            
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
