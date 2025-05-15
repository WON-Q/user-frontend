"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const restaurantId = searchParams.get("restaurantId");
  const processing = searchParams.get("processing");

  useEffect(() => {
    if (!orderId || !restaurantId || !processing) {
      console.error("Missing required query parameters.");
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        // Simulate API call to check payment status
        const response = await fetch(`http://localhost:8080/api/v1/pg/status?orderId=${orderId}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "결제 상태 확인 실패");

        if (data.status === "success") {
          router.push(`/payment/complete?orderId=${orderId}&restaurantId=${restaurantId}`);
        } else {
          alert("결제가 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("결제 상태 확인 중 오류:", error);
        alert("결제 상태 확인 중 오류가 발생했습니다.");
      }
    };

    checkPaymentStatus();
  }, [orderId, restaurantId, processing, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Baemin logo"
            width={80}
            height={80}
            className="rounded-xl"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">결제 진행 중</h1>

        <div className="flex justify-center">
          <div className="flex items-center justify-center w-12 h-12">
            <Loader2 className="h-12 w-12 animate-spin text-[#2AC1BC]" />
          </div>
        </div>

        <p className="text-base text-gray-600">잠시만 기다려주세요...</p>
        <p className="text-sm text-gray-500">결제 처리 중입니다. 페이지를 닫지 마세요.</p>
      </div>
    </div>
  );
}
