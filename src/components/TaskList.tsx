
import React from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useTodo } from '@/context/TodoContext';
import TaskItem from './TaskItem';
import { Task } from '@/types';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'framer-motion';

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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="taskList">
        {(provided) => (
          <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-40 h-40 bg-contain bg-center bg-no-repeat animate-float" 
                    style={{ backgroundImage: 'url("https://cdn-icons-png.flaticon.com/512/7518/7518748.png")' }} 
                  />
                  <p className="text-muted-foreground mt-4">No tasks found</p>
                  <p className="text-sm text-muted-foreground">Add a new task or try a different filter</p>
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
