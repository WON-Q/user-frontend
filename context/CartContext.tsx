'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { MenuItem } from '@/types/menu';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options?: { [key: string]: string };
  image?: string;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: MenuItem, quantity: number, options?: { [key: string]: string }) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  restaurantId: string;
  tableId: string;
}

export function CartProvider({ children, restaurantId, tableId }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 로컬 스토리지에서 장바구니 데이터 로드
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
  }, [restaurantId, tableId]);

  // 장바구니 데이터가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    const cartKey = `cart_${restaurantId}_${tableId}`;
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, restaurantId, tableId]);

  const addItem = (menuItem: MenuItem, quantity: number, options?: { [key: string]: string }) => {
    setItems(currentItems => {
      // 옵션을 문자열로 변환하여 비교에 사용
      const optionsKey = options ? JSON.stringify(options) : '';
      
      // 동일한 메뉴와 옵션을 가진 아이템 찾기
      const existingItemIndex = currentItems.findIndex(item => 
        item.id === menuItem.id && JSON.stringify(item.options) === optionsKey
      );

      if (existingItemIndex >= 0) {
        // 이미 존재하는 아이템이면 수량만 증가
        const updatedItems = [...currentItems];
        const item = updatedItems[existingItemIndex];
        item.quantity += quantity;
        item.totalPrice = item.price * item.quantity;
        return updatedItems;
      } else {
        // 새로운 아이템 추가
        const totalPrice = menuItem.price * quantity;
        return [...currentItems, {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          options,
          image: menuItem.image,
          totalPrice
        }];
      }
    });
  };

  const removeItem = (itemId: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
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
        totalAmount
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