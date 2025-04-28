// OrderListModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
  options?: Record<string, any>;
}

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
}

export default function OrderListModal({ isOpen, onClose, tableId }: OrderListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 바깥 클릭 시 닫기
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

  // 주문 데이터 불러오기
  useEffect(() => {
    if (isOpen) {
      const matchedKeys = Object.keys(localStorage).filter((key) =>
        key.endsWith(`_t${tableId}`)
      );

      const groupedOrders: Record<string, OrderItem[]> = {};

      matchedKeys.forEach((key) => {
        const storedOrders = localStorage.getItem(key);
        if (storedOrders) {
          try {
            const parsedOrders: OrderItem[] = JSON.parse(storedOrders);

            // 키에서 날짜와 시간(YYYY-MM-DD HH:mm) 추출
            const dateTimeMatch = key.match(/(\d{6})T(\d{4})_t/);
            const dateLabel = dateTimeMatch
              ? `20${dateTimeMatch[1].slice(0, 2)}-${dateTimeMatch[1].slice(2, 4)}-${dateTimeMatch[1].slice(4, 6)}`
              : "날짜 없음";
            const timeLabel = dateTimeMatch
              ? `${dateTimeMatch[2].slice(0, 2)}:${dateTimeMatch[2].slice(2, 4)}`
              : "시간 없음";
            const dateTimeLabel = `${dateLabel} ${timeLabel}`;

            if (!groupedOrders[dateTimeLabel]) {
              groupedOrders[dateTimeLabel] = [];
            }
            groupedOrders[dateTimeLabel].push(...parsedOrders);

          } catch (e) {
            console.error("로컬스토리지 파싱 오류:", e);
          }
        }
      });

      setOrders(groupedOrders);
    }
  }, [isOpen, tableId]);

  const totalItems = Object.values(orders).flat().reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Object.values(orders).flat().reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen || !mounted) return null;
  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center sm:items-center">
      <div
        ref={modalRef}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
          <button onClick={onClose} aria-label="닫기" className="p-2 rounded-full bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
  
        <div className="flex-1 overflow-y-auto p-5">
          {Object.keys(orders).length === 0 ? (
            <p className="text-sm text-gray-500">주문 내역이 없습니다.</p>
          ) : (
            Object.entries(orders).map(([dateTime, orderList]) => (
              <div key={dateTime} className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{dateTime} 주문</h3>
                <ul className="space-y-2">
                  {orderList.map((order, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span>
                        {order.name} x {order.quantity}
                        {order.options && Object.keys(order.options).length > 0 && (
                          <span className="text-gray-500 text-xs ml-1">
                            ({Object.entries(order.options).map(([k, v]) => `${k}: ${v}`).join(", ")})
                          </span>
                        )}
                      </span>
                      <span>{(order.price * order.quantity).toLocaleString()}원</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
  
        {Object.keys(orders).length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-900">총 메뉴 수</span>
              <span className="font-bold text-primary">{totalItems}개</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">총 금액</span>
              <span className="font-bold text-xl text-primary">{totalAmount.toLocaleString()}원</span>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
  
}
