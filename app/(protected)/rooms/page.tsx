'use client';

import { useState, useEffect } from 'react';
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
  User,
  Calendar,
  Loader2
} from 'lucide-react';
import { Room } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`);
      if (!response.ok) throw new Error('Failed to fetch rooms');
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load rooms.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = filter === 'all' 
    ? rooms 
    : rooms.filter(room => room.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30';
      case 'occupied': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'dirty': return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'maintenance': return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
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

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center lg:ml-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Bed className="w-8 h-8 text-primary" />
                Room Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor room availability, status, and maintenance.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              New Reservation
            </Button>
          </div>

          {/* Room Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-foreground">{rooms.length}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Total Rooms</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {rooms.filter(r => r.status === 'available').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Available</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-primary">
                  {rooms.filter(r => r.status === 'occupied').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Occupied</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardContent className="pt-6">
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {rooms.filter(r => r.status === 'dirty' || r.status === 'maintenance').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Out of Service</p>
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
                className={`capitalize ${filter === s ? 'bg-primary text-primary-foreground' : 'border-input text-muted-foreground'}`}
                size="sm"
              >
                {s}
              </Button>
            ))}
          </div>

          {/* Room Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room) => (
              <Card key={room.id} className={`border-border bg-card/50 hover:border-primary transition-all ${room.status === 'occupied' ? 'ring-1 ring-primary/20' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-bold text-foreground">Room {room.room_number}</span>
                    <Badge className={getStatusColor(room.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(room.status)}
                        <span className="capitalize">{room.status}</span>
                      </div>
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">{room.room_type}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {room.status === 'occupied' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                        <User className="w-4 h-4 text-primary" />
                        <span>{room.guest_name || 'Guest'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Depart: {room.check_out_date ? new Date(room.check_out_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  )}
                  {room.status === 'available' && (
                    <div className="text-sm font-semibold text-foreground">
                      Rate: KSh {(room.rate || 0).toLocaleString()} / night
                    </div>
                  )}
                  <div className="pt-2">
                    <Button variant="outline" className="w-full border-input text-foreground hover:bg-muted text-xs">
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
