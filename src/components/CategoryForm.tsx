
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTodo } from '@/context/TodoContext';
import { Category } from '@/types';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
}

const colorOptions = [
  { value: 'purple', label: 'Purple', bgClass: 'bg-anime-primary' },
  { value: 'pink', label: 'Pink', bgClass: 'bg-anime-secondary' },
  { value: 'blue', label: 'Blue', bgClass: 'bg-anime-blue' },
  { value: 'red', label: 'Red', bgClass: 'bg-anime-red' },
  { value: 'yellow', label: 'Yellow', bgClass: 'bg-anime-yellow' },
  { value: 'green', label: 'Green', bgClass: 'bg-anime-green' },
];

const CategoryForm: React.FC<CategoryFormProps> = ({ open, onOpenChange, editingCategory }) => {
  const { addCategory, updateCategory } = useTodo();
  const [name, setName] = useState('');
  const [color, setColor] = useState('purple');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setColor(editingCategory.color);
    } else {
      setName('');
      setColor('purple');
    }
  }, [editingCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        name: name.trim(),
        color,
      });
    } else {
      addCategory({
        name: name.trim(),
        color,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="anime-input"
              required
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium mb-2">Color</p>
            <RadioGroup 
              value={color} 
              onValueChange={setColor}
              className="grid grid-cols-3 gap-2"
            >
              {colorOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={option.value} 
                    id={`color-${option.value}`}
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor={`color-${option.value}`}
                    className="flex items-center space-x-2 rounded-md border-2 border-muted p-2 cursor-pointer peer-data-[state=checked]:border-primary"
                  >
                    <div className={`w-4 h-4 rounded-full ${option.bgClass}`} />
                    <span>{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="button-anime text-white">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
