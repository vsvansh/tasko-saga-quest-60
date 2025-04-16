import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { Task } from '@/types';
import { TrendingUp, Activity, CalendarClock, CheckCheck } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { motion } from 'framer-motion';

interface DashboardAnalyticsProps {
  tasks: Task[];
}

const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ tasks }) => {
  // Get date range for the last 7 days
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, i)).reverse();
  
  // Calculate tasks per day for the last 7 days
  const tasksPerDay = last7Days.map(date => {
    const tasksOnDay = tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
    return {
      date: format(date, 'EEE'),
      fullDate: format(date, 'MMM dd'),
      total: tasksOnDay.length,
      completed: tasksOnDay.filter(t => t.completed).length,
      active: tasksOnDay.filter(t => !t.completed).length
    };
  });

  // Calculate tasks by priority
  const tasksByPriority = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length },
  ];

  // Calculate completion rate over time
  const completionRateData = last7Days.map(date => {
    const tasksOnDay = tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
    
    const totalCount = tasksOnDay.length;
    const completedCount = tasksOnDay.filter(t => t.completed).length;
    const rate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
    
    return {
      date: format(date, 'EEE'),
      rate: Math.round(rate)
    };
  });

  // Calculate task distribution by day of week
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const tasksByDayOfWeek = daysOfWeek.map(day => {
    const count = tasks.filter(task => {
      if (!task.dueDate) return false;
      const dayIndex = new Date(task.dueDate).getDay();
      return daysOfWeek[dayIndex] === day;
    }).length;
    
    return { name: day.substring(0, 3), value: count };
  });

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#f43f5e'];
  
  // Calculate completion time (average days to complete tasks)
  const completedTasks = tasks.filter(t => t.completed && t.completedAt && t.createdAt);
  const avgCompletionDays = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdAt!);
        const completed = new Date(task.completedAt!);
        const diffTime = completed.getTime() - created.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return sum + diffDays;
      }, 0) / completedTasks.length
    : 0;

  // Animation variants for different chart types
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.3
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

  const statVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6" 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Task Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Task Activity
            </CardTitle>
            <CardDescription>Daily task statistics for the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksPerDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'active' ? 'Active' : 'Completed']}
                    labelFormatter={(label) => {
                      const item = tasksPerDay.find(d => d.date === label);
                      return item ? item.fullDate : label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#3B82F6" name="Active" animationDuration={1500} />
                  <Bar dataKey="completed" fill="#10B981" name="Completed" animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Completion Rate */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Completion Rate
            </CardTitle>
            <CardDescription>Daily completion percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={completionRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Completion Rate']} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Completion Rate %"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Priority Distribution */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCheck className="h-5 w-5 text-primary" />
              Priority Distribution
            </CardTitle>
            <CardDescription>Tasks by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByPriority}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  >
                    <Cell key="high" fill="#EF4444" />
                    <Cell key="medium" fill="#F59E0B" />
                    <Cell key="low" fill="#10B981" />
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Weekly Distribution */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-primary" />
              Weekly Distribution
            </CardTitle>
            <CardDescription>Task frequency by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksByDayOfWeek}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                  <Bar dataKey="value" name="Tasks" animationDuration={1500}>
                    {tasksByDayOfWeek.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Task Completion Stats */}
      <motion.div variants={itemVariants} className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Productivity Stats</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div 
                className="bg-primary/10 p-4 rounded-lg text-center"
                variants={statVariants}
              >
                <div className="text-3xl font-bold text-primary">
                  {tasks.filter(t => t.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed Tasks</div>
              </motion.div>
              <motion.div 
                className="bg-primary/10 p-4 rounded-lg text-center"
                variants={statVariants}
              >
                <div className="text-3xl font-bold text-primary">
                  {tasks.filter(t => !t.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">Pending Tasks</div>
              </motion.div>
              <motion.div 
                className="bg-primary/10 p-4 rounded-lg text-center"
                variants={statVariants}
              >
                <div className="text-3xl font-bold text-primary">
                  {avgCompletionDays.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Avg. Days to Complete</div>
              </motion.div>
              <motion.div 
                className="bg-primary/10 p-4 rounded-lg text-center"
                variants={statVariants}
              >
                <div className="text-3xl font-bold text-primary">
                  {tasks.filter(t => t.starred).length}
                </div>
                <div className="text-sm text-muted-foreground">Starred Tasks</div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardAnalytics;
