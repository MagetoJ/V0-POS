'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  ArrowUpRight, 
  ArrowDownLeft,
  Tag,
  Box,
  LayoutGrid
} from 'lucide-react';

const MOCK_INVENTORY = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Espresso Beans (Dark Roast)',
    category: 'Coffee',
    stockLevel: 45,
    reorderPoint: 50,
    unit: 'kg',
    price: 25.50,
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Whole Milk',
    category: 'Dairy',
    stockLevel: 12,
    reorderPoint: 20,
    unit: 'L',
    price: 2.10,
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Sugar Packets',
    category: 'Additives',
    stockLevel: 2500,
    reorderPoint: 500,
    unit: 'pcs',
    price: 0.05,
  },
  {
    id: '4',
    sku: 'SKU004',
    name: 'Croissants (Frozen)',
    category: 'Bakery',
    stockLevel: 120,
    reorderPoint: 100,
    unit: 'pcs',
    price: 1.25,
  },
  {
    id: '5',
    sku: 'SKU005',
    name: 'Paper Cups (12oz)',
    category: 'Packaging',
    stockLevel: 80,
    reorderPoint: 200,
    unit: 'pcs',
    price: 0.15,
  }
];

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = MOCK_INVENTORY.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                Inventory Management
              </h1>
              <p className="text-slate-400 mt-2">
                Monitor stock levels, track movements, and manage reorders.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
                <History className="w-4 h-4" />
                History
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Plus className="w-4 h-4" />
                Add Item
              </Button>
            </div>
          </div>

          {/* Alert Banner */}
          {MOCK_INVENTORY.some(i => i.stockLevel < i.reorderPoint) && (
            <Card className="border-orange-500/30 bg-orange-500/10">
              <CardContent className="py-3 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">3 items are below reorder level. Please check your stock.</span>
                </div>
                <Button variant="ghost" size="sm" className="text-orange-400 hover:bg-orange-500/20">
                  View Low Stock
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">{MOCK_INVENTORY.length}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-400">$8,245.50</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Low Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-400">3</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-400">0</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search inventory..." 
                className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
              <Filter className="w-4 h-4" />
              Categories
            </Button>
          </div>

          {/* Inventory Table */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-slate-800">
                  <TableRow className="hover:bg-transparent border-slate-800">
                    <TableHead className="text-slate-400">Item Name</TableHead>
                    <TableHead className="text-slate-400">SKU</TableHead>
                    <TableHead className="text-slate-400">Category</TableHead>
                    <TableHead className="text-slate-400">Stock Level</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400 text-right">Unit Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <p className="font-medium text-slate-100">{item.name}</p>
                      </TableCell>
                      <TableCell className="text-slate-400 text-xs font-mono">
                        {item.sku}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-700 text-slate-400 font-normal">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex items-center gap-2">
                          <span className={item.stockLevel < item.reorderPoint ? 'text-orange-400 font-bold' : ''}>
                            {item.stockLevel} {item.unit}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.stockLevel < item.reorderPoint ? (
                          <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                            Healthy
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right text-slate-100 font-medium">
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
