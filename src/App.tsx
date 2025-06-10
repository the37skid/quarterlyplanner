import React, { useState } from 'react';
import { Calendar, Target, BarChart3, CalendarDays } from 'lucide-react';
import { WeeklyView } from './components/WeeklyView';
import { DailyView } from './components/DailyView';
import { QuarterlyView } from './components/QuarterlyView';
import { CalendarView } from './components/CalendarView';
import { Button } from './components/ui/Button';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WeeklyData, DailyData, QuarterlyData } from './types';
import { formatDate, getWeekOf } from './utils/dateUtils';

function App() {
  const [activeView, setActiveView] = useState<'weekly' | 'daily' | 'quarterly' | 'calendar'>('weekly');
  
  const today = new Date();
  const todayString = formatDate(today);
  const currentWeekOf = getWeekOf(today);

  const [weeklyData, setWeeklyData] = useLocalStorage<WeeklyData>('weeklyData', {
    id: '1',
    weekOf: currentWeekOf,
    goals: [],
    todos: [],
    habits: [],
    reflections: []
  });

  const [dailyData, setDailyData] = useLocalStorage<DailyData>('dailyData', {
    id: '1',
    date: todayString,
    goals: [],
    todos: [],
    timeSlots: []
  });

  const [quarterlyData, setQuarterlyData] = useLocalStorage<QuarterlyData>('quarterlyData', {
    id: '1',
    quarter: 'Q3-2025',
    startDate: '2025-07-01',
    endDate: '2025-09-30',
    goals: []
  });

  const [allDailyData, setAllDailyData] = useLocalStorage<Record<string, DailyData>>('allDailyData', {});

  const updateDailyData = (date: string, data: DailyData) => {
    setAllDailyData(prev => ({
      ...prev,
      [date]: data
    }));
    if (date === dailyData.date) {
      setDailyData(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Target className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Goal Planner</h1>
                <p className="text-sm text-gray-600">Plan, Track, Achieve</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'quarterly' ? 'primary' : 'outline'}
                onClick={() => setActiveView('quarterly')}
                className="flex items-center gap-2"
              >
                <Target size={16} />
                Quarterly
              </Button>
              <Button
                variant={activeView === 'weekly' ? 'primary' : 'outline'}
                onClick={() => setActiveView('weekly')}
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Weekly
              </Button>
              <Button
                variant={activeView === 'daily' ? 'primary' : 'outline'}
                onClick={() => setActiveView('daily')}
                className="flex items-center gap-2"
              >
                <Calendar size={16} />
                Daily
              </Button>
              <Button
                variant={activeView === 'calendar' ? 'primary' : 'outline'}
                onClick={() => setActiveView('calendar')}
                className="flex items-center gap-2"
              >
                <CalendarDays size={16} />
                Calendar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="py-8">
        {activeView === 'quarterly' && (
          <QuarterlyView
            quarterlyData={quarterlyData}
            onUpdateQuarterlyData={setQuarterlyData}
          />
        )}
        {activeView === 'weekly' && (
          <WeeklyView
            weeklyData={weeklyData}
            onUpdateWeeklyData={setWeeklyData}
          />
        )}
        {activeView === 'daily' && (
          <DailyView
            dailyData={dailyData}
            onUpdateDailyData={setDailyData}
          />
        )}
        {activeView === 'calendar' && (
          <CalendarView
            allDailyData={allDailyData}
            onUpdateDailyData={updateDailyData}
            startDate="2025-07-01"
            endDate="2025-09-30"
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Target className="text-blue-600" size={20} />
            <span className="font-semibold text-gray-900">Goal Planner</span>
          </div>
          <p className="text-gray-600 text-sm">
            Transform your goals into achievements with structured planning and reflection.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
