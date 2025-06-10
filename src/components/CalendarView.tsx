import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Target, CheckSquare } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { DailyData, Goal, TodoItem, TimeSlot } from '../types';
import { formatDate, formatDisplayDate } from '../utils/dateUtils';

interface CalendarViewProps {
  allDailyData: Record<string, DailyData>;
  onUpdateDailyData: (date: string, data: DailyData) => void;
  startDate: string;
  endDate: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  allDailyData,
  onUpdateDailyData,
  startDate,
  endDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 6, 1)); // July 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const months = [
    { name: 'July', value: 6, year: 2024 },
    { name: 'August', value: 7, year: 2024 },
    { name: 'September', value: 8, year: 2024 }
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + (direction === 'next' ? 1 : -1));
    
    // Keep within July-September range
    if (newMonth.getMonth() >= 6 && newMonth.getMonth() <= 8) {
      setCurrentMonth(newMonth);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDate(new Date(year, month, day));
      days.push({
        day,
        date: dateString,
        data: allDailyData[dateString]
      });
    }
    
    return days;
  };

  const getDayData = (date: string): DailyData => {
    return allDailyData[date] || {
      id: Date.now().toString(),
      date,
      goals: [],
      todos: [],
      timeSlots: []
    };
  };

  const updateSelectedDateData = (data: DailyData) => {
    if (selectedDate) {
      onUpdateDailyData(selectedDate, data);
    }
  };

  const addGoal = (text: string) => {
    if (!selectedDate) return;
    const currentData = getDayData(selectedDate);
    const newGoal: Goal = {
      id: Date.now().toString(),
      text,
      completed: false
    };
    updateSelectedDateData({
      ...currentData,
      goals: [...currentData.goals, newGoal]
    });
  };

  const addTodo = (text: string) => {
    if (!selectedDate) return;
    const currentData = getDayData(selectedDate);
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: 'personal'
    };
    updateSelectedDateData({
      ...currentData,
      todos: [...currentData.todos, newTodo]
    });
  };

  const addTimeSlot = (time: string, activity: string) => {
    if (!selectedDate) return;
    const currentData = getDayData(selectedDate);
    const newTimeSlot: TimeSlot = {
      id: Date.now().toString(),
      time,
      activity
    };
    updateSelectedDateData({
      ...currentData,
      timeSlots: [...currentData.timeSlots, newTimeSlot].sort((a, b) => a.time.localeCompare(b.time))
    });
  };

  const toggleGoal = (goalId: string) => {
    if (!selectedDate) return;
    const currentData = getDayData(selectedDate);
    updateSelectedDateData({
      ...currentData,
      goals: currentData.goals.map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    });
  };

  const toggleTodo = (todoId: string) => {
    if (!selectedDate) return;
    const currentData = getDayData(selectedDate);
    updateSelectedDateData({
      ...currentData,
      todos: currentData.todos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const days = getDaysInMonth(currentMonth);
  const selectedData = selectedDate ? getDayData(selectedDate) : null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar View</h1>
          <p className="text-gray-600 mt-1">July - September 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigateMonth('prev')}
            disabled={currentMonth.getMonth() <= 6}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="px-4 py-2 font-medium text-gray-900">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button 
            variant="outline" 
            onClick={() => navigateMonth('next')}
            disabled={currentMonth.getMonth() >= 8}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card title="" className="p-0">
            <div className="p-6">
              {/* Days of week header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      min-h-[80px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-colors
                      ${day ? 'hover:bg-blue-50' : ''}
                      ${selectedDate === day?.date ? 'bg-blue-100 border-blue-300' : ''}
                      ${day?.data ? 'bg-green-50' : ''}
                    `}
                    onClick={() => day && setSelectedDate(day.date)}
                  >
                    {day && (
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {day.day}
                        </div>
                        {day.data && (
                          <div className="space-y-1">
                            {day.data.goals.length > 0 && (
                              <div className="text-xs text-blue-600 flex items-center gap-1">
                                <Target size={10} />
                                {day.data.goals.length}
                              </div>
                            )}
                            {day.data.todos.length > 0 && (
                              <div className="text-xs text-green-600 flex items-center gap-1">
                                <CheckSquare size={10} />
                                {day.data.todos.length}
                              </div>
                            )}
                            {day.data.timeSlots.length > 0 && (
                              <div className="text-xs text-purple-600 flex items-center gap-1">
                                <Clock size={10} />
                                {day.data.timeSlots.length}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Day Details */}
        <div className="space-y-6">
          {selectedDate ? (
            <>
              <Card title={formatDisplayDate(selectedDate)} className="h-fit">
                <div className="space-y-4">
                  {/* Quick Add */}
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add goal..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addGoal(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add goal..."]') as HTMLInputElement;
                          if (input.value) {
                            addGoal(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <Target size={14} />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add task..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addTodo(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.querySelector('input[placeholder="Add task..."]') as HTMLInputElement;
                          if (input.value) {
                            addTodo(input.value);
                            input.value = '';
                          }
                        }}
                      >
                        <CheckSquare size={14} />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        id="timeSlotInput"
                      />
                      <input
                        type="text"
                        placeholder="Activity..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const timeInput = document.getElementById('timeSlotInput') as HTMLInputElement;
                            if (timeInput.value && e.currentTarget.value) {
                              addTimeSlot(timeInput.value, e.currentTarget.value);
                              timeInput.value = '';
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const timeInput = document.getElementById('timeSlotInput') as HTMLInputElement;
                          const activityInput = document.querySelector('input[placeholder="Activity..."]') as HTMLInputElement;
                          if (timeInput.value && activityInput.value) {
                            addTimeSlot(timeInput.value, activityInput.value);
                            timeInput.value = '';
                            activityInput.value = '';
                          }
                        }}
                      >
                        <Clock size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Day Summary */}
              {selectedData && (
                <Card title="Day Summary" className="h-fit">
                  <div className="space-y-4">
                    {selectedData.goals.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Goals</h4>
                        <div className="space-y-1">
                          {selectedData.goals.map(goal => (
                            <div key={goal.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={goal.completed}
                                onChange={() => toggleGoal(goal.id)}
                                className="rounded"
                              />
                              <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {goal.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedData.todos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tasks</h4>
                        <div className="space-y-1">
                          {selectedData.todos.map(todo => (
                            <div key={todo.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="rounded"
                              />
                              <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {todo.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedData.timeSlots.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule</h4>
                        <div className="space-y-1">
                          {selectedData.timeSlots.map(slot => (
                            <div key={slot.id} className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600 font-mono">{slot.time}</span>
                              <span className="text-gray-900">{slot.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <Card title="Select a Date" className="h-fit">
              <p className="text-gray-600 text-center py-8">
                Click on a date to view and edit daily plans
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
