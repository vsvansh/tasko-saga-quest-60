
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export interface FilterBarProps {
  onAddTask: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  className?: string; // Added className prop to fix the build error
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onAddTask, 
  searchQuery, 
  setSearchQuery,
  className
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-3 items-center ${className || ''}`}>
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <Button onClick={onAddTask} className="w-full sm:w-auto">
        <Plus className="mr-2 h-4 w-4" /> Add Task
      </Button>
    </div>
  );
};

export default FilterBar;
