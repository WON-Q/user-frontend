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
  reviewed?: boolean; // Add a flag to track if the item has been reviewed
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

  // Close modal on outside click
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

  // Load order data
  useEffect(() => {
    if (isOpen) {
      const matchedKeys = Object.keys(localStorage).filter((key) =>
        key.endsWith(`_t${tableId}`)
      );

      const allOrders: OrderItem[] = [];

      matchedKeys.forEach((key) => {
        const storedOrders = localStorage.getItem(key);
        if (storedOrders) {
          try {
            const parsedOrders: OrderItem[] = JSON.parse(storedOrders);
            allOrders.push(...parsedOrders);
          } catch (e) {
            console.error("로컬스토리지 파싱 오류:", e);
          }
        }
      });

      setOrders(allOrders);
    }
  }, [isOpen, tableId]);

  const handleReviewClick = (orderId: number) => {
    // Navigate to the review page
    router.push(`/restaurant/${orderId}/review/${orderId}`);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">리뷰 작성</h2>
          <button onClick={onClose} aria-label="닫기" className="p-2 rounded-full bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">주문 내역이 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, idx) => (
                <li key={idx} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{order.name}</p>
                    {order.options && Object.keys(order.options).length > 0 && (
                      <p className="text-gray-500 text-xs">
                        ({Object.entries(order.options).map(([k, v]) => `${k}: ${v}`).join(", ")})
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleReviewClick(order.id)}
                    className={`px-4 py-2 rounded-lg text-xs ${
                      order.reviewed
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
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
