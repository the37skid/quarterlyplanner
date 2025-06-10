import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AddItemFormProps {
  onAdd: (text: string, options?: any) => void;
  placeholder: string;
  showPriority?: boolean;
  showCategory?: boolean;
  showDeadline?: boolean;
  buttonText?: string;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  onAdd,
  placeholder,
  showPriority = false,
  showCategory = false,
  showDeadline = false,
  buttonText = "Add"
}) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [category, setCategory] = useState<'personal' | 'professional' | 'priority'>('personal');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const options: any = {};
      if (showPriority) options.priority = priority;
      if (showCategory) options.category = category;
      if (showDeadline && deadline) options.deadline = deadline;
      
      onAdd(text.trim(), options);
      setText('');
      setDeadline('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      
      <div className="flex flex-wrap gap-3">
        {showPriority && (
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        )}
        
        {showCategory && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="personal">Personal</option>
            <option value="professional">Professional</option>
            <option value="priority">Priority</option>
          </select>
        )}
        
        {showDeadline && (
          <Input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-auto"
          />
        )}
        
        <Button type="submit" className="flex items-center gap-2">
          <Plus size={16} />
          {buttonText}
        </Button>
      </div>
    </form>
  );
};
