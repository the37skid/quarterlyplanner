import React from 'react';
import { Check, X, Calendar, Flag } from 'lucide-react';
import { TodoItem as TodoItemType } from '../types';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete
}) => {
  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  };

  const categoryColors = {
    personal: 'bg-blue-100 text-blue-800',
    professional: 'bg-purple-100 text-purple-800',
    priority: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${todo.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-colors`}>
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {todo.completed && <Check size={12} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {todo.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`px-2 py-1 text-xs rounded-full ${categoryColors[todo.category]}`}>
            {todo.category}
          </span>
          {todo.priority && (
            <div className="flex items-center gap-1">
              <Flag size={12} className={priorityColors[todo.priority]} />
              <span className={`text-xs ${priorityColors[todo.priority]}`}>
                {todo.priority}
              </span>
            </div>
          )}
          {todo.deadline && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={12} />
              <span className="text-xs">
                {new Date(todo.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};
