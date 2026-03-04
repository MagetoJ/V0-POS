'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Utensils, 
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
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground flex items-center gap-3">
                <Utensils className="w-8 h-8 text-primary" />
                Menu Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your dishes and link them to inventory ingredients for recipe tracking.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              <Plus className="w-4 h-4" />
              New Menu Item
            </Button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Dishes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-foreground">42</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recipes Linked</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">38 / 42</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Currently Unavailable</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">4</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search menu items..." 
                className="pl-10 bg-background border-input text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-input text-foreground gap-2">
              <ListFilter className="w-4 h-4" />
              Filter by Category
            </Button>
          </div>

          {/* Menu Table */}
          <Card className="border-border bg-card/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-border">
                  <TableRow className="hover:bg-transparent border-border">
                    <TableHead className="text-muted-foreground">Menu Item</TableHead>
                    <TableHead className="text-muted-foreground">Category</TableHead>
                    <TableHead className="text-muted-foreground">Price</TableHead>
                    <TableHead className="text-muted-foreground">Recipe</TableHead>
                    <TableHead className="text-muted-foreground">Availability</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_MENU_ITEMS.map((item) => (
                    <TableRow key={item.id} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <p className="font-medium text-foreground">{item.name}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground font-semibold">
                        ${item.price.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <PackageSearch className="w-4 h-4 text-primary" />
                          <span>{item.ingredientsCount} ingredients</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          item.isAvailable 
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30' 
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
                        }>
                          {item.isAvailable ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/90 gap-1">
                            <Eye className="w-4 h-4" />
                            Recipes
                          </Button>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                <Settings2 className="w-4 h-4" />
                Recipe Auto-Deduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Ensure all menu items are correctly linked to inventory ingredients. When a sale is made, linked stock levels will be automatically adjusted.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
