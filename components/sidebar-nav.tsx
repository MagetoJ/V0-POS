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
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
  { href: '/rooms', label: 'Room Management', icon: Bed, roles: ['manager', 'admin', 'housekeeping'] },
  { href: '/inventory', label: 'Inventory', icon: Package, roles: ['manager', 'admin'] },
  { href: '/suppliers', label: 'Suppliers & POs', icon: Truck, roles: ['manager', 'admin'] },
  { href: '/staff', label: 'Staff Management', icon: Users, roles: ['manager', 'admin'] },
  { href: '/menu', label: 'Menu Management', icon: Receipt, roles: ['manager', 'admin'] },
  { href: '/waiter-clearing', label: 'Waiter Clearing', icon: CheckCircle2, roles: ['manager', 'admin', 'waiter'] },
  { href: '/shifts', label: 'Shifts', icon: Clock, roles: ['cashier', 'supervisor', 'manager', 'admin', 'waiter'] },
  { href: '/performance', label: 'Performance', icon: TrendingUp, roles: ['cashier', 'supervisor', 'manager', 'admin'] },
  { href: '/accounting', label: 'Accounting', icon: Wallet, roles: ['manager', 'admin', 'accounts'] },
  { href: '/reports', label: 'Reports', icon: BarChart, roles: ['manager', 'admin', 'accounts'] },
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
          className="bg-slate-900/80 border-slate-700 text-slate-100 hover:bg-slate-800"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 z-40',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-slate-100">
            <span className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              MH
            </span>
            {' '}POS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Point of Sale System</p>
        </div>

        {/* User Info */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50">
            <p className="text-sm font-medium text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-400 mt-1 capitalize">{user.role}</p>
            <p className="text-xs text-slate-500 mt-1">{user.employeeId}</p>
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
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-slate-800 space-y-2">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
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
