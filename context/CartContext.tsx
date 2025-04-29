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
  removeItem: (index: number) => void;
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
  const [initialized, setInitialized] = useState(false); 

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
    setInitialized(true); // ✅ 데이터 로드 완료 후 초기화됨
  }, [restaurantId, tableId]);

  // 장바구니 데이터가 변경될 때만 로컬 스토리지에 저장
  useEffect(() => {
    if (!initialized) return; // 초기화 전에는 저장하지 않음

    const cartKey = `cart_${restaurantId}_${tableId}`;
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, restaurantId, tableId, initialized]);

  const addItem = (menuItem: MenuItem, quantity: number, options?: { [key: string]: string }) => {
    setItems(currentItems => {
      const optionsKey = options ? JSON.stringify(options) : '';

      const existingItemIndex = currentItems.findIndex(item => 
        item.id === menuItem.id && JSON.stringify(item.options) === optionsKey
      );

      // ✅ 옵션 가격 계산
      const optionTotalPrice = menuItem.options
        ?.reduce((sum, optGroup) => {
          const selectedOptionName = options?.[optGroup.title];
          const selectedOption = optGroup.items.find(item => item.name === selectedOptionName);
          return sum + (selectedOption?.price || 0);
        }, 0) || 0;

      const finalUnitPrice = menuItem.price + optionTotalPrice; // 옵션 포함 단가
      const totalPrice = finalUnitPrice * quantity;

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        const item = updatedItems[existingItemIndex];
        item.quantity += quantity;
        item.totalPrice = finalUnitPrice * item.quantity; // ✅ 옵션 포함된 가격으로 다시 계산
        return updatedItems;
      } else {
        return [...currentItems, {
          id: menuItem.id,
          name: menuItem.name,
          price: finalUnitPrice, // ✅ 옵션 포함된 가격 저장
          quantity,
          options,
          image: menuItem.image,
          totalPrice
        }];
      }
    });
  };

  const removeItem = (index: number) => {
    setItems(currentItems => {
      const updatedItems = [...currentItems];
      updatedItems.splice(index, 1); // Remove one item at the given index
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