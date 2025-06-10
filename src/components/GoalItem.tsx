import React from 'react';
import { Check, X, Calendar, Flag } from 'lucide-react';
import { Goal } from '../types';
import { Button } from './ui/Button';

interface GoalItemProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (goal: Goal) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({
  goal,
  onToggle,
  onDelete,
  onEdit
}) => {
  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500'
  };

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${goal.completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'} transition-colors`}>
      <button
        onClick={() => onToggle(goal.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          goal.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {goal.completed && <Check size={12} />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {goal.text}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {goal.priority && (
            <div className="flex items-center gap-1">
              <Flag size={12} className={priorityColors[goal.priority]} />
              <span className={`text-xs ${priorityColors[goal.priority]}`}>
                {goal.priority}
              </span>
            </div>
          )}
          {goal.deadline && (
            <div className="flex items-center gap-1 text-gray-500">
              <Calendar size={12} />
              <span className="text-xs">
                {new Date(goal.deadline).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(goal)}
            className="p-1 h-auto"
          >
            Edit
          </Button>
        )}
        <button
          onClick={() => onDelete(goal.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
