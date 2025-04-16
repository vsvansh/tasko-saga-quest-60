import React, { useState } from 'react';
import { useTodo } from '@/context/TodoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Clock, AlertTriangle, CalendarDays, BarChart3, ChartPieIcon, LineChart, Layers } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardAnalytics from './DashboardAnalytics';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardView = () => {
  const { state } = useTodo();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = state.tasks.filter(task => 
    task.dueDate && 
    !task.completed && 
    new Date(task.dueDate) < new Date()
  ).length;
  
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'Pending', value: pendingTasks, color: '#3B82F6' },
    { name: 'Overdue', value: overdueTasks, color: '#EF4444' },
  ].filter(item => item.value > 0);
  
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="overview" 
        value={activeTab} 
        onValueChange={handleTabChange} 
        className="space-y-6"
      >
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

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <TabsContent value="overview" key="overview">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -10 }}
                variants={containerVariants}
              >
                <motion.div variants={itemVariants}>
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
                              animationBegin={0}
                              animationDuration={1500}
                              animationEasing="ease-out"
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
                      <motion.div 
                        className="grid grid-cols-3 gap-4 mt-4 text-center"
                        variants={{
                          hidden: { opacity: 0 },
                          visible: { 
                            opacity: 1,
                            transition: { 
                              staggerChildren: 0.1,
                              delayChildren: 0.3
                            }
                          }
                        }}
                      >
                        <motion.div 
                          className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg"
                          variants={{
                            hidden: { scale: 0.8, opacity: 0 },
                            visible: { 
                              scale: 1, 
                              opacity: 1,
                              transition: { type: "spring", stiffness: 300, damping: 15 }
                            }
                          }}
                        >
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedTasks}</div>
                          <div className="text-sm text-green-800 dark:text-green-300">Completed</div>
                        </motion.div>
                        <motion.div 
                          className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg"
                          variants={{
                            hidden: { scale: 0.8, opacity: 0 },
                            visible: { 
                              scale: 1, 
                              opacity: 1,
                              transition: { type: "spring", stiffness: 300, damping: 15 }
                            }
                          }}
                        >
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks}</div>
                          <div className="text-sm text-blue-800 dark:text-blue-300">Pending</div>
                        </motion.div>
                        <motion.div 
                          className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg"
                          variants={{
                            hidden: { scale: 0.8, opacity: 0 },
                            visible: { 
                              scale: 1, 
                              opacity: 1,
                              transition: { type: "spring", stiffness: 300, damping: 15 }
                            }
                          }}
                        >
                          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</div>
                          <div className="text-sm text-red-800 dark:text-red-300">Overdue</div>
                        </motion.div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
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
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ 
                              width: "100%", 
                              opacity: 1,
                              transition: { delay: index * 0.1 + 0.3, duration: 0.5 }
                            }}
                          >
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
                                <motion.div 
                                  className="h-2.5 rounded-full" 
                                  style={{ backgroundColor: category.color }}
                                  initial={{ width: 0 }}
                                  animate={{ 
                                    width: `${(category.tasks / totalTasks) * 100}%`,
                                    transition: { delay: index * 0.1 + 0.5, duration: 0.8 }
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants} className="md:col-span-2">
                  <Card>
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
                          {upcomingTasks.map((task, index) => (
                            <motion.div 
                              key={task.id} 
                              className="py-3 flex items-center justify-between"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ 
                                x: 0, 
                                opacity: 1,
                                transition: { delay: index * 0.1, duration: 0.5 }
                              }}
                            >
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
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>No upcoming deadlines for the next 7 days</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          )}

          {activeTab === "analytics" && (
            <TabsContent value="analytics" key="analytics" forceMount>
              <DashboardAnalytics tasks={state.tasks} />
            </TabsContent>
          )}

          {activeTab === "progress" && (
            <TabsContent value="progress" key="progress" forceMount>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
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
                          <motion.circle 
                            className="text-primary stroke-current" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                            cx="50" cy="50" r="40" 
                            fill="transparent"
                            initial={{ strokeDasharray: "0 251.2" }}
                            animate={{ 
                              strokeDasharray: `${totalTasks ? (completedTasks / totalTasks) * 251.2 : 0} 251.2`,
                              transition: { duration: 1.5, ease: "easeInOut" }
                            }}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <motion.span 
                            className="text-4xl font-bold"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: 1,
                              transition: { delay: 0.5, duration: 0.5 }
                            }}
                          >
                            {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                          </motion.span>
                          <span className="text-sm text-muted-foreground">Completed</span>
                        </div>
                      </div>
                      <motion.div 
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { delay: 0.8, duration: 0.5 }
                        }}
                      >
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
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default DashboardView;
