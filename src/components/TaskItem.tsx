
import React, { useState } from 'react';
import { Task } from '@/types';
import { formatDate, isOverdue, getPriorityColor, getCategoryColor } from '@/lib/utils';
import { useTodo } from '@/context/TodoContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Star, Pencil, Trash2, Calendar, AlertCircle, Clock, Pin, Bookmark, CircleCheck } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onEdit }) => {
  const { completeTask, deleteTask, starTask, getCategoryById, pinTask } = useTodo();
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityColor = getPriorityColor(task.priority);
  const isTaskOverdue = isOverdue(task.dueDate) && !task.completed;
  
  // Define animations
  const taskVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
    hover: { scale: 1.01 },
  };
  
  // Animation for task completion
  const checkmarkVariants = {
    checked: { scale: 1.2, opacity: 1 },
    unchecked: { scale: 1, opacity: 0.6 }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card p-4 mb-3 ${task.completed ? 'opacity-60' : ''} ${task.pinned ? 'border-l-4 border-l-primary' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            variants={taskVariants}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <motion.div 
                className="mt-1"
                onClick={() => completeTask(task.id, !task.completed)}
                variants={checkmarkVariants}
                animate={task.completed ? "checked" : "unchecked"}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={(checked) => {
                    completeTask(task.id, checked as boolean);
                  }}
                  className={`${task.completed ? 'animate-task-complete' : ''}`}
                />
              </motion.div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {task.pinned && (
                      <Pin size={16} className="text-primary" />
                    )}
                    <h3 
                      className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {task.priority !== 'none' && (
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => starTask(task.id, !task.starred)}
                          >
                            <Star 
                              className={`${priorityColor} cursor-pointer ${task.starred ? 'fill-current' : ''}`}
                              size={18}
                            />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-auto p-2">
                          <span className="text-xs">{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority</span>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                    
                    <Button
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => pinTask && pinTask(task.id, !task.pinned)}
                    >
                      <Bookmark className={`${task.pinned ? 'fill-primary text-primary' : 'text-muted-foreground'}`} size={16} />
                    </Button>
                  </div>
                </div>
                
                {task.description && (
                  <p className={`text-sm mb-2 ${task.completed ? 'text-muted-foreground' : ''}`}>
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center flex-wrap gap-2 mt-2">
                  {task.categoryIds.map((catId) => {
                    const category = getCategoryById(catId);
                    if (!category) return null;
                    return (
                      <span 
                        key={catId} 
                        className={`category-pill ${getCategoryColor(category.color)}`}
                      >
                        {category.name}
                      </span>
                    );
                  })}
                  
                  {task.dueDate && (
                    <div className={`flex items-center gap-1 text-xs ${isTaskOverdue ? 'text-anime-red' : 'text-muted-foreground'}`}>
                      {isTaskOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  )}

                  {task.completed && task.completedAt && (
                    <div className="flex items-center gap-1 text-xs text-anime-green">
                      <CircleCheck size={14} />
                      <span>Completed {formatDate(task.completedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {isHovered && (
                <motion.div 
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(task)}
                    className="h-8 w-8"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-anime-red/70 hover:text-anime-red"
                  >
                    <Trash2 size={16} />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskItem;
