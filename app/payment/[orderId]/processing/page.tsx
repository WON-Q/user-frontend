"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("orderId");
  const restaurantId = searchParams.get("restaurantId");
  const processing = searchParams.get("processing");
  const tableId = searchParams.get("tableId");
  const orderCode = orderId; //  orderId가 곧 orderCode라면 이렇게 사용

  useEffect(() => {
    if (!orderId || !restaurantId || !processing || !tableId) {
      console.error("Missing required query parameters.");
      return;
    }

    //  백엔드에 결제 검증 요청 보내기
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `localhost:8080/api/orders/code/${orderCode}/verify`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Payment verification failed:", response.status);
          return;
        }

        const result = await response.json();

        if (result?.data?.paymentStatus === "SUCCEEDED") {
          router.push(
            `/payment/complete?orderId=${orderId}&restaurantId=${restaurantId}&tableId=${tableId}`
          );
        } else {
          console.log("Payment not succeeded yet. Retrying in 5s...");
          setTimeout(verifyPayment, 5000); // 재시도
        }
      } catch (error) {
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, [orderId, restaurantId, tableId, processing, router, orderCode]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">결제 진행 중</h1>
        <div className="flex justify-center">
          <Image
            src="/images/Payment-Process.gif"
            alt="결제 진행 중"
            width={200}
            height={200}
            className="rounded-xl"
          />
        </div>
        <p className="text-base text-gray-600">잠시만 기다려주세요...</p>
        <p className="text-sm text-gray-500">결제 처리 중입니다. 페이지를 닫지 마세요.</p>
      </div>
    </div>
  );
}
