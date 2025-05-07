'use client';

import { CartProvider } from "@/context/CartContext";

export default function ClientCartProvider({
  restaurantId,
  tableId,
  children,
}: {
  restaurantId: string;
  tableId: string;
  children: React.ReactNode;
}) {
  return (
    <CartProvider restaurantId={restaurantId} tableId={tableId}>
      {children}
    </CartProvider>
  );
}
