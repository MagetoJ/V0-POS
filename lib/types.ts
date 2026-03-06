export type UserRole = 
  | 'cashier' 
  | 'supervisor' 
  | 'manager' 
  | 'admin' 
  | 'accounts' 
  | 'housekeeping' 
  | 'waiter'
  | 'staff'
  | 'kitchen_staff'
  | 'receptionist'
  | 'delivery'
  | 'accountant';

export interface Table {
  id: string;
  number: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved';
  zone?: string;
}

export interface MaintenanceRequest {
  id: string;
  roomNumber: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed';
  requestedBy: string;
  createdAt: string;
}

export interface StockTransfer {
  id: string;
  fromLocation: string;
  toLocation: string;
  items: POItem[];
  status: 'pending' | 'completed';
  timestamp: string;
}

export interface User {
  id: number;
  employee_id: string;
  name: string;
  role: UserRole;
  pin: string;
  is_active: boolean;
  username: string;
  password?: string;
  email?: string;
  reset_code?: string;
  reset_code_expires?: string;
  requires_clearing: boolean;
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
  id: number;
  room_number: string;
  room_type?: string;
  status: 'available' | 'occupied' | 'dirty' | 'maintenance';
  guest_name?: string;
  check_in_date?: string;
  check_out_date?: string;
  rate?: number;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  amenities?: string;
  floor?: number;
  max_occupancy?: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  unit?: string;
  current_stock: number;
  minimum_stock: number;
  cost_per_unit?: number;
  supplier?: string;
  inventory_type: 'bar' | 'kitchen';
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  allowed_roles?: string;
  buying_price?: number;
  reorder_level: number;
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

export interface Order {
  id: number;
  order_number: string;
  order_type: string;
  table_id?: number;
  room_id?: number;
  customer_name?: string;
  customer_phone?: string;
  staff_id?: number;
  status: string;
  subtotal: number;
  total_amount: number;
  payment_status: string;
  created_at?: string;
}

export interface AuthError {
  code: string;
  message: string;
}
