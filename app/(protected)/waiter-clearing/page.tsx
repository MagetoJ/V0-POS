'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  UtensilsCrossed, 
  CreditCard, 
  Banknote, 
  Split, 
  Trash2, 
  User, 
  Receipt,
  ArrowRightCircle
} from 'lucide-react';

const MOCK_TABLES = [
  { id: 'T-10', status: 'occupied', guestCount: 4, subtotal: 85.50, items: 6, waiter: 'EMP001' },
  { id: 'T-12', status: 'clearing', guestCount: 2, subtotal: 42.00, items: 3, waiter: 'EMP001' },
  { id: 'T-05', status: 'occupied', guestCount: 1, subtotal: 18.25, items: 2, waiter: 'EMP002' },
  { id: 'T-08', status: 'clearing', guestCount: 6, subtotal: 156.40, items: 12, waiter: 'EMP001' },
];

export default function WaiterClearingPage() {
  const [filter, setFilter] = useState('all');

  const filteredTables = filter === 'all' 
    ? MOCK_TABLES 
    : MOCK_TABLES.filter(t => t.status === filter);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-primary" />
                Waiter Clearing
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your active tables, settle bills, and finalize tips.
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Unsettled Tips</span>
              <span className="text-lg font-bold text-primary">KSh 24.50</span>
            </div>
          </div>

          {/* Table Filters */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg border border-border w-fit">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
            >
              All Tables
            </Button>
            <Button
              variant={filter === 'occupied' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('occupied')}
              className={filter === 'occupied' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
            >
              Occupied
            </Button>
            <Button
              variant={filter === 'clearing' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('clearing')}
              className={filter === 'clearing' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}
            >
              Pending Settlement
            </Button>
          </div>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTables.map((table) => (
              <Card key={table.id} className={`border-border bg-card/50 hover:border-primary/50 transition-all ${table.status === 'clearing' ? 'ring-1 ring-primary/30' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <span className="text-2xl font-bold text-foreground">{table.id}</span>
                    <Badge className={
                      table.status === 'occupied' 
                        ? 'bg-primary/10 text-primary border border-primary/30' 
                        : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30 animate-pulse'
                    }>
                      {table.status === 'occupied' ? 'Dining' : 'Clearing'}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-3 h-3" />
                    {table.guestCount} Guests • {table.items} Items
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex justify-between items-center bg-background p-3 rounded-lg border border-border">
                    <span className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Total</span>
                    <span className="text-xl font-bold text-foreground">KSh {table.subtotal.toLocaleString()}</span>
                  </div>

                  {table.status === 'occupied' ? (
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                      <Receipt className="w-4 h-4" />
                      Close Table
                    </Button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="border-input text-foreground hover:bg-accent flex items-center justify-center gap-2">
                        <CreditCard className="w-4 h-4 text-primary" />
                        Card
                      </Button>
                      <Button variant="outline" className="border-input text-foreground hover:bg-accent flex items-center justify-center gap-2">
                        <Banknote className="w-4 h-4 text-green-600 dark:text-green-400" />
                        Cash
                      </Button>
                      <Button variant="outline" className="col-span-2 border-input text-muted-foreground hover:bg-accent flex items-center justify-center gap-2 text-xs">
                        <Split className="w-3 h-3" />
                        Split Bill
                      </Button>
                    </div>
                  )}

                  <div className="pt-2">
                    <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center justify-center gap-1">
                      <Trash2 className="w-3 h-3" />
                      Transfer Table
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tip Summary & Handover */}
          <Card className="border-border bg-linear-to-r from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <UtensilsCrossed className="w-5 h-5 text-primary" />
                End of Shift Handover
              </CardTitle>
              <CardDescription>Finalize all tables and process tips for your shift</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex gap-8">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Sales</p>
                  <p className="text-2xl font-bold text-foreground">KSh 845.25</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Tips</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">KSh 112.50</p>
                </div>
              </div>
              <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold py-3 px-8 rounded-lg shadow-lg flex items-center gap-2">
                Finalize & Tip-Out
                <ArrowRightCircle className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
