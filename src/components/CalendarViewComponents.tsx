
import React, { useState } from 'react';
import { format, isSameMonth, addDays, startOfWeek, isWithinInterval, isToday } from 'date-fns';
import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const WeekView: React.FC<{
  selectedDate: Date | undefined;
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}> = ({ selectedDate, tasks, onSelectDate }) => {
  const currentDate = selectedDate || new Date();
  const startDate = startOfWeek(currentDate);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  
  // Generate array of dates for the week
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDates.map((date, index) => {
        const dayTasks = tasks.filter(task => 
          task.dueDate && 
          isSameMonth(new Date(task.dueDate), date) &&
          new Date(task.dueDate).getDate() === date.getDate()
        );
        
        const isSelected = selectedDate && 
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear();
        
        const isCurrentDay = isToday(date);
        
        return (
          <div 
            key={index}
            className={cn(
              "min-h-24 p-2 border rounded-md cursor-pointer transition-colors",
              isSelected ? "border-primary bg-primary/10" : "hover:bg-muted",
              isCurrentDay && !isSelected && "border-primary/50"
            )}
            onClick={() => onSelectDate(date)}
          >
            <div className="text-center mb-2">
              <div className="text-xs text-muted-foreground">
                {format(date, 'EEE')}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isSelected ? "text-primary" : "",
                isCurrentDay && !isSelected && "text-primary/80"
              )}>
                {format(date, 'd')}
              </div>
            </div>
            <div className="space-y-1">
              {dayTasks.length > 0 ? (
                dayTasks.slice(0, 3).map(task => (
                  <motion.div 
                    key={task.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    className={cn(
                      "text-xs p-1 rounded truncate cursor-pointer",
                      task.priority === 'high' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                      task.priority === 'medium' ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    )}
                  >
                    {task.title}
                    <AnimatePresence>
                      {hoveredTaskId === task.id && task.description && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute z-10 bg-white dark:bg-gray-800 p-2 rounded shadow-lg mt-1 max-w-xs"
                        >
                          {task.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="text-xs text-center text-muted-foreground p-1">No tasks</div>
              )}
              {dayTasks.length > 3 && (
                <div className="text-xs text-center text-primary font-medium">
                  +{dayTasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DayView: React.FC<{
  selectedDate: Date | undefined;
  tasks: Task[];
}> = ({ selectedDate, tasks }) => {
  const date = selectedDate || new Date();
  const dayTasks = tasks.filter(task => 
    task.dueDate && 
    isSameMonth(new Date(task.dueDate), date) &&
    new Date(task.dueDate).getDate() === date.getDate()
  );
  
  // Generate time slots for the day (hourly from 8AM to 8PM)
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const handleTaskClick = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-4 text-center">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
        
        <div className="space-y-4">
          {timeSlots.map(hour => {
            // Filter tasks that might be at this hour (simplistic approach)
            const hourTasks = dayTasks.filter(task => {
              if (!task.dueDate) return false;
              const taskDate = new Date(task.dueDate);
              return taskDate.getHours() === hour;
            });
            
            return (
              <div key={hour} className="flex border-b border-border pb-2">
                <div className="w-16 text-sm text-muted-foreground">
                  {format(new Date().setHours(hour, 0, 0), 'h:mm a')}
                </div>
                <div className="flex-1">
                  {hourTasks.length > 0 ? (
                    hourTasks.map(task => (
                      <motion.div 
                        key={task.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleTaskClick(task.id)}
                        className={cn(
                          "text-sm p-2 rounded mb-1 cursor-pointer",
                          task.priority === 'high' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                          task.priority === 'medium' ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                          "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                        )}
                      >
                        <div className="font-medium">{task.title}</div>
                        <AnimatePresence>
                          {(expandedTaskId === task.id || !task.description) && task.description && (
                            <motion.div 
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-xs mt-1"
                            >
                              {task.description}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {expandedTaskId !== task.id && task.description && task.description.length > 0 && (
                          <motion.div className="text-xs opacity-60 mt-1">Click to view details</motion.div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-6"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export const GridView: React.FC<{
  tasksForSelectedDate: Task[];
}> = ({ tasksForSelectedDate }) => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  
  const handleTaskClick = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tasksForSelectedDate.length > 0 ? (
        tasksForSelectedDate.map(task => (
          <motion.div 
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={() => handleTaskClick(task.id)}
          >
            <Card className={cn(
              "overflow-hidden cursor-pointer",
              task.completed ? "opacity-60" : ""
            )}>
              <CardContent className="p-4">
                <div className={cn(
                  "text-sm px-2 py-1 rounded-full inline-block mb-2",
                  task.priority === 'high' ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                  task.priority === 'medium' ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" :
                  "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                )}>
                  {task.priority}
                </div>
                <h3 className={cn(
                  "font-medium text-lg mb-2",
                  task.completed && "line-through"
                )}>
                  {task.title}
                </h3>
                
                <AnimatePresence>
                  {(expandedTaskId === task.id || !task.description) && task.description && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-muted-foreground mb-4"
                    >
                      {task.description}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {expandedTaskId !== task.id && task.description && task.description.length > 50 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {task.description.substring(0, 50)}...
                  </p>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          <p>No tasks scheduled for this date</p>
        </div>
      )}
    </div>
  );
};
