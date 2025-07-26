import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number; // For dudhi: pieces, for others: 500g units
}

// Stock limits for the July 26-29, 2025 batch
const STOCK_LIMITS = {
  'dudhi': 60, // 60 pieces (30 kg)
  'bhindi': 80, // 80 units of 500g (40 kg) 
  'little-gourd': 40, // 40 units of 500g (20 kg)
};

const ORDER_DATE_START = '2025-07-26';
const ORDER_DATE_END = '2025-07-29';

interface CartState {
  items: CartItem[];
  total: number;
  stockUsed: Record<string, number>; // Track current stock usage
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_STOCK_USED'; payload: Record<string, number> };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity: number) => boolean;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getAvailableStock: (productId: string) => number;
  isStockAvailable: (productId: string, requestedQuantity: number) => boolean;
  getStockMessage: (productId: string, requestedQuantity: number) => string;
  refreshStockData: () => Promise<void>;
} | null>(null);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      } else {
        const newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity }];
        return {
          ...state,
          items: newItems,
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      }
    }
    
    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: filteredItems,
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        const filteredItems = state.items.filter(item => item.id !== action.payload.id);
        return {
          ...state,
          items: filteredItems,
          total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return {
        ...state,
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
    
    case 'SET_STOCK_USED':
      return { ...state, stockUsed: action.payload };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, { 
    items: [], 
    total: 0, 
    stockUsed: {}
  });

  // Fetch current stock usage from database
  const refreshStockData = async () => {
    try {
      const { data, error } = await supabase
        .from('order_slots')
        .select('product_id, quantity')
        .gte('order_date', ORDER_DATE_START)
        .lte('order_date', ORDER_DATE_END);

      if (error) throw error;

      const stockUsed: Record<string, number> = {};
      
      data?.forEach(order => {
        if (!stockUsed[order.product_id]) {
          stockUsed[order.product_id] = 0;
        }
        stockUsed[order.product_id] += order.quantity;
      });

      dispatch({ type: 'SET_STOCK_USED', payload: stockUsed });
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  // Refresh stock data on mount
  useEffect(() => {
    refreshStockData();
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>, quantity: number): boolean => {
    const existingItem = state.items.find(cartItem => cartItem.id === item.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const totalQuantityNeeded = currentCartQuantity + quantity;
    
    // Check stock availability
    const maxStock = STOCK_LIMITS[item.id as keyof typeof STOCK_LIMITS];
    if (maxStock) {
      const currentStockUsed = state.stockUsed[item.id] || 0;
      const availableStock = maxStock - currentStockUsed;
      
      if (totalQuantityNeeded > availableStock) {
        return false; // Stock not available
      }
    }
    
    dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity } });
    return true;
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    // Check stock before updating
    const maxStock = STOCK_LIMITS[id as keyof typeof STOCK_LIMITS];
    if (maxStock) {
      const currentStockUsed = state.stockUsed[id] || 0;
      const availableStock = maxStock - currentStockUsed;
      
      if (quantity > availableStock) {
        return; // Don't update if exceeds stock
      }
    }
    
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getTotalItems = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getAvailableStock = (productId: string): number => {
    const maxStock = STOCK_LIMITS[productId as keyof typeof STOCK_LIMITS];
    if (!maxStock) {
      return Infinity; // No stock limit for unlisted products
    }
    
    const currentStockUsed = state.stockUsed[productId] || 0;
    const cartItem = state.items.find(item => item.id === productId);
    const cartQuantity = cartItem ? cartItem.quantity : 0;
    
    return Math.max(0, maxStock - currentStockUsed - cartQuantity);
  };

  const isStockAvailable = (productId: string, requestedQuantity: number): boolean => {
    const availableStock = getAvailableStock(productId);
    return requestedQuantity <= availableStock;
  };

  const getStockMessage = (productId: string, requestedQuantity: number): string => {
    const maxStock = STOCK_LIMITS[productId as keyof typeof STOCK_LIMITS];
    if (!maxStock) return "";
    
    const availableStock = getAvailableStock(productId);
    
    if (availableStock === 0) {
      return "Out of Stock for this batch (July 26-29, 2025)";
    }
    
    if (requestedQuantity > availableStock) {
      if (productId === 'dudhi') {
        return `Only ${availableStock} pieces available for this batch`;
      } else {
        const availableKg = (availableStock * 0.5).toFixed(1);
        return `Only ${availableKg}kg (${availableStock} units) available for this batch`;
      }
    }
    
    return "";
  };

  return (
    <CartContext.Provider value={{
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getAvailableStock,
      isStockAvailable,
      getStockMessage,
      refreshStockData,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};