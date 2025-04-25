"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function PaymentContent({ orderId }: { orderId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId");
  const tableId = searchParams.get("tableId");

  const { items, totalAmount, clearCart } = useCart();

  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wooricard" | "tosspay" | "kakaopay">("wooricard");
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardOwner: "",
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentError("결제 시간이 초과되었습니다. 장바구니로 돌아가 다시 시도해주세요.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;
    if (name === "cardNumber") {
      formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      formatted = value.replace(/\D/g, "").replace(/^(.{2})(.+)$/, "$1/$2");
    }
    setFormData((prev) => ({ ...prev, [name]: formatted }));
  };

  const generateOrderId = (tableId: string | null) => {
    const now = new Date();
    const yy = now.getFullYear().toString().slice(2); // 연도 2자리
    const MM = (now.getMonth() + 1).toString().padStart(2, "0"); // 월
    const dd = now.getDate().toString().padStart(2, "0"); // 일
    const HH = now.getHours().toString().padStart(2, "0"); // 시
    const mm = now.getMinutes().toString().padStart(2, "0"); // 분
  
    return `${yy}${MM}${dd}T${HH}${mm}_t${tableId}`;
  };
  
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);
  
    try {
      const generatedOrderId = generateOrderId(tableId); // 주문 ID 생성
  
      const orderPayload = {
        order_id: generatedOrderId,
        totalAmount: totalAmount,
        items: items.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
          options: item.options || {},
        })),
      };
  
      // 💡 실제 API 호출 (지금은 mock)
      // await fetch("/api/order", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(orderPayload),
      // });
  
      // ✅ 기존 cart 삭제
      clearCart();
  
      // ✅ 새로 생성한 order_id로 cart 저장
      localStorage.setItem(
        `${generatedOrderId}`,
        JSON.stringify(items)
      );
  
      // 🔄 메뉴 페이지 이동
      router.push(`/restaurant/${restaurantId}/table/${tableId}/menu`);
    } catch (error) {
      console.error(error);
      setPaymentError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setProcessing(false);
    }
  };
  
  

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>장바구니가 비어 있습니다.</p>
        <Link
          href={`/restaurant/${restaurantId}/table/${tableId}/cart`}
          className="text-[#FF6B35] mt-4 inline-block"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6">
        <Link
          href={`/restaurant/${restaurantId}/table/${tableId}/cart`}
          className="text-[#FF6B35]"
        >
          &larr; 장바구니로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold mt-2">주문하기</h1>
        <div className="mt-2 text-sm bg-[#FFF8E8] p-2 rounded flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#FFD166] mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          결제 제한시간: <span className="font-medium ml-1">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 주문 요약 */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">주문 내역</h2>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between py-1 text-sm">
            <span>
              {item.name} x {item.quantity}
              {item.options && Object.keys(item.options).length > 0 && (
                <span className="text-gray-500 text-xs ml-1">
                  ({Object.entries(item.options).map(([k, v]) => `${k}: ${v}`).join(", ")})
                </span>
              )}
            </span>
            <span>{item.totalPrice.toLocaleString()}원</span>
          </div>
        ))}
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between py-2 font-bold">
          <span>총 결제 금액</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제 수단 선택 */}
      <div className="mb-6">
        <h2 className="font-semibold mb-4 text-lg">결제수단</h2>
        <div className="flex flex-col space-y-3 p-4 rounded-lg bg-gray-50">
          <label className="flex flex-col cursor-pointer">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="wooricard"
                checked={paymentMethod === "wooricard"}
                onChange={() => setPaymentMethod("wooricard")}
                className="mr-3"
              />
              <div>
                <p className="text-sm font-medium">우리페이</p>
                <p className="text-xs text-gray-500">빠르고 간편한 우리페이 결제.</p>
              </div>
            </div>
            <div className="mt-2 bg-[#FFF8E8] p-2 rounded text-xs text-[#FF6B35]">
              첫 결제 시 <span className="font-bold">포인트 1,000원 적립</span>!<br />
              첫 결제일부터 6개월 동안 <span className="font-bold">0.5% 추가 적립</span>.
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="tosspay"
              checked={paymentMethod === "tosspay"}
              onChange={() => setPaymentMethod("tosspay")}
              className="mr-3"
            />
            <img src="/toss.png" alt="토스페이" className="w-6 h-6 mr-2" />
            <div>
              <p className="text-sm font-medium">토스페이</p>
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="kakaopay"
              checked={paymentMethod === "kakaopay"}
              onChange={() => setPaymentMethod("kakaopay")}
              className="mr-3"
            />
            <img src="/kakao.svg" alt="카카오페이" className="w-6 h-6 mr-2" />
            <div>
              <p className="text-sm font-medium">카카오페이</p>
            </div>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="mr-3"
            />
            <div>
              <p className="text-sm font-medium">신용/체크카드</p>
              <p className="text-xs text-gray-500">모든 카드 결제가 가능합니다.</p>
            </div>
          </label>
        </div>
      </div>

      {/* 결제 폼 */}
      {paymentMethod === "card" && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
              카드 번호
            </label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="0000 0000 0000 0000"
              maxLength={19}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                유효기간 (MM/YY)
              </label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="000"
                maxLength={3}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="cardOwner" className="block text-sm font-medium text-gray-700 mb-1">
              카드 소유자
            </label>
            <input
              type="text"
              id="cardOwner"
              name="cardOwner"
              value={formData.cardOwner}
              onChange={handleInputChange}
              placeholder="카드에 표시된 이름"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          {paymentError && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm">
              {paymentError}
            </div>
          )}
          <button
            type="submit"
            disabled={processing || timeLeft <= 0}
            className={`w-full py-3 rounded-md font-medium text-white transition-all duration-200 ${
              processing || timeLeft <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF6B35] hover:bg-[#C75000] shadow-md"
            }`}
          >
            {processing ? "처리 중..." : `${totalAmount.toLocaleString()}원 결제하기`}
          </button>
        </form>
      )}

      {["wooricard", "tosspay", "kakaopay"].includes(paymentMethod) && (
        <div>
          <div className="bg-[#FFF0E8] p-4 rounded mb-4 text-center">
            <p className="text-sm">
              {paymentMethod === "wooricard"
                ? "우리카드 간편결제를 선택하셨습니다."
                : paymentMethod === "tosspay"
                ? "토스페이를 선택하셨습니다."
                : "카카오페이를 선택하셨습니다."}
            </p>
            <p className="text-sm">
              아래 버튼을 클릭하시면 {paymentMethod === "wooricard"
                ? "우리카드"
                : paymentMethod === "tosspay"
                ? "토스페이"
                : "카카오페이"} 결제 페이지로 이동합니다.
            </p>
          </div>
          {paymentError && (
            <div className="p-3 bg-red-50 text-red-700 rounded text-sm mb-4">
              {paymentError}
            </div>
          )}
          <button
            onClick={handlePayment}
            disabled={processing || timeLeft <= 0}
            className={`w-full py-3 rounded-md font-medium text-white transition-all duration-200 ${
              processing || timeLeft <= 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF6B35] hover:bg-[#C75000] shadow-md"
            }`}
          >
            {processing
              ? "처리 중..."
              : `${paymentMethod === "wooricard"
                  ? "우리카드로 결제하기"
                  : paymentMethod === "tosspay"
                  ? "토스페이로 결제하기"
                  : "카카오페이로 결제하기"}`}
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-gray-500">
        <p>원큐오더는 안전한 결제 환경을 제공합니다.</p>
        <p>결제 정보는 PCI-DSS 기준에 따라 암호화됩니다.</p>
      </div>
    </div>
  );
}
