"use client";

import { useParams } from "next/navigation";
import { CartProvider } from "@/context/CartContext";

export default function ClientCartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();

  const restaurantId = params?.restaurantId as string;
  const tableId = params?.tableId as string;

  if (!restaurantId || !tableId) return null; 

  return (
    <CartProvider restaurantId={restaurantId} tableId={tableId}>
      {children}
    </CartProvider>
  );
}
