
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTodo } from '@/context/TodoContext';
import TaskItem from './TaskItem';
import { Task } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2 } from 'lucide-react';

interface TaskListProps {
  onEditTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onEditTask }) => {
  const { getFilteredTasks, reorderTasks, state } = useTodo();
  const tasks = getFilteredTasks();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If there's no destination or the task is dropped back to its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const newTasks = Array.from(tasks);
    const [reorderedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, reorderedTask);

    // Update order property for each task
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    // Merge with the non-filtered tasks
    const otherTasks = state.tasks.filter(
      task => !tasks.some(t => t.id === task.id)
    );
    
    reorderTasks([...updatedTasks, ...otherTasks]);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Count completed tasks
  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="taskList">
        {(provided) => (
          <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
            {totalCount > 0 && (
              <div className="mb-4">
                <div className="bg-muted p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList size={18} className="text-primary" />
                    <span className="text-sm font-medium">
                      {completedCount} of {totalCount} tasks completed
                    </span>
                  </div>
                  <div className="w-32 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <motion.div
              className="py-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
              variants={container}
              initial="hidden"
              animate="show"
            >
              {tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <motion.div key={task.id} variants={item}>
                    <TaskItem
                      task={task}
                      index={index}
                      onEdit={onEditTask}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center h-60 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="w-32 h-32 mb-4 flex items-center justify-center rounded-full bg-primary/10"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <CheckCircle2 size={50} className="text-primary/50" />
                  </motion.div>
                  <h3 className="text-lg font-medium mb-1">All caught up!</h3>
                  <p className="text-sm text-muted-foreground">
                    {state.filter === 'completed' 
                      ? "You haven't completed any tasks yet." 
                      : "You're all done. Time to add more tasks?"}
                  </p>
                </motion.div>
              )}
              {provided.placeholder}
            </motion.div>
          </ScrollArea>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
