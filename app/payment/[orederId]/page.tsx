"use client";

import { useSearchParams } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import PaymentContent from "../../../components/payment/PaymentContent";

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") || "1";
  const tableId = searchParams.get("tableId") || "1";



  
  return (
    <CartProvider restaurantId={restaurantId} tableId={tableId}>
      <PaymentContent orderId={params.orderId} />
    </CartProvider>
  );
}