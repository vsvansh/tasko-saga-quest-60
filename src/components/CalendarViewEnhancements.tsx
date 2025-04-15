
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Grid, LayoutGrid, List } from 'lucide-react';
import { format, isSameMonth, addDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Task } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CalendarViewEnhancementsProps {
  viewMode: 'month' | 'week' | 'day';
  displayMode: 'list' | 'grid';
  selectedDate: Date | undefined;
  currentMonth: Date;
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  onDisplayModeChange: (mode: 'list' | 'grid') => void;
  tasksForSelectedDate: Task[];
}

export const WeekView: React.FC<{
  selectedDate: Date | undefined;
  tasks: Task[];
  onSelectDate: (date: Date) => void;
}> = ({ selectedDate, tasks, onSelectDate }) => {
  const currentDate = selectedDate || new Date();
  const startDate = startOfWeek(currentDate);
  const endDate = endOfWeek(currentDate);
  
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
        
        return (
          <div 
            key={index}
            className={cn(
              "min-h-24 p-2 border rounded-md cursor-pointer transition-colors",
              isSelected ? "border-primary bg-primary/10" : "hover:bg-muted"
            )}
            onClick={() => onSelectDate(date)}
          >
            <div className="text-center mb-2">
              <div className="text-xs text-muted-foreground">
                {format(date, 'EEE')}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isSelected ? "text-primary" : ""
              )}>
                {format(date, 'd')}
              </div>
            </div>
            <div className="space-y-1">
              {dayTasks.length > 0 ? (
                dayTasks.slice(0, 3).map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "text-xs p-1 rounded truncate",
                      task.priority === 'high' ? "bg-anime-red/20 text-anime-red" :
                      task.priority === 'medium' ? "bg-anime-yellow/20 text-anime-yellow" :
                      "bg-anime-green/20 text-anime-green"
                    )}
                  >
                    {task.title}
                  </div>
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
                      <div 
                        key={task.id} 
                        className={cn(
                          "text-sm p-2 rounded mb-1",
                          task.priority === 'high' ? "bg-anime-red/20 text-anime-red" :
                          task.priority === 'medium' ? "bg-anime-yellow/20 text-anime-yellow" :
                          "bg-anime-green/20 text-anime-green"
                        )}
                      >
                        <div className="font-medium">{task.title}</div>
                        {task.description && <div className="text-xs mt-1">{task.description}</div>}
                      </div>
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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {tasksForSelectedDate.length > 0 ? (
        tasksForSelectedDate.map(task => (
          <Card key={task.id} className={cn(
            "overflow-hidden",
            task.completed ? "opacity-60" : ""
          )}>
            <CardContent className="p-4">
              <div className={cn(
                "text-sm px-2 py-1 rounded-full inline-block mb-2",
                task.priority === 'high' ? "bg-anime-red/20 text-anime-red" :
                task.priority === 'medium' ? "bg-anime-yellow/20 text-anime-yellow" :
                "bg-anime-green/20 text-anime-green"
              )}>
                {task.priority}
              </div>
              <h3 className={cn(
                "font-medium text-lg mb-2",
                task.completed && "line-through"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mb-4">
                  {task.description}
                </p>
              )}
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          <p>No tasks scheduled for this date</p>
        </div>
      )}
    </div>
  );
};

const CalendarViewEnhancements: React.FC<CalendarViewEnhancementsProps> = ({
  viewMode,
  displayMode,
  selectedDate,
  currentMonth,
  onViewModeChange,
  onDisplayModeChange,
  tasksForSelectedDate,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'month' ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange('month')}
          >
            Month
          </Button>
          <Button
            variant={viewMode === 'week' ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange('week')}
          >
            Week
          </Button>
          <Button
            variant={viewMode === 'day' ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange('day')}
          >
            Day
          </Button>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDisplayModeChange(displayMode === 'list' ? 'grid' : 'list')}
          >
            {displayMode === 'list' ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewEnhancements;
