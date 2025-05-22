'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MenuItem } from '@/types/menu';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options?: { [key: string]: string };
  optionIds?: number[]; // ✅ 옵션 ID 추가
  image?: string;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (
    item: MenuItem,
    quantity: number,
    options?: { [key: string]: string },
    optionIds?: number[] // ✅ 시그니처에 추가
  ) => void;
  removeItem: (index: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  cartItemCount: number;
  updateCartCount: (restaurantId: string, tableId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  restaurantId: string;
  tableId: string;
}

export function CartProvider({ children, restaurantId, tableId }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const cartKey = `cart_${restaurantId}_${tableId}`;
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('장바구니 데이터 로드 오류:', e);
      }
    }
    setInitialized(true);
  }, [restaurantId, tableId]);

  useEffect(() => {
    if (!initialized) return;

    const cartKey = `cart_${restaurantId}_${tableId}`;
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, restaurantId, tableId, initialized]);

  const addItem = (
    menuItem: MenuItem,
    quantity: number,
    options?: { [key: string]: string },
    optionIds?: number[] // ✅ 추가
  ) => {
    setItems(currentItems => {
      const optionsKey = options ? JSON.stringify(options) : '';
      const optionIdsKey = optionIds ? JSON.stringify(optionIds) : '';

      const existingItemIndex = currentItems.findIndex(item => 
        item.id === menuItem.id &&
        JSON.stringify(item.options) === optionsKey &&
        JSON.stringify(item.optionIds || []) === optionIdsKey
      );

      const optionTotalPrice = menuItem.options
        ?.reduce((sum, optGroup) => {
          const selectedOptionName = options?.[optGroup.title];
          const selectedOption = optGroup.items.find(item => item.name === selectedOptionName);
          return sum + (selectedOption?.price || 0);
        }, 0) || 0;

      const finalUnitPrice = menuItem.price + optionTotalPrice;
      const totalPrice = finalUnitPrice * quantity;

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        const item = updatedItems[existingItemIndex];
        item.quantity += quantity;
        item.totalPrice = finalUnitPrice * item.quantity;
        return updatedItems;
      } else {
        return [...currentItems, {
          id: menuItem.id,
          name: menuItem.name,
          price: finalUnitPrice,
          quantity,
          options,
          optionIds, // ✅ 저장
          image: menuItem.image,
          totalPrice
        }];
      }
    });
  };

  const removeItem = (index: number) => {
    setItems(currentItems => {
      const updatedItems = [...currentItems];
      updatedItems.splice(index, 1);
      return updatedItems;
    });
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setItems((currentItems) => {
      const updatedItems = [...currentItems];
      const item = updatedItems[index];
      if (!item) return currentItems;

      item.quantity = newQuantity;
      item.totalPrice = item.price * newQuantity;
      return updatedItems;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateCartCount = (restaurantId: string, tableId: string) => {
    const cart = JSON.parse(localStorage.getItem(`cart_${restaurantId}_${tableId}`) || "[]");
    setCartItemCount(cart.length);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <CartContext.Provider 
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        cartItemCount,
        updateCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}