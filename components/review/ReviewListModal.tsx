"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
  reviewed?: boolean;
}

interface ReviewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
}

export default function ReviewListModal({ isOpen, onClose, tableId }: ReviewListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const dummyOrders: OrderItem[] = [
        {
          id: 1,
          name: "치즈버거 세트",
          quantity: 1,
          price: 8500,
          options: { 사이드: "감자튀김", 음료: "콜라" },
          reviewed: false,
        },
        {
          id: 2,
          name: "불고기 버거",
          quantity: 1,
          price: 7900,
          options: { 사이드: "치즈볼" },
          reviewed: true,
        },
        {
          id: 3,
          name: "스파게티",
          quantity: 1,
          price: 12000,
          options: { 추가: "치즈" },
          reviewed: false,
        },
      ];
      setOrders(dummyOrders);
    }
  }, [isOpen]);

  const handleReviewClick = (orderId: number) => {
    router.push(`/restaurant/${orderId}/review/${orderId}`);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
      >
        {/* Reward Banner */}
        <div className="bg-[var(--color-primary-light)] px-4 py-3 flex items-center justify-between border-b border-[var(--color-primary)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎁</span>
            <span className="text-sm text-gray-800 font-medium">
              지금 리뷰 작성 시 <span className="text-[var(--color-primary)] font-bold">100P 포인트</span> 지급!
            </span>
          </div>
          <span className="text-xs text-[var(--color-primary-dark)] font-semibold animate-bounce">
            리뷰 작성하고 혜택 받기
          </span>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">리뷰 작성</h2>
          <button onClick={onClose} aria-label="닫기" className="p-2 rounded-full bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">주문 내역이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center p-3 rounded-lg bg-orange-50 border border-orange-100"
                >
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-gray-900">{order.name}</span>
                    {order.options && Object.keys(order.options).length > 0 && (
                      <span className="text-[13px] text-orange-600 mt-1">
                        {Object.entries(order.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleReviewClick(order.id)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 shadow ${
                      order.reviewed
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-orange-400 text-white hover:bg-orange-500"
                    }`}
                    disabled={order.reviewed}
                  >
                    {order.reviewed ? "리뷰 완료" : "리뷰 달기"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
