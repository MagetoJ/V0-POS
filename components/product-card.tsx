'use client';

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Beer, Utensils, AlertTriangle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  item: {
    id: number;
    name: string;
    buying_price: number;
    inventory_type: string;
    current_stock: number;
    reorder_level: number;
  };
  onAdd: () => void;
}

export function ProductCard({ item, onAdd }: ProductCardProps) {
  const isBar = item.inventory_type === "bar";
  const isLowStock = isBar && item.current_stock <= item.reorder_level;
  const isOutOfStock = isBar && item.current_stock <= 0;

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md border-border",
      isOutOfStock && "opacity-60 bg-muted/50"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className={cn(
            "p-2 rounded-full",
            isBar ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
          )}>
            {isBar ? <Beer size={18} /> : <Utensils size={18} />}
          </div>
          <Badge variant={isBar ? "secondary" : "outline"} className="text-[10px] uppercase font-bold tracking-wider">
            {item.inventory_type}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-sm line-clamp-2 mb-1 min-h-10">
          {item.name}
        </h3>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-primary">
            KSh {(item.buying_price || 0).toLocaleString()}
          </span>
          {isBar && (
            <div className="flex items-center gap-1">
              {isLowStock && <AlertTriangle size={14} className="text-destructive animate-pulse" />}
              <span className={cn(
                "text-xs font-medium",
                isLowStock ? "text-destructive" : "text-muted-foreground"
              )}>
                Qty: {item.current_stock}
              </span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onAdd} 
          disabled={isOutOfStock}
          className="w-full gap-2"
          variant={isOutOfStock ? "secondary" : "default"}
          size="sm"
        >
          <Plus size={16} />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
