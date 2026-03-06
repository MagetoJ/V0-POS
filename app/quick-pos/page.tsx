'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Trash2, CreditCard, Loader2, Bed, Package, User, Printer, X, CheckCircle2, LogOut } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, Header, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  id: number;
  name: string;
  inventory_type: string;
  current_stock: number;
  reorder_level: number;
  unit: string;
  buying_price: number;
  is_active: boolean;
}

interface Room {
  id: number;
  room_number: string;
  room_type: string;
  status: string;
  rate: number;
}

interface Staff {
  employee_id: string;
  name: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: 'item' | 'room';
  inventory_type?: string;
  current_stock?: number;
}

export default function QuickPOSPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, bar, food, rooms
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Checkout & Auth state
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedWaiter, setSelectedWaiter] = useState<string>("");
  const [waiterPin, setWaiterPin] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, roomsRes, staffRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/public`)
      ]);

      const itemsData = await itemsRes.json();
      const roomsData = await roomsRes.json();
      const staffData = await staffRes.json();

      setItems(itemsData);
      setRooms(roomsData);
      setStaff(staffData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load data from server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDisplay = useMemo(() => {
    const query = searchQuery.toLowerCase();
    
    const matchedItems = items.filter(item => 
      item.name.toLowerCase().includes(query) &&
      (activeTab === "all" || activeTab === item.inventory_type) &&
      item.is_active
    ).map(item => ({ ...item, type: 'item' }));

    const matchedRooms = rooms.filter(room => 
      (room.room_number.toLowerCase().includes(query) || room.room_type.toLowerCase().includes(query)) &&
      (activeTab === "all" || activeTab === "rooms")
    ).map(room => ({ ...room, name: `Room ${room.room_number} (${room.room_type})`, type: 'room', buying_price: room.rate }));

    if (activeTab === "rooms") return matchedRooms;
    if (activeTab === "bar" || activeTab === "kitchen") return matchedItems;
    
    return [...matchedItems, ...matchedRooms];
  }, [searchQuery, activeTab, items, rooms]);

  const addToCart = (data: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === data.id && i.type === data.type);
      if (existing) {
        if (data.type === 'item' && data.inventory_type === 'bar' && existing.quantity >= (data.current_stock || 0)) {
          toast({ title: "Limit reached", description: "Out of stock", variant: "destructive" });
          return prev;
        }
        return prev.map(i => (i.id === data.id && i.type === data.type) ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: data.id, 
        name: data.type === 'room' ? `Room ${data.room_number}` : data.name, 
        price: data.type === 'room' ? data.rate : data.buying_price, 
        quantity: 1, 
        type: data.type,
        inventory_type: data.inventory_type,
        current_stock: data.current_stock
      }];
    });
  };

  const updateQuantity = (id: number, type: 'item' | 'room', delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.type === type) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (item.type === 'item' && item.inventory_type === 'bar' && newQty > (item.current_stock || 0)) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleProcessCheckout = async () => {
    if (!selectedWaiter || !waiterPin) {
      toast({ title: "Missing details", description: "Select waiter and enter PIN" });
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Verify Waiter PIN
      const authRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-pin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: selectedWaiter, pin: waiterPin })
      });

      if (!authRes.ok) throw new Error("Invalid PIN or Waiter not found");
      const waiterData = await authRes.json();

      // 2. Process Sale (Inventory Deduction)
      const saleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/quick-pos/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.filter(i => i.type === 'item').map(i => ({
            product_id: i.id,
            quantity: i.quantity
          }))
        })
      });

      if (!saleRes.ok) throw new Error("Sale processing failed");

      // 3. Generate Receipt Data
      setReceiptData({
        orderId: `POS-${Math.floor(Date.now() / 1000)}`,
        waiter: waiterData.name,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cartTotal
      });

      setOrderComplete(true);
      setCart([]);
      fetchData(); // Refresh stock
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {/* Navbar Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-primary">MH QUICK POS</h1>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">Operational</Badge>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items or rooms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => fetchData()}>
            <Loader2 className={loading ? "animate-spin" : ""} size={20} />
          </Button>
          <Separator orientation="vertical" className="h-8 mx-1" />
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-foreground leading-none">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
            </div>
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut size={16} />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col p-6 overflow-hidden">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: 'all', label: 'All', icon: Package },
              { id: 'bar', label: 'Bar Items', icon: Package },
              { id: 'kitchen', label: 'Kitchen Items', icon: Package },
              { id: 'rooms', label: 'Rooms', icon: Bed },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="gap-2 h-11 px-6 font-medium"
              >
                <tab.icon size={18} />
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Results Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pr-4">
              {filteredDisplay.map((item: any) => (
                <ProductCard 
                  key={`${item.type}-${item.id}`} 
                  item={{
                    id: item.id,
                    name: item.name,
                    buying_price: item.type === 'room' ? item.rate : item.buying_price,
                    inventory_type: item.type === 'room' ? 'room' : item.inventory_type,
                    current_stock: item.type === 'room' ? 1 : item.current_stock,
                    reorder_level: item.type === 'room' ? 0 : item.reorder_level
                  }}
                  onAdd={() => addToCart(item)}
                />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar Cart Area */}
        <div className="w-100 border-l border-border bg-card flex flex-col">
          <div className="p-6 flex items-center justify-between border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-primary" />
              <h2 className="font-bold text-lg">Current Sale</h2>
            </div>
            <Badge className="px-2 py-1">{cart.length} items</Badge>
          </div>

          <ScrollArea className="flex-1 p-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-40">
                <ShoppingCart size={64} strokeWidth={1} className="mb-4" />
                <p className="font-medium">No items in cart</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={`${item.type}-${item.id}`} className="flex justify-between items-center p-3 rounded-xl border border-border bg-background group">
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">KSh {item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-lg bg-muted/50">
                        <button onClick={() => updateQuantity(item.id, item.type, -1)} className="px-2 py-1 hover:bg-border transition-colors">-</button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.type, 1)} className="px-2 py-1 hover:bg-border transition-colors">+</button>
                      </div>
                      <span className="font-bold text-sm min-w-20 text-right">KSh {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="p-6 bg-muted/30 border-t border-border space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xl font-black">
                <span>TOTAL</span>
                <span className="text-primary">KSh {cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <Button 
              className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20" 
              disabled={cart.length === 0}
              onClick={() => setIsCheckoutModalOpen(true)}
            >
              Checkout Now
            </Button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={(open) => !isVerifying && setIsCheckoutModalOpen(open)}>
        <DialogContent className="sm:max-w-106.25">
          <div className="pt-4">
            <DialogTitle className="text-2xl font-bold mb-2">Complete Sale</DialogTitle>
            <DialogDescription>Select your name and enter your PIN to authorize the transaction.</DialogDescription>
          </div>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <User size={16} /> Waiter Name
              </label>
              <Select value={selectedWaiter} onValueChange={setSelectedWaiter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select who you are..." />
                </SelectTrigger>
                <SelectContent>
                  {staff.map(s => (
                    <SelectItem key={s.employee_id} value={s.employee_id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2">
                <CreditCard size={16} /> Enter PIN
              </label>
              <Input 
                type="password" 
                placeholder="••••" 
                maxLength={4} 
                className="text-center text-2xl tracking-[1em] h-14"
                value={waiterPin}
                onChange={(e) => setWaiterPin(e.target.value)}
                disabled={isVerifying}
              />
            </div>

            <div className="bg-muted p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Order Total:</span>
                <span className="font-bold">KSh {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-2">
                <span className="text-muted-foreground">Payment Method:</span>
                <span className="font-bold text-green-600">Cash / Mobile Money</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsCheckoutModalOpen(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProcessCheckout}
              disabled={isVerifying}
              className="gap-2"
            >
              {isVerifying ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              Authorize & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={orderComplete} onOpenChange={setOrderComplete}>
        <DialogContent className="sm:max-w-100 text-center p-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={48} />
            </div>
            <DialogTitle className="text-2xl font-bold">Sale Successful!</DialogTitle>
            <p className="text-muted-foreground mt-2">
              Transaction has been recorded and inventory updated.
            </p>
            
            <div className="w-full mt-8 space-y-3">
              <Button className="w-full gap-2 h-12" onClick={handlePrint}>
                <Printer size={18} /> Print Receipt
              </Button>
              <Button variant="outline" className="w-full h-12" onClick={() => setOrderComplete(false)}>
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
