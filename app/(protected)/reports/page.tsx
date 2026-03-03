'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  BarChart3,
  ClipboardList
} from 'lucide-react';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4500, expenses: 3200 },
  { name: 'Tue', revenue: 5200, expenses: 3100 },
  { name: 'Wed', revenue: 4800, expenses: 3400 },
  { name: 'Thu', revenue: 6100, expenses: 3800 },
  { name: 'Fri', revenue: 7500, expenses: 4200 },
  { name: 'Sat', revenue: 8200, expenses: 4500 },
  { name: 'Sun', revenue: 6800, expenses: 4100 },
];

const REVENUE_BY_SOURCE = [
  { name: 'Rooms', value: 4500, fill: '#3b82f6' },
  { name: 'Restaurant', value: 3200, fill: '#10b981' },
  { name: 'Bar', value: 1800, fill: '#f59e0b' },
  { name: 'Room Service', value: 950, fill: '#8b5cf6' },
];

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-500" />
                Financial Reports
              </h1>
              <p className="text-slate-400 mt-2">
                Analyze business performance with detailed financial summaries.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
                <FileText className="w-4 h-4" />
                Generate PDF
              </Button>
            </div>
          </div>

          {/* Filtering / Range Selection */}
          <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-slate-800 w-fit">
            {['daily', 'weekly', 'monthly', 'quarterly'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`capitalize ${timeRange === range ? 'bg-blue-600' : 'text-slate-400'}`}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* High-Level Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Gross Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-100">$45,100.50</p>
                  <div className="flex items-center text-green-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-100">$26,420.00</p>
                  <div className="flex items-center text-red-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +4.2%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-blue-400">$18,680.50</p>
                  <div className="flex items-center text-green-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +24.1%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-slate-100">78%</p>
                  <div className="flex items-center text-green-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +5.0%
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue vs Expenses Trend */}
            <Card className="lg:col-span-2 border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Revenue vs Operational Costs</CardTitle>
                <CardDescription>Daily comparison of income and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                        itemStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses ($)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-100">Revenue Distribution</CardTitle>
                <CardDescription>Income breakdown by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full mt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={REVENUE_BY_SOURCE}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {REVENUE_BY_SOURCE.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {REVENUE_BY_SOURCE.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                        <span className="text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-slate-100 font-medium">${item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Detailed Breakdown Table */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Performance Summary (MTD)</CardTitle>
              <CardDescription>Consolidated figures for the current period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Average Daily Rate (ADR)</p>
                  <p className="text-xl font-bold text-slate-100">$115.00</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Revenue Per Available Room (RevPAR)</p>
                  <p className="text-xl font-bold text-slate-100">$89.70</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">Customer Acquisition Cost (Avg)</p>
                  <p className="text-xl font-bold text-slate-100">$12.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
