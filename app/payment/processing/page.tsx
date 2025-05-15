"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function PaymentProcessingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          router.push("/payment/complete");
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Image
            src="/placeholder.svg?height=80&width=80"
            alt="Baemin logo"
            width={80}
            height={80}
            className="rounded-xl"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-800">결제 중입니다</h1>

        <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full bg-[#2AC1BC] transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex items-center justify-center space-x-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin text-[#2AC1BC]" />
          <p>잠시만 기다려주세요...</p>
        </div>

        <p className="text-sm text-gray-500">결제가 진행 중입니다. 페이지를 닫지 마세요.</p>
      </div>
    </div>
  );
}
