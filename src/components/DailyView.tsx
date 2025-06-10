import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, Target, CheckSquare } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddItemForm } from './AddItemForm';
import { GoalItem } from './GoalItem';
import { TodoItem } from './TodoItem';
import { DailyData, Goal, TodoItem as TodoItemType, TimeSlot } from '../types';
import { formatDate, formatDisplayDate } from '../utils/dateUtils';

interface DailyViewProps {
  dailyData: DailyData;
  onUpdateDailyData: (data: DailyData) => void;
}

export const DailyView: React.FC<DailyViewProps> = ({
  dailyData,
  onUpdateDailyData
}) => {
  const [currentDate, setCurrentDate] = useState(dailyData.date);

  const navigateDay = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(formatDate(date));
  };

  const addGoal = (text: string, options: any) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: options.priority,
      deadline: options.deadline
    };
    onUpdateDailyData({
      ...dailyData,
      goals: [...dailyData.goals, newGoal]
    });
  };

  const toggleGoal = (id: string) => {
    onUpdateDailyData({
      ...dailyData,
      goals: dailyData.goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    });
  };

  const deleteGoal = (id: string) => {
    onUpdateDailyData({
      ...dailyData,
      goals: dailyData.goals.filter(goal => goal.id !== id)
    });
  };

  const addTodo = (text: string, options: any) => {
    const newTodo: TodoItemType = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: 'personal',
      priority: options.priority,
      deadline: options.deadline
    };
    onUpdateDailyData({
      ...dailyData,
      todos: [...dailyData.todos, newTodo]
    });
  };

  const toggleTodo = (id: string) => {
    onUpdateDailyData({
      ...dailyData,
      todos: dailyData.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const deleteTodo = (id: string) => {
    onUpdateDailyData({
      ...dailyData,
      todos: dailyData.todos.filter(todo => todo.id !== id)
    });
  };

  const addTimeSlot = (activity: string, options: { time: string }) => {
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      time: options.time,
      activity
    };
    onUpdateDailyData({
      ...dailyData,
      timeSlots: [...dailyData.timeSlots, newTimeSlot].sort((a, b) => a.time.localeCompare(b.time))
    });
  };

  const deleteTimeSlot = (id: string) => {
    onUpdateDailyData({
      ...dailyData,
      timeSlots: dailyData.timeSlots.filter(slot => slot.id !== id)
    });
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00', '00:00'
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Planner</h1>
          <p className="text-gray-600 mt-1">{formatDisplayDate(currentDate)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateDay('prev')}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" onClick={() => navigateDay('next')}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Daily Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Goals */}
        <Card title="Daily Goals" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={addGoal}
              placeholder="Add a daily goal..."
              showPriority
              buttonText="Add Goal"
            />
            <div className="space-y-2">
              {dailyData.goals.map(goal => (
                <GoalItem
                  key={goal.id}
                  goal={goal}
                  onToggle={toggleGoal}
                  onDelete={deleteGoal}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Daily To-Do */}
        <Card title="Daily To-Do List" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={addTodo}
              placeholder="Add a task..."
              showPriority
              buttonText="Add Task"
            />
            <div className="space-y-2">
              {dailyData.todos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Day Breakdown */}
      <Card title="Day Breakdown" className="w-full">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <input
              type="time"
              min="06:00"
              max="23:59"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="timeInput"
            />
            <div className="flex-1 min-w-0">
              <AddItemForm
                onAdd={(activity) => {
                  const timeInput = document.getElementById('timeInput') as HTMLInputElement;
                  const time = timeInput.value || '06:00';
                  addTimeSlot(activity, { time });
                  timeInput.value = '';
                }}
                placeholder="What are you doing at this time?"
                buttonText="Add Activity"
              />
            </div>
          </div>
          
          <div className="grid gap-3">
            {timeSlots.map(time => {
              const slot = dailyData.timeSlots.find(s => s.time === time);
              return (
                <div key={time} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 w-16">
                    <Clock size={14} />
                    {time}
                  </div>
                  <div className="flex-1">
                    {slot ? (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-900">{slot.activity}</span>
                        <button
                          onClick={() => deleteTimeSlot(slot.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">No activity planned</span>
                    )}
                  </div>
                </div>
              );
            })}
            
            {/* Additional time slots */}
            {dailyData.timeSlots
              .filter(slot => !timeSlots.includes(slot.time))
              .map(slot => (
                <div key={slot.id} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600 w-16">
                    <Clock size={14} />
                    {slot.time}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{slot.activity}</span>
                      <button
                        onClick={() => deleteTimeSlot(slot.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
