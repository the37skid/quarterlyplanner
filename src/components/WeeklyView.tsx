import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Target, CheckSquare, BarChart3, Lightbulb, Trophy } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { AddItemForm } from './AddItemForm';
import { GoalItem } from './GoalItem';
import { TodoItem } from './TodoItem';
import { HabitTracker } from './HabitTracker';
import { WeeklyData, Goal, TodoItem as TodoItemType, Habit, Reflection } from '../types';
import { formatWeekRange, getWeekOf } from '../utils/dateUtils';

interface WeeklyViewProps {
  weeklyData: WeeklyData;
  onUpdateWeeklyData: (data: WeeklyData) => void;
}

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  weeklyData,
  onUpdateWeeklyData
}) => {
  const [currentWeekOf, setCurrentWeekOf] = useState(weeklyData.weekOf);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentWeekOf);
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekOf(getWeekOf(newDate));
  };

  const addGoal = (text: string, options: any) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority: options.priority,
      deadline: options.deadline
    };
    onUpdateWeeklyData({
      ...weeklyData,
      goals: [...weeklyData.goals, newGoal]
    });
  };

  const toggleGoal = (id: string) => {
    onUpdateWeeklyData({
      ...weeklyData,
      goals: weeklyData.goals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    });
  };

  const deleteGoal = (id: string) => {
    onUpdateWeeklyData({
      ...weeklyData,
      goals: weeklyData.goals.filter(goal => goal.id !== id)
    });
  };

  const addTodo = (text: string, options: any) => {
    const newTodo: TodoItemType = {
      id: Date.now().toString(),
      text,
      completed: false,
      category: options.category,
      priority: options.priority,
      deadline: options.deadline
    };
    onUpdateWeeklyData({
      ...weeklyData,
      todos: [...weeklyData.todos, newTodo]
    });
  };

  const toggleTodo = (id: string) => {
    onUpdateWeeklyData({
      ...weeklyData,
      todos: weeklyData.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  };

  const deleteTodo = (id: string) => {
    onUpdateWeeklyData({
      ...weeklyData,
      todos: weeklyData.todos.filter(todo => todo.id !== id)
    });
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      completedDays: new Array(7).fill(false)
    };
    onUpdateWeeklyData({
      ...weeklyData,
      habits: [...weeklyData.habits, newHabit]
    });
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    onUpdateWeeklyData({
      ...weeklyData,
      habits: weeklyData.habits.map(habit =>
        habit.id === habitId
          ? {
              ...habit,
              completedDays: habit.completedDays.map((completed, index) =>
                index === dayIndex ? !completed : completed
              )
            }
          : habit
      )
    });
  };

  const addReflection = (text: string, options: { type: 'win' | 'lesson' }) => {
    const newReflection: Reflection = {
      id: Date.now().toString(),
      type: options.type,
      text
    };
    onUpdateWeeklyData({
      ...weeklyData,
      reflections: [...weeklyData.reflections, newReflection]
    });
  };

  const deleteReflection = (id: string) => {
    onUpdateWeeklyData({
      ...weeklyData,
      reflections: weeklyData.reflections.filter(reflection => reflection.id !== id)
    });
  };

  const personalTodos = weeklyData.todos.filter(todo => todo.category === 'personal');
  const professionalTodos = weeklyData.todos.filter(todo => todo.category === 'professional');
  const wins = weeklyData.reflections.filter(reflection => reflection.type === 'win');
  const lessons = weeklyData.reflections.filter(reflection => reflection.type === 'lesson');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weekly Planner</h1>
          <p className="text-gray-600 mt-1">{formatWeekRange(currentWeekOf)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigateWeek('prev')}>
            <ChevronLeft size={16} />
          </Button>
          <Button variant="outline" onClick={() => navigateWeek('next')}>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Weekly Template */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Week Goals */}
        <Card title="Week Goals" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={addGoal}
              placeholder="Add a weekly goal..."
              showPriority
              showDeadline
              buttonText="Add Goal"
            />
            <div className="space-y-2">
              {weeklyData.goals.slice(0, 5).map(goal => (
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

        {/* Habit Tracker */}
        <Card title="7-Day Habit Tracker" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={addHabit}
              placeholder="Add a habit to track..."
              buttonText="Add Habit"
            />
            {weeklyData.habits.length > 0 && (
              <HabitTracker
                habits={weeklyData.habits.slice(0, 5)}
                onToggleDay={toggleHabitDay}
              />
            )}
          </div>
        </Card>
      </div>

      {/* Todo Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Todos */}
        <Card title="Personal To-Do" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={(text) => addTodo(text, { category: 'personal' })}
              placeholder="Add personal task..."
              showPriority
              showDeadline
            />
            <div className="space-y-2">
              {personalTodos.map(todo => (
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

        {/* Professional Todos */}
        <Card title="Professional To-Do" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={(text) => addTodo(text, { category: 'professional' })}
              placeholder="Add professional task..."
              showPriority
              showDeadline
            />
            <div className="space-y-2">
              {professionalTodos.map(todo => (
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

      {/* Weekly Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Wins */}
        <Card title="Top Wins - What Went Well? (3)" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={(text) => addReflection(text, { type: 'win' })}
              placeholder="What went well this week?"
              buttonText="Add Win"
            />
            <div className="space-y-3">
              {wins.slice(0, 3).map((win, index) => (
                <div key={win.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <Trophy className="text-green-600 mt-0.5" size={16} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{win.text}</p>
                  </div>
                  <button
                    onClick={() => deleteReflection(win.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Lessons */}
        <Card title="Top Lessons - How Can I Improve? (3)" className="h-fit">
          <div className="space-y-4">
            <AddItemForm
              onAdd={(text) => addReflection(text, { type: 'lesson' })}
              placeholder="What can you improve next week?"
              buttonText="Add Lesson"
            />
            <div className="space-y-3">
              {lessons.slice(0, 3).map((lesson, index) => (
                <div key={lesson.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Lightbulb className="text-blue-600 mt-0.5" size={16} />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{lesson.text}</p>
                  </div>
                  <button
                    onClick={() => deleteReflection(lesson.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
