"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "@/components/navbar/NavBar";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import CartButtons from "@/components/cart/CartButtons";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const params = useParams(); // ✅ useParams로 동기 접근
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();

  useEffect(() => {
    // ✅ useParams로 꺼낸 값은 문자열 배열일 수 있으니 예외 처리 필요
    if (params && typeof params.restaurantId === "string" && typeof params.tableId === "string") {
      setRestaurantId(params.restaurantId);
      setTableId(params.tableId);
    }
  }, [params]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !restaurantId || !tableId) {
    return (
      <div className="flex flex-col min-h-screen bg-blue-white items-center justify-center p-4">
        <svg
          className="animate-spin h-10 w-10 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <p className="mt-3 text-gray-600">장바구니를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-white">
      <NavBar restaurantId={restaurantId} tableId={tableId} type="back" showOrderListModal={false}>
        장바구니
      </NavBar>

      <div className="flex-1 px-4 py-6">
        {items.length === 0 ? (
          <EmptyCart restaurantId={restaurantId} tableId={tableId} />
        ) : (
          <>
            <div className="mb-4 px-3 py-2 bg-orange-50 rounded-lg animate-fade-slide-in">
              <div className="flex items-center">
                <img
                  src="/images/wooripay-icon.png"
                  alt="우리페이"
                  className="w-10 h-10 mr-3"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">우리페이로 결제하면 특별한 혜택이!</p>
                  <p className="text-xs text-gray-500 mt-0.5">적립, 할인, 사은품 제공까지 다양한 혜택을 누려보세요.</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-lg text-gray-800">주문 목록</h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-error flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  장바구니 비우기
                </button>
              </div>
              <div>
                {items.map((item, index) => (
                  <CartItem
                    key={`${item.id}-${JSON.stringify(item.options)}`}
                    item={item}
                    onQuantityChange={(quantity) => updateQuantity(index, quantity)}
                    onRemove={() => removeItem(index)}
                  />
                ))}
              </div>


             
            </div>

            <CartButtons restaurantId={restaurantId} tableId={tableId} />
          </>
        )}
      </div>
    </div>
  );
}
