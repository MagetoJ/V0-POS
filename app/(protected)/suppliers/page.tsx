'use client';

import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Truck, 
  Plus, 
  Phone, 
  Mail, 
  Calendar,
  AlertCircle,
  PackageCheck,
  Users
} from 'lucide-react';

const MOCK_SUPPLIERS = [
  {
    id: '1',
    name: 'Gourmet Beans Co.',
    contactPerson: 'Alex Reed',
    phone: '555-0201',
    email: 'alex@gourmetbeans.com',
    category: 'Coffee & Tea',
    status: 'active',
  },
  {
    id: '2',
    name: 'Fresh Dairy Express',
    contactPerson: 'Maria Garcia',
    phone: '555-0202',
    email: 'maria@freshdairy.com',
    category: 'Dairy',
    status: 'active',
  },
  {
    id: '3',
    name: 'Artisan Bakery Supplies',
    contactPerson: 'Tom Baker',
    phone: '555-0203',
    email: 'tom@artisanbakery.com',
    category: 'Bakery',
    status: 'active',
  },
];

const MOCK_PO = [
  {
    id: 'PO-001',
    supplier: 'Gourmet Beans Co.',
    date: '2024-03-01',
    amount: 1250.00,
    status: 'pending',
  },
  {
    id: 'PO-002',
    supplier: 'Fresh Dairy Express',
    date: '2024-02-28',
    amount: 450.00,
    status: 'received',
  },
  {
    id: 'PO-003',
    supplier: 'Artisan Bakery Supplies',
    date: '2024-02-25',
    amount: 890.00,
    status: 'returned',
  },
];

export default function SuppliersPage() {
  const loading = false;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Truck className="w-8 h-8 text-primary" />
                Suppliers & POs
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage vendor relationships and purchase orders.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              New Purchase Order
            </Button>
          </div>

          <Tabs defaultValue="suppliers" className="space-y-6">
            <TabsList className="bg-muted border border-border p-1">
              <TabsTrigger value="suppliers" className="data-[state=active]:bg-background text-muted-foreground data-[state=active]:text-foreground">
                Suppliers
              </TabsTrigger>
              <TabsTrigger value="po" className="data-[state=active]:bg-background text-muted-foreground data-[state=active]:text-foreground">
                Purchase Orders
              </TabsTrigger>
              <TabsTrigger value="returns" className="data-[state=active]:bg-background text-muted-foreground data-[state=active]:text-foreground">
                Product Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suppliers" className="space-y-6 outline-none">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-muted-foreground gap-4">
                  <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  <p className="font-medium">Loading Suppliers...</p>
                </div>
              ) : !MOCK_SUPPLIERS || MOCK_SUPPLIERS.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border rounded-xl bg-muted/20 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground/80">No suppliers found</h3>
                  <p className="text-muted-foreground max-w-sm mt-1">Start by adding your first supplier to manage your inventory and purchase orders.</p>
                  <Button variant="outline" className="mt-6 border-input text-foreground hover:bg-accent">
                    <Plus className="w-4 h-4 mr-2" /> Add Supplier
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MOCK_SUPPLIERS.map((supplier) => (
                    <Card key={supplier.id} className="border-border bg-card/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Truck className="w-5 h-5 text-primary" />
                          </div>
                          <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
                            {supplier.status}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-foreground mt-4">{supplier.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">{supplier.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span>{supplier.contactPerson}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-4 h-4 text-muted-foreground/70" />
                            <span>{supplier.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-4 h-4 text-muted-foreground/70" />
                            <span>{supplier.email}</span>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full border-input text-foreground hover:bg-accent">
                          View Supplier Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                  <Card 
                    className="border-dashed border-border bg-transparent hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center p-8 min-h-[250px]"
                    onClick={() => {}}
                  >
                    <Plus className="w-8 h-8 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">Add New Supplier</p>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="po" className="outline-none">
              <Card className="border-border bg-card/50">
                <CardContent className="p-0">
                  {!MOCK_PO || MOCK_PO.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-muted-foreground">No purchase orders found.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader className="border-border">
                        <TableRow className="hover:bg-transparent border-border">
                          <TableHead className="text-muted-foreground">Order ID</TableHead>
                          <TableHead className="text-muted-foreground">Supplier</TableHead>
                          <TableHead className="text-muted-foreground">Date</TableHead>
                          <TableHead className="text-muted-foreground">Total Amount</TableHead>
                          <TableHead className="text-muted-foreground">Status</TableHead>
                          <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {MOCK_PO.map((order) => (
                          <TableRow key={order.id} className="border-border hover:bg-accent/50">
                            <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                            <TableCell className="text-foreground/80">{order.supplier}</TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {order.date}
                              </div>
                            </TableCell>
                            <TableCell className="text-foreground font-semibold">
                              ${order.amount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {order.status === 'pending' && (
                                <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30">
                                  Pending
                                </Badge>
                              )}
                              {order.status === 'received' && (
                                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
                                  Received
                                </Badge>
                              )}
                              {order.status === 'returned' && (
                                <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30">
                                  Returned
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="returns" className="outline-none">
              <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <PackageCheck className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Product Returns Tracking</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                    Manage and track defective or incorrect products returned to suppliers.
                  </p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                  Initiate Return
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
