'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ShoppingCart, Trash2, CreditCard, Loader2, Bed, Package, User, Printer, X, CheckCircle2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, Header, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  item_type: string;
  stock_level: number;
  reorder_point: number;
  unit: string;
  price: number;
  is_available: boolean;
}

interface Room {
  id: string;
  type: string;
  status: string;
  price: number;
}

interface Staff {
  employee_id: string;
  name: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'item' | 'room';
  item_type?: string;
  stock_level?: number;
}

export default function QuickPOSPage() {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsRes, roomsRes, staffRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms/`),
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
      (item.name.toLowerCase().includes(query) || item.sku.toLowerCase().includes(query)) &&
      (activeTab === "all" || activeTab === item.item_type) &&
      item.is_available
    ).map(item => ({ ...item, type: 'item' }));

    const matchedRooms = rooms.filter(room => 
      (room.id.toLowerCase().includes(query) || room.type.toLowerCase().includes(query)) &&
      (activeTab === "all" || activeTab === "rooms")
    ).map(room => ({ ...room, name: `Room ${room.id} (${room.type})`, type: 'room' }));

    if (activeTab === "rooms") return matchedRooms;
    if (activeTab === "bar" || activeTab === "food") return matchedItems;
    
    return [...matchedItems, ...matchedRooms];
  }, [searchQuery, activeTab, items, rooms]);

  const addToCart = (data: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === data.id);
      if (existing) {
        if (data.type === 'item' && data.item_type === 'bar' && existing.quantity >= (data.stock_level || 0)) {
          toast({ title: "Limit reached", description: "Out of stock", variant: "destructive" });
          return prev;
        }
        return prev.map(i => i.id === data.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { 
        id: data.id, 
        name: data.type === 'room' ? `Room ${data.id}` : data.name, 
        price: data.price, 
        quantity: 1, 
        type: data.type,
        item_type: data.item_type,
        stock_level: data.stock_level
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty <= 0) return item;
        if (item.type === 'item' && item.item_type === 'bar' && newQty > (item.stock_level || 0)) return item;
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
              { id: 'food', label: 'Food Items', icon: Package },
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
                <Card 
                  key={item.id} 
                  className="hover:border-primary cursor-pointer transition-all active:scale-95 group relative border-border"
                  onClick={() => addToCart(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className={`p-2 rounded-lg ${item.type === 'room' ? 'bg-purple-100 text-purple-600' : (item.item_type === 'bar' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600')}`}>
                        {item.type === 'room' ? <Bed size={20} /> : <Package size={20} />}
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase">{item.type === 'room' ? 'Room' : (item.item_type || item.category)}</Badge>
                    </div>
                    <h3 className="font-bold text-sm mb-1">{item.type === 'room' ? `Room ${item.id}` : item.name}</h3>
                    <div className="flex justify-between items-end mt-4">
                      <span className="text-lg font-black text-primary">KSh {item.price.toLocaleString()}</span>
                      {item.type === 'item' && item.item_type === 'bar' && (
                        <span className={`text-xs font-bold ${item.stock_level <= item.reorder_point ? 'text-destructive' : 'text-muted-foreground'}`}>
                          Qty: {item.stock_level}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar Cart Area */}
        <div className="w-[400px] border-l border-border bg-card flex flex-col">
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
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-xl border border-border bg-background group">
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">KSh {item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border rounded-lg bg-muted/50">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-border transition-colors">-</button>
                        <span className="px-2 text-xs font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-border transition-colors">+</button>
                      </div>
                      <span className="font-bold text-sm min-w-[80px] text-right">KSh {(item.price * item.quantity).toLocaleString()}</span>
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
        <DialogContent className="sm:max-w-[425px]">
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
                <CreditCard size={16} /> Security PIN
              </label>
              <Input 
                type="password" 
                placeholder="Enter 4-digit PIN" 
                className="text-2xl tracking-[1em] text-center h-14" 
                maxLength={4}
                value={waiterPin}
                onChange={(e) => setWaiterPin(e.target.value)}
              />
            </div>

            <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
              <div className="flex justify-between items-center font-black">
                <span className="text-sm text-muted-foreground uppercase">Amount Due:</span>
                <span className="text-2xl text-primary">KSh {cartTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setIsCheckoutModalOpen(false)} disabled={isVerifying}>Cancel</Button>
            <Button 
              className="flex-1 font-bold h-12" 
              onClick={handleProcessCheckout}
              disabled={isVerifying || !selectedWaiter || waiterPin.length < 4}
            >
              {isVerifying ? <Loader2 className="animate-spin" /> : "Complete & Print"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Complete / Receipt Modal */}
      <Dialog open={orderComplete} onOpenChange={(open) => {
        if (!open) {
          setOrderComplete(false);
          setReceiptData(null);
          setWaiterPin("");
          setIsCheckoutModalOpen(false);
        }
      }}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex flex-col items-center justify-center pt-6 text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={40} />
            </div>
            <DialogTitle className="text-2xl font-bold">Transaction Successful!</DialogTitle>
            <p className="text-muted-foreground">Order {receiptData?.orderId} has been processed.</p>
          </div>

          <Separator className="my-6" />

          {/* Receipt View */}
          <div className="receipt-content font-mono text-sm bg-muted/20 p-6 rounded-lg border border-dashed border-border">
            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">MARIA HAVENS POS</h2>
              <p className="text-[10px]">Uniform Database Link Operational</p>
              <p className="text-[10px]">{receiptData?.date}</p>
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex justify-between"><span>Waiter:</span> <span>{receiptData?.waiter}</span></div>
              <div className="flex justify-between border-b border-border pb-1"><span>Order:</span> <span>{receiptData?.orderId}</span></div>
            </div>

            <div className="space-y-2 mb-4">
              {receiptData?.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-[12px]">
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />
            
            <div className="flex justify-between font-black text-lg">
              <span>TOTAL (KSh)</span>
              <span>{receiptData?.total.toLocaleString()}</span>
            </div>
            
            <div className="text-center mt-8 pt-4 border-t border-border border-dashed">
              <p className="text-[10px]">Thank you for visiting Maria Havens</p>
              <p className="text-[8px] mt-1 italic">Generated by V0 POS System</p>
            </div>
          </div>

          <DialogFooter className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" onClick={handlePrint}>
              <Printer size={16} /> Print Receipt
            </Button>
            <Button className="flex-1 font-bold" onClick={() => setOrderComplete(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .receipt-content, .receipt-content * { visibility: visible; }
          .receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
}
