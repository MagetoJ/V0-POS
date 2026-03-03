'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Award } from 'lucide-react';

interface PerformanceData {
  date: string;
  sales: number;
  transactions: number;
  satisfaction: number;
}

interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
}

export default function PerformancePage() {
  const performanceData: PerformanceData[] = [
    { date: 'Mon', sales: 2800, transactions: 18, satisfaction: 4.2 },
    { date: 'Tue', sales: 3200, transactions: 22, satisfaction: 4.4 },
    { date: 'Wed', sales: 2900, transactions: 19, satisfaction: 4.1 },
    { date: 'Thu', sales: 3500, transactions: 25, satisfaction: 4.6 },
    { date: 'Fri', sales: 4100, transactions: 28, satisfaction: 4.8 },
    { date: 'Sat', sales: 3800, transactions: 26, satisfaction: 4.5 },
    { date: 'Sun', sales: 3200, transactions: 21, satisfaction: 4.3 },
  ];

  const productCategoryData = [
    { name: 'Electronics', value: 35, fill: '#3b82f6' },
    { name: 'Apparel', value: 28, fill: '#ec4899' },
    { name: 'Home & Garden', value: 22, fill: '#f59e0b' },
    { name: 'Sports', value: 15, fill: '#8b5cf6' },
  ];

  const metrics: MetricCard[] = [
    {
      label: 'Weekly Sales',
      value: '$23,500',
      change: '+12% vs last week',
      icon: <TrendingUp className="w-5 h-5 text-green-400" />,
    },
    {
      label: 'Target Achievement',
      value: '108%',
      change: 'Above goal',
      icon: <Target className="w-5 h-5 text-blue-400" />,
    },
    {
      label: 'Customer Rating',
      value: '4.5/5',
      change: '+0.3 from last week',
      icon: <Award className="w-5 h-5 text-purple-400" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-100">
              Performance Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Track your sales, customer satisfaction, and achievement metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((metric, idx) => (
              <Card key={idx} className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-slate-400">
                      {metric.label}
                    </CardTitle>
                    {metric.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-100">{metric.value}</p>
                  <p className="text-xs text-green-400 mt-2">{metric.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sales Trend */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Weekly Sales Trend</CardTitle>
              <CardDescription>Your daily sales performance this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                    name="Sales ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transactions & Satisfaction */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Transactions Per Day</CardTitle>
                <CardDescription>Number of completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="transactions" fill="#ec4899" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Sales by Category</CardTitle>
                <CardDescription>Breakdown of your sales this week</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {productCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Customer Satisfaction Trend */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Customer Satisfaction Trend</CardTitle>
              <CardDescription>Weekly satisfaction rating progression</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis domain={[0, 5]} stroke="#64748b" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                    name="Rating (out of 5)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card className="border-slate-700 bg-linear-to-r from-blue-500/10 to-purple-500/10">
            <CardHeader>
              <CardTitle className="text-slate-100">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  Your Friday sales (${performanceData[4].sales}) were your best this week. Continue that momentum!
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  You've exceeded your weekly target by 8%. You're performing significantly above expectations.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                <p className="text-sm text-slate-300">
                  Customer satisfaction is trending upward. Your average rating of 4.5/5 is excellent.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
