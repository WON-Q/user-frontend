"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 주문 상태 타입 정의
type OrderStatus =
  | "received"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed";

// 주문 정보 타입
interface OrderDetail {
  orderId: string;
  tableId: string;
  storeId: string;
  status: OrderStatus;
  items: Array<{
    id: number;
    name: string;
    quantity: number;
    price: number;
    options?: { [key: string]: string };
  }>;
  totalAmount: number;
  orderTime: string;
  estimatedTime?: number; // 예상 소요 시간(분)
}

// 상태별 표시 정보
const STATUS_INFO = {
  received: {
    title: "주문 접수 중",
    description: "매장에 주문이 전달되었습니다. 잠시 기다려주세요.",
    icon: "🛎️",
    color: "bg-blue-500",
  },
  confirmed: {
    title: "주문 확인 완료",
    description: "매장에서 주문을 확인했습니다.",
    icon: "✅",
    color: "bg-green-500",
  },
  preparing: {
    title: "조리 중",
    description: "맛있는 음식을 준비 중입니다.",
    icon: "👨‍🍳",
    color: "bg-yellow-500",
  },
  ready: {
    title: "서빙 준비 완료",
    description: "잠시 후 테이블에 서빙됩니다.",
    icon: "🍽️",
    color: "bg-purple-500",
  },
  completed: {
    title: "서빙 완료",
    description: "주문하신 메뉴가 모두 서빙되었습니다. 맛있게 드세요!",
    icon: "🎉",
    color: "bg-green-600",
  },
};

// 더미 주문 데이터 (실제로는 API 호출로 대체)
const MOCK_ORDER: OrderDetail = {
  orderId: "123456",
  tableId: "1",
  storeId: "1",
  status: "preparing",
  items: [
    {
      id: 1,
      name: "시그니처 버거",
      quantity: 2,
      price: 8900,
      options: { 소스: "스파이시", 치즈: "추가" },
    },
    {
      id: 3,
      name: "감자튀김",
      quantity: 1,
      price: 3500,
      options: { 사이즈: "라지" },
    },
    {
      id: 4,
      name: "콜라",
      quantity: 2,
      price: 2000,
      options: { 사이즈: "미디움", 얼음: "적게" },
    },
  ],
  totalAmount: 25300,
  orderTime: "2025-04-23T12:30:00Z",
  estimatedTime: 15,
};

// 진행 상태 컴포넌트
function StatusProgress({ currentStatus }: { currentStatus: OrderStatus }) {
  const statuses: OrderStatus[] = [
    "received",
    "confirmed",
    "preparing",
    "ready",
    "completed",
  ];
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="my-8">
      <div className="flex justify-between mb-2">
        {statuses.map((status, index) => (
          <div key={status} className="flex flex-col items-center w-1/5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentIndex
                  ? STATUS_INFO[status].color
                  : "bg-gray-200"
              } text-white text-sm font-medium`}
            >
              {index <= currentIndex ? STATUS_INFO[status].icon : index + 1}
            </div>
            <span className="text-xs mt-1 text-center">
              {STATUS_INFO[status].title}
            </span>
          </div>
        ))}
      </div>
      <div className="relative h-2 bg-gray-200 rounded">
        <div
          className="absolute h-2 bg-blue-500 rounded"
          style={{
            width: `${(currentIndex / (statuses.length - 1)) * 100}%`,
            transition: "width 1s ease-in-out",
          }}
        ></div>
      </div>
    </div>
  );
}

export default function OrderStatusPage({
  params,
}: {
  params: { orderId: string };
}) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 실제로는 API 호출하여 주문 상태 가져오기
    // const fetchOrderStatus = async () => {
    //   try {
    //     const response = await fetch(`/api/orders/${params.orderId}/status`);
    //     if (!response.ok) throw new Error('주문을 찾을 수 없습니다.');
    //     const data = await response.json();
    //     setOrder(data);
    //   } catch (error) {
    //     setError('주문 정보를 불러오는 데 실패했습니다.');
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchOrderStatus();

    // TODO: 실시간 업데이트를 위한 폴링 설정 (10초마다)
    // const intervalId = setInterval(fetchOrderStatus, 10000);
    // return () => clearInterval(intervalId);

    // 더미 데이터로 테스트
    setOrder(MOCK_ORDER);
    setLoading(false);

    // 개발 테스트용 상태 자동 변경
    const statusSequence: OrderStatus[] = [
      "received",
      "confirmed",
      "preparing",
      "ready",
      "completed",
    ];
    let currentIndex = statusSequence.indexOf("preparing"); // 초기 상태

    const intervalId = setInterval(() => {
      if (currentIndex < statusSequence.length - 1) {
        currentIndex++;
        setOrder((prev) =>
          prev ? { ...prev, status: statusSequence[currentIndex] } : null
        );
      } else {
        clearInterval(intervalId);
      }
    }, 5000); // 5초마다 상태 변경

    return () => clearInterval(intervalId);
  }, [params.orderId]);

  // 주문 시간 포맷팅
  const formatOrderTime = (timeString: string) => {
    const orderDate = new Date(timeString);
    return orderDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p>주문 상태를 확인 중입니다...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-500">
          {error || "주문 정보를 찾을 수 없습니다."}
        </p>
        <Link href="/" className="text-blue-600 mt-4 inline-block">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_INFO[order.status];

  return (
    <div className="container mx-auto px-4 py-6 max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">주문 상태</h1>
        <p className="text-sm text-gray-600">
          주문번호: {order.orderId} | 테이블 번호: {order.tableId}
        </p>
      </div>

      {/* 현재 상태 요약 */}
      <div
        className={`p-6 rounded-lg mb-6 ${statusInfo.color.replace(
          "bg-",
          "bg-opacity-20 bg-"
        )}`}
      >
        <div className="flex items-center">
          <span className="text-4xl mr-4">{statusInfo.icon}</span>
          <div>
            <h2 className="text-xl font-semibold">{statusInfo.title}</h2>
            <p className="text-sm">{statusInfo.description}</p>
            {order.estimatedTime && order.status !== "completed" && (
              <p className="text-sm font-medium mt-1">
                예상 소요 시간: 약 {order.estimatedTime}분
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 상태 진행 표시 */}
      <StatusProgress currentStatus={order.status} />

      {/* 주문 상세 정보 */}
      <div className="bg-gray-50 p-4 rounded mb-6">
        <h3 className="font-semibold mb-2">주문 내역</h3>
        <p className="text-sm text-gray-600 mb-2">
          주문 시간: {formatOrderTime(order.orderTime)}
        </p>

        {order.items.map((item, index) => (
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
          <span>{order.totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      {/* 추가 주문 버튼 */}
      <div className="mt-6">
        <Link
          href={`/menu/${order.storeId}?tableId=${order.tableId}`}
          className="block w-full py-3 bg-blue-600 text-white text-center rounded-md"
        >
          추가 주문하기
        </Link>
      </div>

      {/* 자동 새로고침 안내 */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>주문 상태는 자동으로 업데이트됩니다.</p>
        <p>브라우저를 닫아도 동일한 URL로 주문 상태를 확인할 수 있습니다.</p>
      </div>
    </div>
  );
}
