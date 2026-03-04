'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar,
  ArrowDownCircle,
  ArrowUpCircle
} from 'lucide-react';

const MOCK_INVOICES = [
  {
    id: 'INV-001',
    guestName: 'John Doe',
    roomNumber: '102',
    date: '2024-03-03',
    total: 245.50,
    status: 'paid',
    paymentMethod: 'Credit Card',
  },
  {
    id: 'INV-002',
    guestName: 'Emily Watson',
    roomNumber: '202',
    date: '2024-03-03',
    total: 125.00,
    status: 'pending',
    paymentMethod: 'Pending',
  },
  {
    id: 'INV-003',
    guestName: 'Sarah Smith',
    roomNumber: '103',
    date: '2024-03-02',
    total: 350.75,
    status: 'paid',
    paymentMethod: 'Cash',
  },
];

const MOCK_EXPENSES = [
  {
    id: 'EXP-001',
    category: 'Utilities',
    description: 'Electricity Bill - Feb',
    amount: 1200.00,
    date: '2024-03-01',
    status: 'paid',
  },
  {
    id: 'EXP-002',
    category: 'Payroll',
    description: 'Staff Salaries - Feb',
    amount: 8500.00,
    date: '2024-02-28',
    status: 'paid',
  },
  {
    id: 'EXP-003',
    category: 'Supplies',
    description: 'Cleaning Supplies Bulk',
    amount: 450.00,
    date: '2024-02-25',
    status: 'pending',
  },
];

export default function AccountingPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Wallet className="w-8 h-8 text-primary" />
                Accounting
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage invoices, guest folios, and operational expenses.
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Record Expense
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowUpCircle className="w-4 h-4 text-green-500" />
                  Total Revenue (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">$12,450.00</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ArrowDownCircle className="w-4 h-4 text-red-500" />
                  Total Expenses (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">$10,150.00</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Net Profit (MTD)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">$2,300.00</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="invoices" className="space-y-6">
            <TabsList className="bg-muted border border-border p-1">
              <TabsTrigger value="invoices" className="data-[state=active]:bg-background text-muted-foreground data-[state=active]:text-foreground">
                Invoices & Folios
              </TabsTrigger>
              <TabsTrigger value="expenses" className="data-[state=active]:bg-background text-muted-foreground data-[state=active]:text-foreground">
                Expenses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invoices" className="outline-none">
              <Card className="border-border bg-card/50">
                <CardHeader className="pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-foreground">Guest Invoices</CardTitle>
                      <CardDescription>View and manage recent billing</CardDescription>
                    </div>
                    <div className="relative w-full md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search guest or room..." 
                        className="pl-10 bg-background border-input text-foreground"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="border-border">
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="text-muted-foreground">Invoice ID</TableHead>
                        <TableHead className="text-muted-foreground">Guest</TableHead>
                        <TableHead className="text-muted-foreground">Room</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Total</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_INVOICES.map((invoice) => (
                        <TableRow key={invoice.id} className="border-border hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground">{invoice.id}</TableCell>
                          <TableCell className="text-foreground">{invoice.guestName}</TableCell>
                          <TableCell className="text-muted-foreground">{invoice.roomNumber}</TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {invoice.date}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground font-semibold">
                            ${invoice.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              invoice.status === 'paid' 
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' 
                                : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                            }>
                              {invoice.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90">
                              View Folio
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="outline-none">
              <Card className="border-border bg-card/50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-foreground">Operational Expenses</CardTitle>
                  <CardDescription>Tracking business costs and payments</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="border-border">
                      <TableRow className="hover:bg-transparent border-border">
                        <TableHead className="text-muted-foreground">Expense ID</TableHead>
                        <TableHead className="text-muted-foreground">Category</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-muted-foreground">Amount</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MOCK_EXPENSES.map((expense) => (
                        <TableRow key={expense.id} className="border-border hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground">{expense.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-border text-muted-foreground">
                              {expense.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-foreground">{expense.description}</TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              {expense.date}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground font-semibold">
                            ${expense.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              expense.status === 'paid' 
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' 
                                : 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30'
                            }>
                              {expense.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
