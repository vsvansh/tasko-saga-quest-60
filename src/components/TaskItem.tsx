
import React, { useState } from 'react';
import { Task } from '@/types';
import { formatDate, isOverdue, getPriorityColor, getCategoryColor } from '@/lib/utils';
import { useTodo } from '@/context/TodoContext';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Star, Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';

interface TaskItemProps {
  task: Task;
  index: number;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onEdit }) => {
  const { completeTask, deleteTask, starTask, getCategoryById } = useTodo();
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityColor = getPriorityColor(task.priority);
  const isTaskOverdue = isOverdue(task.dueDate) && !task.completed;
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card p-4 mb-3 ${task.completed ? 'opacity-60' : ''}`}
          animate={task.completed ? { opacity: 0.6 } : { opacity: 1 }}
          initial={false}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start gap-3">
            <div 
              className="mt-1"
              onClick={() => completeTask(task.id, !task.completed)}
            >
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={(checked) => {
                  completeTask(task.id, checked as boolean);
                }}
                className={`${task.completed ? 'animate-task-complete' : ''}`}
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 
                  className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-1">
                  {task.priority !== 'none' && (
                    <Star 
                      className={`${priorityColor} cursor-pointer ${task.starred ? 'fill-current' : ''}`}
                      size={18}
                      onClick={() => starTask(task.id, !task.starred)}
                    />
                  )}
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
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </Draggable>
  );
};

export default TaskItem;
