'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Clock,
  TrendingUp,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Users,
  Package,
  Truck,
  Bed,
  Receipt,
  Wallet,
  BarChart,
  CheckCircle2,
  Utensils,
  ConciergeBell,
  Brush,
  Layout,
  Wrench,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
  { href: '/quick-pos', label: 'Quick POS', icon: ShoppingBag, roles: ['admin', 'manager', 'cashier', 'waiter', 'staff'] },
  { href: '/rooms', label: 'Room Management', icon: Bed, roles: ['manager', 'admin', 'housekeeping'] },
  { href: '/housekeeping', label: 'Housekeeping', icon: Brush, roles: ['housekeeping', 'admin', 'manager'] },
  { href: '/inventory', label: 'Inventory', icon: Package, roles: ['manager', 'admin'] },
  { href: '/suppliers', label: 'Suppliers & POs', icon: Truck, roles: ['manager', 'admin'] },
  { href: '/staff', label: 'Staff Management', icon: Users, roles: ['manager', 'admin'] },
  { href: '/menu', label: 'Menu Management', icon: Receipt, roles: ['manager', 'admin'] },
  { href: '/waiter-clearing', label: 'Waiter Clearing', icon: CheckCircle2, roles: ['manager', 'admin', 'waiter'] },
  { href: '/pos', label: 'POS Terminal', icon: Receipt, roles: ['admin', 'manager', 'cashier', 'waiter', 'staff', 'kitchen_staff', 'receptionist', 'housekeeping', 'delivery'] },
  { href: '/kitchen', label: 'Kitchen Display', icon: Utensils, roles: ['kitchen_staff', 'admin', 'manager'] },
  { href: '/reception', label: 'Reception Desk', icon: ConciergeBell, roles: ['receptionist', 'admin', 'manager'] },
  { href: '/tables', label: 'Table Layout', icon: Layout, roles: ['admin', 'manager', 'waiter'] },
  { href: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['housekeeping', 'admin', 'manager'] },
  { href: '/shifts', label: 'Shifts', icon: Clock, roles: ['cashier', 'supervisor', 'manager', 'admin', 'waiter'] },
  { href: '/performance', label: 'Performance', icon: TrendingUp, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
  { href: '/accounting', label: 'Accounting', icon: Wallet, roles: ['manager', 'admin', 'accountant', 'accounts'] },
  { href: '/reports', label: 'Reports', icon: BarChart, roles: ['manager', 'admin', 'accountant', 'accounts'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
  { href: '/help', label: 'Help', icon: HelpCircle, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const visibleItems = navigationItems.filter(
    item => !user || item.roles.includes(user.role)
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-background border-border text-foreground hover:bg-accent"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 z-40',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-sidebar-foreground">
              <span className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                MH
              </span>
              {' '}POS
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Point of Sale System</p>
          </div>
          <ThemeToggle />
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-sidebar-border bg-muted/30">
            <p className="text-sm font-medium text-sidebar-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">{user.role}</p>
            <p className="text-xs text-muted-foreground mt-1">{user.employeeId}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-sidebar-border space-y-2">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20"
            variant="outline"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
