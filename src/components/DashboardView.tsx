
import React from 'react';
import { useTodo } from '@/context/TodoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, CalendarDays } from 'lucide-react';

const DashboardView = () => {
  const { state } = useTodo();
  
  // Count tasks by status
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = state.tasks.filter(task => 
    task.dueDate && 
    !task.completed && 
    new Date(task.dueDate) < new Date()
  ).length;
  
  // Stats for pie chart
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Pending', value: pendingTasks, color: '#3B82F6' },
    { name: 'Overdue', value: overdueTasks, color: '#EF4444' },
  ].filter(item => item.value > 0);
  
  // Count tasks by category
  const tasksByCategoryData = state.categories.map(category => {
    const count = state.tasks.filter(task => 
      task.categoryIds.includes(category.id)
    ).length;
    
    return {
      name: category.name,
      tasks: count,
      color: category.color === 'anime-red' ? '#EF4444' 
        : category.color === 'anime-blue' ? '#3B82F6'
        : category.color === 'anime-yellow' ? '#F59E0B'
        : category.color === 'anime-green' ? '#10B981'
        : '#6366F1'
    };
  }).filter(item => item.tasks > 0);
  
  // Get upcoming tasks (due in next 7 days)
  const now = new Date();
  const next7Days = new Date(now);
  next7Days.setDate(now.getDate() + 7);
  
  const upcomingTasks = state.tasks
    .filter(task => 
      task.dueDate && 
      !task.completed && 
      new Date(task.dueDate) > now && 
      new Date(task.dueDate) <= next7Days
    )
    .sort((a, b) => 
      new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
    )
    .slice(0, 5);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Task Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Task Overview
          </CardTitle>
          <CardDescription>Summary of your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
              <div className="text-sm text-green-800 dark:text-green-300">Completed</div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Pending</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</div>
              <div className="text-sm text-red-800 dark:text-red-300">Overdue</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Category Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Tasks by Category
          </CardTitle>
          <CardDescription>Distribution across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tasksByCategoryData} layout="vertical">
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                <Bar dataKey="tasks" radius={[0, 4, 4, 0]}>
                  {tasksByCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Tasks Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>Tasks due in the next 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length > 0 ? (
            <div className="divide-y">
              {upcomingTasks.map(task => (
                <div key={task.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'high' ? 'bg-anime-red' : 
                      task.priority === 'medium' ? 'bg-anime-yellow' : 
                      'bg-anime-green'
                    }`} />
                    <div>
                      <h4 className="font-medium">{task.title}</h4>
                      {task.description && (
                        <p className="text-xs text-muted-foreground">{task.description.substring(0, 50)}{task.description.length > 50 ? '...' : ''}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-anime-yellow" />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No upcoming deadlines for the next 7 days</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardView;
