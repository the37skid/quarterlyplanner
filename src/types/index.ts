export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  deadline?: string;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category: 'personal' | 'professional' | 'priority';
  priority?: 'high' | 'medium' | 'low';
  deadline?: string;
}

export interface Habit {
  id: string;
  name: string;
  completedDays: boolean[];
}

export interface Reflection {
  id: string;
  type: 'win' | 'lesson';
  text: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  activity: string;
}

export interface WeeklyData {
  id: string;
  weekOf: string;
  goals: Goal[];
  todos: TodoItem[];
  habits: Habit[];
  reflections: Reflection[];
}

export interface DailyData {
  id: string;
  date: string;
  goals: Goal[];
  todos: TodoItem[];
  timeSlots: TimeSlot[];
}

export interface MonthlyObjective {
  id: string;
  month: 'July' | 'August' | 'September';
  objective: string;
}

export interface QuarterlyGoal {
  id: string;
  goal: string;
  why: string;
  reward: string;
  monthlyObjectives: MonthlyObjective[];
}

export interface QuarterlyData {
  id: string;
  quarter: string;
  startDate: string;
  endDate: string;
  goals: QuarterlyGoal[];
}
