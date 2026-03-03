'use client';

import { useAuth } from '@/lib/auth-context';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  BarChart3,
  Users,
  Calendar,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data for demonstration
  const todayStats = {
    totalSales: 3450.50,
    transactions: 28,
    averageTransaction: 123.20,
    customerSatisfaction: 4.5,
  };

  const currentShift = {
    clockInTime: new Date(Date.now() - 4 * 60 * 60 * 1000).toLocaleTimeString(),
    isActive: true,
    hoursWorked: 4,
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-100">
              Welcome, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-slate-400 mt-2">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 h-auto flex flex-col items-center justify-center gap-2"
            >
              <Clock className="w-6 h-6" />
              Clock In/Out
            </Button>
            <Button 
              variant="outline"
              className="border-slate-700 text-slate-100 hover:bg-slate-800 font-medium py-6 h-auto flex flex-col items-center justify-center gap-2"
            >
              <Calendar className="w-6 h-6" />
              Request Shift Swap
            </Button>
          </div>

          {/* Current Shift Status */}
          {currentShift.isActive && (
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-100">Current Shift</CardTitle>
                    <CardDescription>Active shift in progress</CardDescription>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Clocked In</p>
                    <p className="text-lg font-semibold text-slate-100 mt-1">{currentShift.clockInTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Hours Worked</p>
                    <p className="text-lg font-semibold text-slate-100 mt-1">{currentShift.hoursWorked}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Today's Performance */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-100">Today's Performance</h2>
              <Button variant="outline" className="border-slate-700 text-slate-400 hover:text-slate-100">
                View Details
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Sales */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    Total Sales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-100">${todayStats.totalSales}</p>
                  <p className="text-xs text-green-400 mt-2">+12% from yesterday</p>
                </CardContent>
              </Card>

              {/* Transactions */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-100">{todayStats.transactions}</p>
                  <p className="text-xs text-slate-400 mt-2">Completed today</p>
                </CardContent>
              </Card>

              {/* Average Transaction */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Users className="w-4 h-4 text-orange-500" />
                    Avg. Transaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-100">${todayStats.averageTransaction}</p>
                  <p className="text-xs text-slate-400 mt-2">Per transaction</p>
                </CardContent>
              </Card>

              {/* Customer Satisfaction */}
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-500" />
                    Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-100">{todayStats.customerSatisfaction}/5</p>
                  <p className="text-xs text-slate-400 mt-2">Customer rating</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Tips */}
          <Card className="border-slate-700 bg-slate-900/30 rounded-lg">
            <CardHeader>
              <CardTitle className="text-base text-slate-100 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400" />
                Quick Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-300">
              You're performing {Math.floor(Math.random() * 10) + 5}% above the daily target. Great work today!
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
