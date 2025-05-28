"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function PaymentProcessingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();

  const orderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId ?? "";

  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");
  const orderCode = orderId;

  useEffect(() => {
    if (!orderId || !restaurantId || !tableId) {
      console.error("Missing required query parameters.");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `http://192.168.0.168:8080/api/v1/orders/code/${orderCode}/verify`,
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
        console.log(result);

        if (result?.data?.paymentStatus === "COMPLETED") {
          router.push(
            `/payment/${orderId}/complete?restaurantId=${restaurantId}&tableId=${tableId}`
          );
        } else {
          console.log("Payment not succeeded yet. Retrying in 5s...");
          setTimeout(verifyPayment, 5000);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
      }
    };

    verifyPayment();
  }, [orderId, restaurantId, tableId, router, orderCode]);

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
