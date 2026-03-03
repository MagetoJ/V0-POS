'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Pause,
  Play,
  Send,
} from 'lucide-react';

interface ShiftRecord {
  id: string;
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  breakDuration: number;
  totalHours: number;
  isToday: boolean;
}

export default function ShiftsPage() {
  const [shifts] = useState<ShiftRecord[]>([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      clockInTime: '09:00 AM',
      breakDuration: 30,
      totalHours: 0,
      isToday: true,
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      clockInTime: '08:30 AM',
      clockOutTime: '05:00 PM',
      breakDuration: 60,
      totalHours: 8.5,
      isToday: false,
    },
    {
      id: '3',
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
      clockInTime: '09:15 AM',
      clockOutTime: '05:30 PM',
      breakDuration: 30,
      totalHours: 8.25,
      isToday: false,
    },
    {
      id: '4',
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
      clockInTime: '08:00 AM',
      clockOutTime: '04:30 PM',
      breakDuration: 60,
      totalHours: 8.5,
      isToday: false,
    },
  ]);

  const [showSwapRequest, setShowSwapRequest] = useState(false);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);

  const currentShift = shifts[0];
  const pastShifts = shifts.slice(1);
  const totalHoursWeek = shifts.reduce((sum, shift) => sum + shift.totalHours, 0);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-100">
              Shift Management
            </h1>
            <p className="text-slate-400 mt-2">
              Track your hours, breaks, and manage shift swaps
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">{totalHoursWeek.toFixed(1)}h</p>
                <p className="text-xs text-slate-500 mt-1">Total hours</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Average Daily
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">
                  {(totalHoursWeek / shifts.length).toFixed(1)}h
                </p>
                <p className="text-xs text-slate-500 mt-1">Per shift</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50 col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">0</p>
                <p className="text-xs text-slate-500 mt-1">Shift swaps</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Shift */}
          <Card className="border-slate-700 bg-slate-900/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-slate-100">Today's Shift</CardTitle>
                  <CardDescription>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </CardDescription>
                </div>
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="text-sm font-semibold text-green-400">In Progress</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <p className="text-sm text-slate-400">Clocked In</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-100">{currentShift.clockInTime}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Pause className="w-4 h-4 text-orange-400" />
                    <p className="text-sm text-slate-400">Break Duration</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-100">{currentShift.breakDuration}m</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <p className="text-sm text-slate-400">Time Elapsed</p>
                  </div>
                  <p className="text-3xl font-bold text-slate-100">4h 30m</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 h-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Start Break
                </Button>
                <Button className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-medium py-6 h-auto">
                  <Clock className="w-4 h-4 mr-2" />
                  Clock Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Shift Swap Request */}
          {!showSwapRequest && (
            <Button
              onClick={() => setShowSwapRequest(true)}
              className="w-full border-slate-700 text-slate-100 hover:bg-slate-800 font-medium py-6 h-auto"
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Shift Swap
            </Button>
          )}

          {showSwapRequest && (
            <Card className="border-blue-500/30 bg-blue-500/5">
              <CardHeader>
                <CardTitle className="text-slate-100">Request Shift Swap</CardTitle>
                <CardDescription>Select a shift to request a swap</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastShifts.map(shift => (
                    <button
                      key={shift.id}
                      onClick={() => setSelectedShift(shift.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedShift === shift.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <p className="text-sm font-semibold text-slate-100">
                        {new Date(shift.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {shift.clockInTime} - {shift.clockOutTime || 'In progress'}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        {shift.totalHours > 0 ? `${shift.totalHours}h worked` : 'Upcoming'}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    disabled={!selectedShift}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Submit Request
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSwapRequest(false);
                      setSelectedShift(null);
                    }}
                    variant="outline"
                    className="flex-1 border-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Past Shifts */}
          <div>
            <h2 className="text-xl font-bold text-slate-100 mb-4">
              Shift History
            </h2>
            <div className="space-y-3">
              {pastShifts.map(shift => (
                <Card
                  key={shift.id}
                  className="border-slate-800 bg-slate-900/50 hover:bg-slate-900/70 transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">
                            {new Date(shift.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-slate-400 mt-1">
                            {shift.clockInTime} - {shift.clockOutTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-100">{shift.totalHours}h</p>
                        <p className="text-sm text-slate-400">Total time</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
