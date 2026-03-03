'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bed, 
  DoorClosed, 
  Trash2, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Filter,
  User,
  Calendar
} from 'lucide-react';

const MOCK_ROOMS = [
  { id: '101', type: 'Standard Single', status: 'available', price: 85.00 },
  { id: '102', type: 'Standard Single', status: 'occupied', guest: 'John Doe', checkOut: '2024-03-05' },
  { id: '103', type: 'Deluxe Double', status: 'dirty', lastGuest: 'Sarah Smith' },
  { id: '104', type: 'Deluxe Double', status: 'maintenance', issue: 'AC Leak' },
  { id: '201', type: 'Suite', status: 'available', price: 150.00 },
  { id: '202', type: 'Suite', status: 'occupied', guest: 'Emily Watson', checkOut: '2024-03-10' },
  { id: '203', type: 'Executive Suite', status: 'available', price: 250.00 },
  { id: '204', type: 'Executive Suite', status: 'dirty', lastGuest: 'Michael Brown' },
];

export default function RoomManagementPage() {
  const [filter, setFilter] = useState('all');

  const filteredRooms = filter === 'all' 
    ? MOCK_ROOMS 
    : MOCK_ROOMS.filter(room => room.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'occupied': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'dirty': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'maintenance': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="w-4 h-4" />;
      case 'occupied': return <DoorClosed className="w-4 h-4" />;
      case 'dirty': return <Trash2 className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 flex items-center gap-3">
                <Bed className="w-8 h-8 text-blue-500" />
                Room Management
              </h1>
              <p className="text-slate-400 mt-2">
                Monitor room availability, status, and maintenance.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Reservation
            </Button>
          </div>

          {/* Room Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-slate-100">{MOCK_ROOMS.length}</p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Total Rooms</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-green-400">
                  {MOCK_ROOMS.filter(r => r.status === 'available').length}
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Available</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-blue-400">
                  {MOCK_ROOMS.filter(r => r.status === 'occupied').length}
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Occupied</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-orange-400">
                  {MOCK_ROOMS.filter(r => r.status === 'dirty' || r.status === 'maintenance').length}
                </p>
                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Out of Service</p>
              </CardContent>
            </Card>
          </div>

          {/* Filtering */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {['all', 'available', 'occupied', 'dirty', 'maintenance'].map((s) => (
              <Button
                key={s}
                variant={filter === s ? 'default' : 'outline'}
                onClick={() => setFilter(s)}
                className={`capitalize ${filter === s ? 'bg-blue-600' : 'border-slate-700 text-slate-400'}`}
                size="sm"
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className={`border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all ${room.status === 'occupied' ? 'ring-1 ring-blue-500/20' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-bold text-slate-100">Room {room.id}</span>
                    <Badge className={getStatusColor(room.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(room.status)}
                        <span className="capitalize">{room.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <CardDescription className="text-slate-400">{room.type}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {room.status === 'occupied' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-200 font-medium">
                        <User className="w-4 h-4 text-blue-400" />
                        <span>{room.guest}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Calendar className="w-4 h-4" />
                        <span>Depart: {room.checkOut}</span>
                      </div>
                    </div>
                  )}
                  {room.status === 'available' && (
                    <div className="text-sm font-semibold text-slate-100">
                      Rate: ${room.price.toFixed(2)} / night
                    </div>
                  )}
                  {room.status === 'dirty' && (
                    <div className="text-xs text-slate-500 italic">
                      Needs cleaning after {room.lastGuest}
                    </div>
                  )}
                  {room.status === 'maintenance' && (
                    <div className="text-xs text-red-400 italic">
                      Issue: {room.issue}
                    </div>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 text-xs">
                      Manage Room
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
