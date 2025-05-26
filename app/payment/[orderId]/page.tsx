"use client";

import { useParams, useSearchParams } from "next/navigation";
import { CartProvider } from "@/context/CartContext";
import PaymentContent from "../../../components/payment/PaymentContent";

export default function PaymentPage() {
  const params = useParams(); // ✅ 훅으로 접근
  const searchParams = useSearchParams();

  const orderId = typeof params.orderId === "string" ? params.orderId : Array.isArray(params.orderId) ? params.orderId[0] : "";
  const restaurantId = searchParams.get("restaurantId") || "1";
  const tableId = searchParams.get("tableId") || "1";
   const paymentId = searchParams.get("paymentId") || "";

  return (
    <CartProvider restaurantId={restaurantId} tableId={tableId}>
      <PaymentContent orderId={orderId} paymentId={paymentId} />
    </CartProvider>
  );
}
