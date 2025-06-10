import React from 'react';
import { Target, Award, Lightbulb, Plus, Trash2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { QuarterlyData, QuarterlyGoal, MonthlyObjective } from '../types';

interface QuarterlyViewProps {
  quarterlyData: QuarterlyData;
  onUpdateQuarterlyData: (data: QuarterlyData) => void;
}

export const QuarterlyView: React.FC<QuarterlyViewProps> = ({
  quarterlyData,
  onUpdateQuarterlyData
}) => {
  const addGoal = () => {
    const newGoal: QuarterlyGoal = {
      id: Date.now().toString(),
      goal: '',
      why: '',
      reward: '',
      monthlyObjectives: [
        { id: `${Date.now()}-july`, month: 'July', objective: '' },
        { id: `${Date.now()}-august`, month: 'August', objective: '' },
        { id: `${Date.now()}-september`, month: 'September', objective: '' }
      ]
    };
    onUpdateQuarterlyData({
      ...quarterlyData,
      goals: [...quarterlyData.goals, newGoal]
    });
  };

  const updateGoal = (goalId: string, field: keyof QuarterlyGoal, value: string) => {
    onUpdateQuarterlyData({
      ...quarterlyData,
      goals: quarterlyData.goals.map(goal =>
        goal.id === goalId ? { ...goal, [field]: value } : goal
      )
    });
  };

  const updateMonthlyObjective = (goalId: string, objectiveId: string, objective: string) => {
    onUpdateQuarterlyData({
      ...quarterlyData,
      goals: quarterlyData.goals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              monthlyObjectives: goal.monthlyObjectives.map(obj =>
                obj.id === objectiveId ? { ...obj, objective } : obj
              )
            }
          : goal
      )
    });
  };

  const deleteGoal = (goalId: string) => {
    onUpdateQuarterlyData({
      ...quarterlyData,
      goals: quarterlyData.goals.filter(goal => goal.id !== goalId)
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Quarterly Goals</h1>
        <p className="text-gray-600 mt-2">July 1st - September 30th, 2025</p>
        <p className="text-sm text-gray-500 mt-1">Plan your 3-month journey to success</p>
      </div>

      {/* Add Goal Button */}
      <div className="flex justify-center">
        <Button
          onClick={addGoal}
          className="flex items-center gap-2"
          disabled={quarterlyData.goals.length >= 5}
        >
          <Plus size={16} />
          Add 3-Month Goal ({quarterlyData.goals.length}/5)
        </Button>
      </div>

      {/* Goals */}
      <div className="space-y-8">
        {quarterlyData.goals.map((goal, index) => (
          <Card key={goal.id} title={`Goal ${index + 1}`} className="relative">
            <button
              onClick={() => deleteGoal(goal.id)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
            
            <div className="space-y-6">
              {/* Goal Section */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Target size={16} className="text-blue-600" />
                    Goal
                  </label>
                  <textarea
                    value={goal.goal}
                    onChange={(e) => updateGoal(goal.id, 'goal', e.target.value)}
                    placeholder="What do you want to achieve in the next 3 months?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Lightbulb size={16} className="text-yellow-600" />
                    Why do I want it?
                  </label>
                  <textarea
                    value={goal.why}
                    onChange={(e) => updateGoal(goal.id, 'why', e.target.value)}
                    placeholder="What's your motivation? Why is this important to you?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Award size={16} className="text-green-600" />
                    Reward If Achieved
                  </label>
                  <textarea
                    value={goal.reward}
                    onChange={(e) => updateGoal(goal.id, 'reward', e.target.value)}
                    placeholder="How will you celebrate when you achieve this goal?"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {goal.monthlyObjectives.map((objective) => (
                    <div key={objective.id} className="space-y-2">
                      <h5 className="font-medium text-gray-800 flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          objective.month === 'July' ? 'bg-red-400' :
                          objective.month === 'August' ? 'bg-orange-400' : 'bg-yellow-400'
                        }`} />
                        {objective.month}
                      </h5>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Goal: {objective.month} Objective</label>
                        <textarea
                          value={objective.objective}
                          onChange={(e) => updateMonthlyObjective(goal.id, objective.id, e.target.value)}
                          placeholder={`What will you focus on in ${objective.month}?`}
                          className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {quarterlyData.goals.length === 0 && (
        <div className="text-center py-12">
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No quarterly goals yet</h3>
          <p className="text-gray-600 mb-4">Start planning your next 3 months by adding your first goal.</p>
          <Button onClick={addGoal} className="flex items-center gap-2 mx-auto">
            <Plus size={16} />
            Add Your First Goal
          </Button>
        </div>
      )}
    </div>
  );
};
