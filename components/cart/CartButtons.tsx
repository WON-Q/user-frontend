"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

interface CartButtonsProps {
  restaurantId: string;
  tableId: string;
}

export default function CartButtons({ restaurantId, tableId }: CartButtonsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    setLoading(true);

    try {
      const cartKey = `cart_${restaurantId}_${tableId}`;
      const cartData = localStorage.getItem(cartKey);
      if (!cartData) throw new Error("로컬스토리지에 장바구니 데이터가 없습니다.");

      const parsedCart = JSON.parse(cartData);
      const menus = parsedCart.map((item: any) => ({
        menuId: item.id,
        quantity: item.quantity,
        optionIds: item.optionIds || [], // ✅ 옵션 ID 직접 사용
      }));

      const requestBody = {
        tableId: Number(tableId),
        merchantId: restaurantId,
        menus,
        paymentMethod: "CARD",
      };

      console.log("📤 주문 준비 요청:");
      console.log("➡️ URL:", "http://192.168.0.168:8080/api/v1/orders/prepare");
      console.log("➡️ Method:", "POST");
      console.log("➡️ Headers:", { "Content-Type": "application/json;charset=UTF-8" });
      console.log("➡️ Body:", requestBody);

      const response = await fetch("http://192.168.0.168:8080/api/v1/orders/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json;charset=UTF-8" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "주문 생성 실패");

      console.log(" 주문 준비 완료:", result.data.orderCode);

      const orderCode = result.data.orderCode;

      // 주문 코드와 총 금액을 로컬 스토리지에 저장
      localStorage.setItem(
        `nowOrder_${restaurantId}_${tableId}`,
        JSON.stringify({
          orderCode,
          totalAmount: result.data.totalAmount,
        })
      );

      try {
        const accessKey = "QOtB07frJ4K2UoqhH89s";
        const secretKey = "AUBXZwZ8K8eQ6fOyU44RCju7LDcBTFajw26Aza8p";
        const basicAuth = btoa(`${accessKey}:${secretKey}`);

        const pgResponse = await fetch("http://192.168.0.168:8082/prepare", {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Basic ${basicAuth}`,
          },
          body: JSON.stringify({
            orderId: orderCode,
            merchantId: restaurantId,
            amount: result.data.totalAmount,
            currency: "KRW",
          }),
          credentials: "include",
        });

        const pgResult = await pgResponse.json();
        if (!pgResponse.ok) throw new Error(pgResult.message || "결제 준비 실패");

        console.log("💳 결제 준비 완료:", pgResult);

        // ✅ callbackUrl 로 이동
        const callbackUrl = pgResult.data.callbackUrl || "/payment";
        router.push(`${callbackUrl}/${orderCode}?restaurantId=${restaurantId}&tableId=${tableId}&paymentId=${pgResult.data.paymentId}`);
      } catch (pgError) {
        console.error("🚨 PG 연동 오류:", pgError);
        alert("결제 준비 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }



    } catch (err) {
      console.error("🚨 주문 준비 중 오류:", err);
      alert("주문 처리에 실패했습니다.");
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
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
