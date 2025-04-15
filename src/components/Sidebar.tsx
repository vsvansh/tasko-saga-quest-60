
import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, XCircle, Menu } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCategoryColor } from '@/lib/utils';

interface SidebarProps {
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddCategory, onEditCategory }) => {
  const { state, setSelectedCategory, deleteCategory, reorderCategories } = useTodo();
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const newCategories = Array.from(state.categories);
    const [reorderedCategory] = newCategories.splice(source.index, 1);
    newCategories.splice(destination.index, 0, reorderedCategory);

    // Update order property
    const updatedCategories = newCategories.map((category, index) => ({
      ...category,
      order: index,
    }));

    reorderCategories(updatedCategories);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      {isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          <Menu size={24} />
        </Button>
      )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-card border-r border-border shadow-lg z-40 ${isMobile ? 'lg:relative' : 'relative'}`}
          >
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="text-lg font-bold">Categories</h2>
                {isMobile && (
                  <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                    <XCircle size={18} />
                  </Button>
                )}
              </div>

              <ScrollArea className="flex-1 px-3 py-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="categories">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-1"
                      >
                        <Button
                          variant={state.selectedCategory === null ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => setSelectedCategory(null)}
                        >
                          All Tasks
                        </Button>

                        {state.categories.map((category, index) => (
                          <Draggable
                            key={category.id}
                            draggableId={category.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative"
                                onMouseEnter={() => setIsHovering(category.id)}
                                onMouseLeave={() => setIsHovering(null)}
                              >
                                <Button
                                  variant={state.selectedCategory === category.id ? "default" : "ghost"}
                                  className="w-full justify-start"
                                  onClick={() => setSelectedCategory(category.id)}
                                >
                                  <span className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(category.color)}`} />
                                  {category.name}
                                </Button>

                                {isHovering === category.id && (
                                  <div className="absolute right-2 top-1.5 flex items-center space-x-1">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onEditCategory(category);
                                      }}
                                    >
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="15" 
                                        height="15" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 20h9"></path>
                                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                      </svg>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCategory(category.id);
                                      }}
                                    >
                                      <Trash2 size={15} />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </ScrollArea>

              <div className="p-4 border-t border-border">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={onAddCategory}
                >
                  <Plus size={16} />
                  Add Category
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
