
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Plus, Search, SlidersHorizontal, Calendar, Filter, ArrowDownAZ, ArrowUpZA, Clock, 
  CircleAlert
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export interface FilterBarProps {
  onAddTask: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  // Additional props for filter functionality
  sortBy?: string;
  setSortBy?: (value: string) => void;
  sortOrder?: "asc" | "desc";
  setSortOrder?: (value: "asc" | "desc") => void;
  hideCompleted?: boolean;
  setHideCompleted?: (value: boolean) => void;
  priorityFilter?: string;
  setPriorityFilter?: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  onAddTask, 
  searchQuery, 
  setSearchQuery,
  className,
  sortBy: externalSortBy,
  setSortBy: externalSetSortBy,
  sortOrder: externalSortOrder,
  setSortOrder: externalSetSortOrder,
  hideCompleted: externalHideCompleted,
  setHideCompleted: externalSetHideCompleted,
  priorityFilter: externalPriorityFilter,
  setPriorityFilter: externalSetPriorityFilter
}) => {
  // Use external state if provided, otherwise use internal state
  const [internalSortBy, setInternalSortBy] = useState("dueDate");
  const [internalSortOrder, setInternalSortOrder] = useState<"asc" | "desc">("asc");
  const [internalHideCompleted, setInternalHideCompleted] = useState(false);
  const [internalPriorityFilter, setInternalPriorityFilter] = useState("all");
  
  const [showFilters, setShowFilters] = useState(false);

  // Use either external or internal state
  const sortBy = externalSortBy !== undefined ? externalSortBy : internalSortBy;
  const setSortBy = externalSetSortBy || setInternalSortBy;
  const sortOrder = externalSortOrder || internalSortOrder;
  const setSortOrder = externalSetSortOrder || setInternalSortOrder;
  const hideCompleted = externalHideCompleted !== undefined ? externalHideCompleted : internalHideCompleted;
  const setHideCompleted = externalSetHideCompleted || setInternalHideCompleted;
  const priorityFilter = externalPriorityFilter !== undefined ? externalPriorityFilter : internalPriorityFilter;
  const setPriorityFilter = externalSetPriorityFilter || setInternalPriorityFilter;

  const handleFilterApply = () => {
    toast({
      title: "Filters applied",
      description: `Sorted by ${sortBy}, ${hideCompleted ? "hiding" : "showing"} completed tasks, priority: ${priorityFilter}`,
    });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setSortBy("dueDate");
    setSortOrder("asc");
    setHideCompleted(false);
    setPriorityFilter("all");
    setSearchQuery("");
    
    toast({
      title: "Filters cleared",
      description: "All filters have been reset to default",
    });
  };

  const handleSortDirectionToggle = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    toast({
      title: "Sort direction changed",
      description: `Sorting in ${sortOrder === "asc" ? "descending" : "ascending"} order`,
    });
  };

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
      <div className="flex gap-2 w-full sm:w-auto">
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 pointer-events-auto" align="end">
            <div className="space-y-4">
              <h4 className="font-medium">Filter & Sort</h4>
              <Separator />
              
              <div className="space-y-2">
                <Label>Sort by</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    <SelectItem value="dueDate">Due Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Sort direction</Label>
                <Button variant="ghost" size="sm" onClick={handleSortDirectionToggle} type="button">
                  {sortOrder === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter priority" />
                  </SelectTrigger>
                  <SelectContent className="pointer-events-auto">
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block">Hide completed</Label>
                  <p className="text-xs text-muted-foreground">Only show active tasks</p>
                </div>
                <Switch checked={hideCompleted} onCheckedChange={setHideCompleted} />
              </div>
              
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" onClick={handleClearFilters} type="button">
                  Clear
                </Button>
                <Button size="sm" onClick={handleFilterApply} type="button">
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button 
          variant="outline" 
          onClick={handleSortDirectionToggle}
          className="hidden sm:flex items-center gap-2"
          type="button"
        >
          {sortOrder === "asc" ? <ArrowDownAZ className="h-4 w-4" /> : <ArrowUpZA className="h-4 w-4" />}
        </Button>
        
        <Button onClick={onAddTask} className="flex-1 sm:flex-none" type="button">
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
