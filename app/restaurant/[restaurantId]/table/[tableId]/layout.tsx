'use client';

import { CartProvider } from '@/context/CartContext';

export default function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string; tableId: string };
}) {
  return (
    <CartProvider restaurantId={params.restaurantId} tableId={params.tableId}>
      {children}
    </CartProvider>
  );
}