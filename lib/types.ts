export type UserRole = 'cashier' | 'supervisor' | 'manager' | 'admin' | 'accounts' | 'housekeeping' | 'waiter';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  role: UserRole;
  storeId: string;
  email?: string;
  phone?: string;
  hireDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}

export interface Shift {
  id: string;
  employeeId: string;
  storeId: string;
  clockInTime: string;
  clockOutTime?: string;
  breakStart?: string;
  breakEnd?: string;
  isActive: boolean;
  totalHours?: number;
}

export interface ShiftSwapRequest {
  id: string;
  employeeId: string;
  targetShiftId: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
  requestedAt: string;
}

export interface Performance {
  employeeId: string;
  date: string;
  totalSales: number;
  transactionCount: number;
  averageTransactionValue: number;
  customerSatisfaction: number;
  voidCount: number;
  discountCount: number;
  targetMet: boolean;
}

export interface Room {
  id: string;
  type: string;
  status: 'available' | 'occupied' | 'dirty' | 'maintenance';
  price?: number;
  guest?: string;
  checkIn?: string;
  checkOut?: string;
  lastGuest?: string;
  issue?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  stockLevel: number;
  reorderPoint: number;
  unit: string;
  price: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  category: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  amount: number;
  status: 'pending' | 'received' | 'returned';
  items: POItem[];
}

export interface POItem {
  inventoryItemId: string;
  quantity: number;
  unitPrice: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  ingredients: RecipeIngredient[];
  isAvailable: boolean;
}

export interface RecipeIngredient {
  inventoryItemId: string;
  quantity: number;
  unit: string;
}

export interface Invoice {
  id: string;
  guestName: string;
  roomNumber?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'paid' | 'pending' | 'void';
  paymentMethod?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Expense {
  id: string;
  category: 'utilities' | 'maintenance' | 'payroll' | 'supplies' | 'other';
  description: string;
  amount: number;
  date: string;
  paidTo?: string;
  status: 'paid' | 'pending';
}

export interface AuthError {
  code: string;
  message: string;
}
