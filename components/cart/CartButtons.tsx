"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface CartButtonsProps {
  restaurantId: string;
  tableId: string;
}

export default function CartButtons({ restaurantId, tableId }: CartButtonsProps) {
  const { items, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);

    // 기본값
    const fallbackOrderId = "1";
    const fallbackCallbackUrl = `http://localhost:3000/payment/${fallbackOrderId}?restaurantId=${restaurantId}&tableId=${tableId}`;

    try {
      const menus = items.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        optionIds: item.options ? Object.values(item.options).map(Number) : [],
      }));

      const orderRes = await fetch("http://localhost:8080/api/v1/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantId: Number(restaurantId),
          tableId: Number(tableId),
          amount: totalAmount,
          menus,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) throw new Error(orderData.message || "주문 생성 실패");

      const { orderId, merchantId, amount } = orderData;

      const pgRes = await fetch("http://localhost:8080/api/v1/pg/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          merchantId,
          amount,
        }),
      });

      const pgData = await pgRes.json();
      if (!pgRes.ok) throw new Error(pgData.message || "결제 생성 실패");

      if (pgData.callbackUrl) {
        router.push(pgData.callbackUrl);
      } else {
        // 백엔드가 응답했지만 callbackUrl이 없을 때
        console.warn("callbackUrl 누락 → fallback으로 이동");
        router.push(fallbackCallbackUrl);
      }
    } catch (err) {
      console.warn("백엔드 호출 실패 → fallback으로 이동:", err);
      router.push(fallbackCallbackUrl);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 p-4 flex gap-3 safe-area-bottom z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <Link
        href={`/restaurant/${restaurantId}/table/${tableId}/menu`}
        className="flex-1 h-12 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl flex items-center justify-center font-medium transition-colors hover:bg-[var(--color-primary-light)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        메뉴 추가
      </Link>
      <button
        onClick={handleOrder}
        disabled={loading}
        className="flex-1 h-12 bg-[var(--color-primary)] text-white rounded-xl shadow-md flex items-center justify-center font-medium transition-all hover:bg-[var(--color-primary-dark)] active:scale-[0.98]"
      >
        {loading ? "처리 중..." : "주문하기"}
      </button>
    </div>
  );
}