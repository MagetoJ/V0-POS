'use client';

import { useState, useMemo } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Clock,
  Calendar,
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
  const formattedToday = useMemo(() => new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'short', 
    day: 'numeric' 
  }), []);

  const [shifts] = useState<ShiftRecord[]>(() => [
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
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Shift Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your hours, breaks, and manage shift swaps
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{totalHoursWeek.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground mt-1">Total hours</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Daily
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">
                  {(totalHoursWeek / shifts.length).toFixed(1)}h
                </p>
                <p className="text-xs text-muted-foreground mt-1">Per shift</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50 col-span-2 lg:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground mt-1">Shift swaps</p>
              </CardContent>
            </Card>
          </div>

          {/* Current Shift */}
          <Card className="border-border bg-card/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-foreground">Today's Shift</CardTitle>
                  <CardDescription>
                    {formattedToday}
                  </CardDescription>
                </div>
                <div className="animate-pulse">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">In Progress</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <p className="text-sm text-muted-foreground">Clocked In</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{currentShift.clockInTime}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Pause className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-muted-foreground">Break Duration</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">{currentShift.breakDuration}m</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <p className="text-sm text-muted-foreground">Time Elapsed</p>
                  </div>
                  <p className="text-3xl font-bold text-foreground">4h 30m</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 h-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Start Break
                </Button>
                <Button className="bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 font-medium py-6 h-auto">
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
              className="w-full border-input text-foreground hover:bg-accent font-medium py-6 h-auto"
              variant="outline"
            >
              <Send className="w-4 h-4 mr-2" />
              Request Shift Swap
            </Button>
          )}

          {showSwapRequest && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-foreground">Request Shift Swap</CardTitle>
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
                          ? 'border-primary bg-primary/10'
                          : 'border-input hover:border-primary/50'
                      }`}
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {new Date(shift.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {shift.clockInTime} - {shift.clockOutTime || 'In progress'}
                      </p>
                      <p className="text-xs text-muted-foreground/80 mt-2">
                        {shift.totalHours > 0 ? `${shift.totalHours}h worked` : 'Upcoming'}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    disabled={!selectedShift}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Submit Request
                  </Button>
                  <Button
                    onClick={() => {
                      setShowSwapRequest(false);
                      setSelectedShift(null);
                    }}
                    variant="outline"
                    className="flex-1 border-input"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Past Shifts */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">
              Shift History
            </h2>
            <div className="space-y-3">
              {pastShifts.map(shift => (
                <Card
                  key={shift.id}
                  className="border-border bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {new Date(shift.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {shift.clockInTime} - {shift.clockOutTime}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{shift.totalHours}h</p>
                        <p className="text-sm text-muted-foreground">Total time</p>
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
