'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  Utensils, 
  ChevronRight, 
  Settings2,
  ListFilter,
  PackageSearch,
  Eye,
  Edit2
} from 'lucide-react';

const MOCK_MENU_ITEMS = [
  {
    id: '1',
    name: 'Classic Espresso',
    category: 'Coffee',
    price: 3.50,
    ingredientsCount: 2,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Almond Croissant',
    category: 'Bakery',
    price: 4.25,
    ingredientsCount: 4,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Chicken Caesar Salad',
    category: 'Lunch',
    price: 12.50,
    ingredientsCount: 7,
    isAvailable: false,
  },
  {
    id: '4',
    name: 'Iced Matcha Latte',
    category: 'Tea',
    price: 5.50,
    ingredientsCount: 3,
    isAvailable: true,
  },
];

export default function MenuManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 flex items-center gap-3">
                <Utensils className="w-8 h-8 text-blue-500" />
                Menu Management
              </h1>
              <p className="text-slate-400 mt-2">
                Manage your dishes and link them to inventory ingredients for recipe tracking.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              New Menu Item
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">42</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Recipes Linked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">38 / 42</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Currently Unavailable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-400">4</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search menu items..." 
                className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
              <ListFilter className="w-4 h-4" />
              Filter by Category
            </Button>
          </div>

          {/* Menu Table */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-slate-800">
                  <TableRow className="hover:bg-transparent border-slate-800">
                    <TableHead className="text-slate-400">Menu Item</TableHead>
                    <TableHead className="text-slate-400">Category</TableHead>
                    <TableHead className="text-slate-400">Price</TableHead>
                    <TableHead className="text-slate-400">Recipe</TableHead>
                    <TableHead className="text-slate-400">Availability</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MENU_ITEMS.map((item) => (
                    <TableRow key={item.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <p className="font-medium text-slate-100">{item.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-700 text-slate-400">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-100 font-semibold">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <PackageSearch className="w-4 h-4 text-blue-500" />
                          <span>{item.ingredientsCount} ingredients</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          item.isAvailable 
                            ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 gap-1">
                            <Eye className="w-4 h-4" />
                            Recipes
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recipe Linking Info */}
          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Recipe Auto-Deduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">
                Ensure all menu items are correctly linked to inventory ingredients. When a sale is made, linked stock levels will be automatically adjusted.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
