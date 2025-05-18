"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();

  const [orderId, setOrderId] = useState("UNKNOWN-ORDER");
  const [restaurantId, setRestaurantId] = useState("1");
  const [tableId, setTableId] = useState("1");
  const [totalAmount, setTotalAmount] = useState(0);
  const [confirmedOrderCode, setConfirmedOrderCode] = useState(""); // ✅ 추가

  useEffect(() => {
    const _orderId = searchParams.get("orderId");
    const _restaurantId = searchParams.get("restaurantId");
    const _tableId = searchParams.get("tableId");

    if (!_orderId || !_restaurantId || !_tableId) return;

    setOrderId(_orderId);
    setRestaurantId(_restaurantId);
    setTableId(_tableId);

    const key = `nowOrder_${_restaurantId}_${_tableId}`;
    const raw = localStorage.getItem(key);

    console.log("🧩 key:", key);
    console.log("🧩 orderId:", _orderId);
    console.log("🧩 raw:", raw);

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setTotalAmount(parsed.totalAmount || 0);
        setConfirmedOrderCode(parsed.orderCode || ""); // ✅ orderCode도 저장
        localStorage.removeItem(`cart_${_restaurantId}_${_tableId}`);
      } catch (e) {
        console.error("🚨 로컬스토리지 파싱 오류:", e);
      }
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8F8F8] p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <CheckCircle2 className="h-16 w-16 text-[#70E4B0]" />
          <h1 className="text-2xl font-bold text-[#1A1A1A]">결제 완료</h1>
          <p className="text-[#4A4A4A]">주문이 성공적으로 결제되었습니다</p>
        </div>

        <div className="border border-[#E0E0E0] bg-white shadow-sm rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-[#767676]">주문번호</span>
              <span className="font-medium text-[#1A1A1A]">
                {confirmedOrderCode || orderId} {/* ✅ 우선순위: 로컬스토리지 값 */}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#767676]">결제 금액</span>
              <span className="font-medium text-[#1A1A1A]">
                ₩{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3 bg-[#FF6B35] text-white rounded-lg hover:bg-[#C75000]">
            주문 상세 보기
          </button>

          <Link
            href={`/restaurant/${restaurantId}/table/${tableId}/menu`}
            className="block w-full"
          >
            <button className="w-full py-3 border border-[#E0E0E0] text-[#4A4A4A] rounded-lg hover:bg-[#F8F8F8] flex items-center justify-center gap-2">
              <span>홈으로 돌아가기</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
