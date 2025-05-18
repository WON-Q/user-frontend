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
  console.log("orderId:", orderId); // Log the orderId
  console.log("restaurantId:", restaurantId); // Log the restaurantId
  console.log("processing:", processing); // Log the processing flag

  useEffect(() => {
    if (!orderId || !restaurantId || !processing || !tableId) {
      console.error("Missing required query parameters.");
      return;
    }
    // 실제로는 api서버에 처리결과 기다리야함함
    // 임시 5초 대기 후 성공 페이지로 이동
    const timer = setTimeout(() => {
      router.push(`/payment/complete?orderId=${orderId}&restaurantId=${restaurantId}&tableId=${tableId}`);
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }, [orderId, restaurantId, tableId, processing, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <div className="w-full max-w-md text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">결제 진행 중</h1>
        <div className="flex justify-center">
          <Image
            src="/images/Payment-Process.gif"
            alt="Baemin logo"
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
