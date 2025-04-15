
import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, CalendarDays, BarChart3, ChartPieIcon, LineChart, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardAnalytics from './DashboardAnalytics';

const DashboardView = () => {
  const { state } = useTodo();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
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
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartPieIcon className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
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
                  <Layers className="h-5 w-5 text-primary" />
                  Categories
                </CardTitle>
                <CardDescription>Distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasksByCategoryData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span>{category.name}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{category.tasks}</span>
                        <div className="ml-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div 
                            className="h-2.5 rounded-full" 
                            style={{ 
                              width: `${(category.tasks / totalTasks) * 100}%`,
                              backgroundColor: category.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
        </TabsContent>

        <TabsContent value="analytics">
          <DashboardAnalytics tasks={state.tasks} />
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Task Progress</CardTitle>
              <CardDescription>Your productivity trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      className="text-gray-200 stroke-current" 
                      strokeWidth="10" 
                      cx="50" cy="50" r="40" 
                      fill="transparent"
                    />
                    <circle 
                      className="text-primary stroke-current" 
                      strokeWidth="10" 
                      strokeLinecap="round" 
                      cx="50" cy="50" r="40" 
                      fill="transparent"
                      strokeDasharray={`${totalTasks ? (completedTasks / totalTasks) * 251.2 : 0} 251.2`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
                    <span className="text-sm text-muted-foreground">Completed</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">On Time</p>
                        <p className="text-xl font-bold">
                          {completedTasks - state.tasks.filter(t => 
                            t.completed && t.completedAt && t.dueDate && 
                            new Date(t.completedAt) > new Date(t.dueDate)
                          ).length}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overdue</p>
                        <p className="text-xl font-bold">{overdueTasks}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-500" />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Efficiency</p>
                        <p className="text-xl font-bold">
                          {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                        </p>
                      </div>
                      <LineChart className="h-8 w-8 text-blue-500" />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardView;
