'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  History,
  Globe
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const MOCK_INVENTORY = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Espresso Beans (Dark Roast)',
    category: 'Coffee',
    itemType: 'menu',
    stockLevel: 45,
    reorderPoint: 50,
    unit: 'kg',
    price: 25.50,
    showOnline: true,
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Whole Milk',
    category: 'Dairy',
    itemType: 'menu',
    stockLevel: 12,
    reorderPoint: 20,
    unit: 'L',
    price: 2.10,
    showOnline: false,
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Heineken (330ml)',
    category: 'Beer',
    itemType: 'bar',
    stockLevel: 48,
    reorderPoint: 24,
    unit: 'btl',
    price: 4.50,
    showOnline: true,
  },
  {
    id: '4',
    sku: 'SKU004',
    name: 'Classic Burger',
    category: 'Food',
    itemType: 'menu',
    stockLevel: 0,
    reorderPoint: 0,
    unit: 'serv',
    price: 12.00,
    showOnline: true,
  },
  {
    id: '5',
    sku: 'SKU005',
    name: 'Red Wine (Merlot)',
    category: 'Wine',
    itemType: 'bar',
    stockLevel: 15,
    reorderPoint: 6,
    unit: 'btl',
    price: 35.00,
    showOnline: false,
  }
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inventory, setInventory] = useState(MOCK_INVENTORY);

  const handleToggleOnline = async (itemId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    
    // Update UI immediately (optimistic)
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, showOnline: newStatus } : item
    ));

    try {
      const response = await fetch(`/api/inventory/${itemId}/online`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_online: newStatus }),
      });
      if (!response.ok) throw new Error('Update failed');
    } catch (error) {
      console.error('Error updating inventory online status:', error);
      // Revert UI on error
      setInventory(prev => prev.map(item => 
        item.id === itemId ? { ...item, showOnline: currentStatus } : item
      ));
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Package className="w-8 h-8 text-primary" />
                Inventory Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor stock levels, track movements, and manage reorders.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-input text-foreground gap-2 hover:bg-accent">
                <History className="w-4 h-4" />
                History
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Alert Banner */}
          {MOCK_INVENTORY.some(i => i.stockLevel < i.reorderPoint) && (
            <Card className="border-orange-500/30 bg-orange-500/10">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">3 items are below reorder level. Please check your stock.</span>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-600 dark:text-orange-400 hover:bg-orange-500/20">
                  View Low Stock
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">{MOCK_INVENTORY.length}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">$8,245.50</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">0</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search inventory..." 
                className="pl-10 bg-background border-input text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-input text-foreground gap-2 hover:bg-accent">
              <Filter className="w-4 h-4" />
              Categories
            </Button>
          </div>

          {/* Inventory Table */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-border">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground">Item Name</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground">Inventory Logic</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Globe className="w-3 h-3" />
                        Online
                      </div>
                    </TableHead>
                    <TableHead className="text-muted-foreground text-right">Unit Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-accent/50">
                      <TableCell>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-muted-foreground text-[10px] font-mono">{item.sku}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.itemType === 'bar' ? 'default' : 'secondary'} className="text-[10px] h-5">
                          {item.itemType.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border text-muted-foreground font-normal">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground/80">
                        {item.itemType === 'bar' ? (
                          <div className="flex flex-col">
                            <span className={item.stockLevel < item.reorderPoint ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-blue-400'}>
                              {item.stockLevel} {item.unit} (Auto)
                            </span>
                          </div>
                        ) : (
                          <span className="text-green-400 text-sm">Menu (Static)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.itemType === 'bar' ? (
                          item.stockLevel < item.reorderPoint ? (
                            <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30">
                              Healthy
                            </Badge>
                          )
                        ) : (
                          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30">
                            Available
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={item.showOnline} 
                          onCheckedChange={() => handleToggleOnline(item.id, item.showOnline)} 
                        />
                      </TableCell>
                      <TableCell className="text-right text-foreground font-medium">
                        ${item.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
