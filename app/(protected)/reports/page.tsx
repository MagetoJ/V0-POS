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
  Legend
} from 'recharts';
import { 
  FileText, 
  Download, 
  ArrowUpRight, 
  BarChart3
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
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-primary" />
                Financial Reports
              </h1>
              <p className="text-muted-foreground mt-2">
                Analyze business performance with detailed financial summaries.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-input text-foreground gap-2 hover:bg-accent">
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button variant="outline" className="border-input text-foreground gap-2 hover:bg-accent">
                <FileText className="w-4 h-4" />
                Generate PDF
              </Button>
            </div>
          </div>

          {/* Filtering / Range Selection */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg border border-border w-fit">
            {['daily', 'weekly', 'monthly', 'quarterly'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`capitalize ${timeRange === range ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
              >
                {range}
              </Button>
            ))}
          </div>

          {/* High-Level Summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Gross Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">KSh 45,100.50</p>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +12.5%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">KSh 26,420.00</p>
                  <div className="flex items-center text-destructive text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +4.2%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Net Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-primary">KSh 18,680.50</p>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                    +24.1%
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-foreground">78%</p>
                  <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
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
            <Card className="lg:col-span-2 border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-foreground">Revenue vs Operational Costs</CardTitle>
                <CardDescription>Daily comparison of income and spending</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-87.5 w-full mt-4 text-foreground">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="name" stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="currentColor" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KSh ${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                      />
                      <Legend />
                      <Bar dataKey="revenue" fill="var(--color-chart-1)" name="Revenue (KSh)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="var(--color-destructive)" name="Expenses (KSh)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-foreground">Revenue Distribution</CardTitle>
                <CardDescription>Income breakdown by source</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-75 w-full mt-8">
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
                        {REVENUE_BY_SOURCE.map((_entry, index) => (
                          <Cell key={`cell-${index}`} fill={`var(--color-chart-${index + 1})`} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {REVENUE_BY_SOURCE.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-chart-${index + 1})` }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                      <span className="text-foreground font-medium">KSh {item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Detailed Breakdown Table */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">Performance Summary (MTD)</CardTitle>
              <CardDescription>Consolidated figures for the current period</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Average Daily Rate (ADR)</p>
                  <p className="text-xl font-bold text-foreground">KSh 115</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Revenue Per Available Room (RevPAR)</p>
                  <p className="text-xl font-bold text-foreground">KSh 89.70</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Customer Acquisition Cost (Avg)</p>
                  <p className="text-xl font-bold text-foreground">KSh 12.50</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
