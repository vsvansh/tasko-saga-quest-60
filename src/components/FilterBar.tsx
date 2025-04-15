
import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarDays, CheckCircle, Clock, Filter, Moon, Plus, Search, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { Input } from '@/components/ui/input';

interface FilterBarProps {
  onAddTask: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onAddTask, searchQuery, setSearchQuery }) => {
  const { state, setFilter } = useTodo();
  const { theme, setTheme } = useTheme();

  return (
    <div className="bg-background sticky top-0 z-10 pb-4 pt-2">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <Button onClick={onAddTask} className="button-anime text-white gap-1">
            <Plus size={18} />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs 
          defaultValue="all" 
          value={state.filter}
          onValueChange={(value) => setFilter(value as 'all' | 'active' | 'completed')}
          className="w-full sm:w-auto"
        >
          <TabsList>
            <TabsTrigger value="all" className="gap-1">
              <Filter size={16} />
              All
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-1">
              <Clock size={16} />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-1">
              <CheckCircle size={16} />
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-64 bg-background border-input"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
