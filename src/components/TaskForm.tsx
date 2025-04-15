
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, X, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Task, Priority } from '@/types';
import { useTodo } from '@/context/TodoContext';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingTask: Task | null;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'high', label: 'High', color: 'text-anime-red' },
  { value: 'medium', label: 'Medium', color: 'text-anime-yellow' },
  { value: 'low', label: 'Low', color: 'text-anime-green' },
  { value: 'none', label: 'None', color: 'text-gray-400' },
];

const TaskForm: React.FC<TaskFormProps> = ({ open, onOpenChange, editingTask }) => {
  const { addTask, updateTask, state } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState<Priority>('none');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [starred, setStarred] = useState(false);

  // Initialize form when editing task
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setDueDate(editingTask.dueDate ? new Date(editingTask.dueDate) : undefined);
      setPriority(editingTask.priority);
      setSelectedCategories(editingTask.categoryIds);
      setStarred(editingTask.starred);
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate(undefined);
      setPriority('none');
      // Default to the currently selected category if there is one
      setSelectedCategories(
        state.selectedCategory ? [state.selectedCategory] : []
      );
      setStarred(false);
    }
  }, [editingTask, state.selectedCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const taskData = {
      title: title.trim(),
      description: description.trim(),
      completed: editingTask ? editingTask.completed : false,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      priority,
      categoryIds: selectedCategories.length > 0 ? selectedCategories : ['cat-1'], // Default to "Personal" if none selected
      starred,
    };
    
    if (editingTask) {
      updateTask({
        ...editingTask,
        ...taskData,
      });
    } else {
      addTask(taskData);
    }
    
    onOpenChange(false);
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setCalendarOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="anime-input"
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="anime-input h-24 min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Due Date</p>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal w-full",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select date"}
                    {dueDate && (
                      <X
                        className="ml-auto h-4 w-4 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDueDate(undefined);
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={handleDateSelect}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Priority</p>
              <div className="flex flex-wrap gap-2">
                {priorityOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={priority === option.value ? "default" : "outline"}
                    className={cn(
                      "flex items-center gap-1",
                      priority === option.value && "bg-primary"
                    )}
                    onClick={() => setPriority(option.value)}
                  >
                    <Star className={option.color} size={16} />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Categories</p>
            <div className="flex flex-wrap gap-2">
              {state.categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Checkbox
              id="starred"
              checked={starred}
              onCheckedChange={(checked) => setStarred(!!checked)}
            />
            <label htmlFor="starred" className="text-sm cursor-pointer flex items-center gap-1">
              <Star className="text-anime-yellow" size={16} />
              Mark as important
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="button-anime text-white">
              {editingTask ? 'Update Task' : 'Add Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
