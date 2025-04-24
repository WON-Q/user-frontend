"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 주문 정보 타입 정의
interface OrderSummary {
  orderId: string;
  tableId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    options?: { [key: string]: string };
  }>;
  totalAmount: number;
  orderDate: Date;
}

// 카드 정보 입력 폼 타입
interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardOwner: string;
}

// 더미 주문 정보 (실제로는 API에서 가져옴)
const MOCK_ORDER: OrderSummary = {
  orderId: "1",
  tableId: "1",
  items: [
    {
      name: "시그니처 버거",
      quantity: 2,
      price: 8900,
      options: { 소스: "스파이시", 치즈: "추가" },
    },
    {
      name: "감자튀김",
      quantity: 1,
      price: 3500,
      options: { 사이즈: "라지" },
    },
    {
      name: "콜라",
      quantity: 2,
      price: 2000,
      options: { 사이즈: "미디움", 얼음: "적게" },
    },
  ],
  totalAmount: 25300,
  orderDate: new Date(),
};

export default function PaymentPage({
  params,
}: {
  params: { orderId: string };
}) {
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "wooricard">(
    "card"
  );
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardOwner: "",
  });
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3분 타임아웃

  useEffect(() => {
    // 실제로는 API 호출로 주문 정보 가져오기
    // const fetchOrderDetails = async () => {
    //   try {
    //     const response = await fetch(`/api/orders/${params.orderId}`);
    //     const data = await response.json();
    //     setOrderSummary(data);
    //   } catch (error) {
    //     console.error('주문 정보를 불러오는 데 실패했습니다.', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOrderDetails();

    // 더미 데이터로 테스트
    setOrderSummary(MOCK_ORDER);
    setLoading(false);

    // 결제 타이머 설정 (3분)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          // 시간 초과 시 처리
          setPaymentError(
            "결제 시간이 초과되었습니다. 장바구니로 돌아가 다시 시도해주세요."
          );
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [params.orderId]);

  // 입력 양식 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 입력값 포맷팅
    let formattedValue = value;
    if (name === "cardNumber") {
      // 4자리마다 공백 추가
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
        .trim();
    } else if (name === "expiryDate") {
      // MM/YY 형식으로 포맷팅
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(.{2})(.+)$/, "$1/$2");
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  // 결제 처리 핸들러
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setPaymentError(null);

    try {
      // TODO: 실제로는 PG 시스템이나 iamport API 호출
      // const response = await fetch('/api/payment', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     orderId: params.orderId,
      //     paymentMethod,
      //     cardInfo: paymentMethod === 'card' ? formData : undefined
      //   })
      // });
      // const data = await response.json();
      // if (!data.success) throw new Error(data.message);

      // 결제 성공 시뮬레이션 (1초 대기 후 주문 상태 페이지로 이동)
      setTimeout(() => {
        router.push(`/order/${params.orderId}/status`);
      }, 1500);
    } catch (error) {
      console.error("결제 처리 중 오류가 발생했습니다.", error);
      setPaymentError("결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      setProcessing(false);
    }
  };

  // 타이머 포맷팅 (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>결제 정보 불러오는 중...</p>
      </div>
    );
  }

  if (!orderSummary) {
    return (
      <div className="container mx-auto px-4 py-6 text-center">
        <p>주문 정보를 찾을 수 없습니다.</p>
        <Link href="/" className="text-[#FF6B35] mt-4 inline-block">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6">
        <Link href={`/cart/${orderSummary.tableId}`} className="text-[#FF6B35]">
          &larr; 장바구니로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold mt-2">결제하기</h1>
        <p className="text-sm text-gray-600">
          테이블 번호: {orderSummary.tableId} | 주문번호: {orderSummary.orderId}
        </p>
        <div className="mt-2 text-sm bg-[#FFF8E8] p-2 rounded flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-[#FFD166] mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          결제 제한시간:{" "}
          <span className="font-medium ml-1">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* 주문 요약 */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h2 className="font-semibold mb-2">주문 내역</h2>
        {orderSummary.items.map((item, index) => (
          <div key={index} className="flex justify-between py-1 text-sm">
            <span>
              {item.name} x {item.quantity}
              {item.options && Object.keys(item.options).length > 0 && (
                <span className="text-gray-500 text-xs ml-1">
                  (
                  {Object.entries(item.options)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                  )
                </span>
              )}
            </span>
            <span>{(item.price * item.quantity).toLocaleString()}원</span>
          </div>
        ))}
        <div className="border-t border-gray-200 my-2" />
        <div className="flex justify-between py-2 font-bold">
          <span>총 결제 금액</span>
          <span>{orderSummary.totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 결제 수단 선택 */}
      <div className="mb-6">
        <h2 className="font-semibold mb-4 text-lg">결제수단</h2>
        <div className="space-y-4">
          <label className="flex items-center p-4 border rounded-lg bg-gray-50">
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
          <label className="flex items-center p-4 border rounded-lg bg-gray-50">
            <input
              type="radio"
              name="paymentMethod"
              value="wooricard"
              checked={paymentMethod === "wooricard"}
              onChange={() => setPaymentMethod("wooricard")}
              className="mr-3"
            />
            <div>
              <p className="text-sm font-medium">우리카드 간편결제</p>
              <p className="text-xs text-gray-500">빠르고 간편한 우리카드 결제.</p>
            </div>
          </label>
        </div>
      </div>

      {/* 결제 폼 */}
      {paymentMethod === "card" && (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label
              htmlFor="cardNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
              <label
                htmlFor="cvv"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
            <label
              htmlFor="cardOwner"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            className={`w-full py-3 rounded-md font-medium text-white ${
              processing || timeLeft <= 0
                ? "bg-gray-400"
                : "bg-[#FF6B35] hover:bg-[#C75000]"
            }`}
          >
            {processing
              ? "처리 중..."
              : `${orderSummary.totalAmount.toLocaleString()}원 결제하기`}
          </button>
        </form>
      )}

      {paymentMethod === "wooricard" && (
        <div>
          <div className="bg-[#FFF0E8] p-4 rounded mb-4 text-center">
            <p className="text-sm">우리카드 간편결제를 선택하셨습니다.</p>
            <p className="text-sm">
              아래 버튼을 클릭하시면 우리카드 결제 페이지로 이동합니다.
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
            className={`w-full py-3 rounded-md font-medium text-white ${
              processing || timeLeft <= 0
                ? "bg-gray-400"
                : "bg-[#FF6B35] hover:bg-[#C75000]"
            }`}
          >
            {processing ? "처리 중..." : "우리카드로 결제하기"}
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
