"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PaymentCompletePage() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") || "defaultRestaurantId"; // Fallback value
  const tableId = searchParams.get("tableId") || "defaultTableId"; // Fallback value

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
              <span className="font-medium text-[#1A1A1A]">BAEMIN-12345</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#767676]">결제 금액</span>
              <span className="font-medium text-[#1A1A1A]">₩18,500</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#767676]">결제 방법</span>
              <span className="font-medium text-[#1A1A1A]">신용카드</span>
            </div>

            <div className="border-t border-[#E0E0E0] my-2"></div>

            <div className="flex justify-between">
              <span className="text-[#767676]">준비 예상 시간</span>
              <span className="font-medium text-[#FF6B35]">35~45분</span>
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
