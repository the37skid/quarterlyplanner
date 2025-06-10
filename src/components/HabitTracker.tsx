import React from 'react';
import { Check } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleDay: (habitId: string, dayIndex: number) => void;
}

export const HabitTracker: React.FC<HabitTrackerProps> = ({
  habits,
  onToggleDay
}) => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600">
        <div className="text-left">Habit</div>
        {daysOfWeek.map(day => (
          <div key={day} className="text-center">{day}</div>
        ))}
      </div>
      
      {habits.map(habit => (
        <div key={habit.id} className="grid grid-cols-8 gap-2 items-center">
          <div className="text-sm font-medium text-gray-900 truncate">
            {habit.name}
          </div>
          {habit.completedDays.map((completed, dayIndex) => (
            <button
              key={dayIndex}
              onClick={() => onToggleDay(habit.id, dayIndex)}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {completed && <Check size={14} />}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};
