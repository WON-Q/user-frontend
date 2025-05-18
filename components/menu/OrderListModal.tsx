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
}

interface OrderListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  restaurantId: string;
}

export default function OrderListModal({ isOpen, onClose, tableId, restaurantId }: OrderListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<Record<string, OrderItem[]>>({});
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
    if (isOpen && restaurantId && tableId) {
      const orderKey = `order_${restaurantId}_${tableId}`;
      const raw = localStorage.getItem(orderKey);

      if (!raw) return;

      try {
        const orderCodes: string[] = JSON.parse(raw);
        const grouped: Record<string, OrderItem[]> = {};

        Promise.all(
          orderCodes.map(async (code) => {
            const res = await fetch(`http://localhost:8080/api/v1/orders/code/${code}`);
            const json = await res.json();
            const order = json.data;

            const date = new Date(order.createdAt);
            const dateLabel = date.toLocaleDateString("ko-KR");
            const timeLabel = date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
            const label = `${dateLabel} ${timeLabel}`;

            if (!grouped[label]) grouped[label] = [];

            order.menus.forEach((menu: any) => {
              grouped[label].push({
                id: menu.menuId,
                name: menu.menuName,
                quantity: menu.quantity,
                price: menu.unitPrice,
                options: (menu.options || []).reduce((acc: any, opt: any) => {
                  acc[opt.optionName] = `${opt.optionPrice.toLocaleString()}원`;
                  return acc;
                }, {}),
              });
            });
          })
        ).then(() => {
          setOrders(grouped);
        });
      } catch (err) {
        console.error("주문 정보 파싱 실패:", err);
      }
    }
  }, [isOpen, restaurantId, tableId]);

  const totalItems = Object.values(orders).flat().reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Object.values(orders).flat().reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
      >
        <div className="bg-gradient-to-r from-orange-50 via-orange-100 to-orange-50 px-5 py-3 flex items-center border-b border-orange-200 animate-pulse">
          <img src="/images/wooripay-icon.png" alt="우리페이" className="w-8 h-8 mr-4" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold text-orange-600">우리페이 결제 시 최대 5% 적립</span>
            <span className="text-xs text-gray-600">QR 간편결제, 지금 리뷰 남기고 혜택까지 받아가세요!</span>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">주문 내역</h2>
          <button onClick={onClose} aria-label="닫기" className="p-2 rounded-full bg-white shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {Object.keys(orders).length === 0 ? (
            <p className="text-sm text-gray-500">주문 내역이 없습니다.</p>
          ) : (
            Object.entries(orders).map(([dateTime, orderList]) => (
              <div key={dateTime} className="mb-5">
                <h3 className="text-[15px] font-bold text-gray-800 mb-3 border-b border-gray-100 pb-1">{dateTime} 주문</h3>
                <ul className="space-y-2">
                  {orderList.map((order, idx) => (
                    <li key={idx} className="flex items-center text-[15px] gap-2 justify-between">
                      <div className="flex-1">
                        <span
                          className="text-gray-800 font-medium cursor-pointer hover:underline truncate block"
                          onClick={() => router.push(`/review/${order.id}`)}
                        >
                          {order.name}
                        </span>
                        {order.options && Object.keys(order.options).length > 0 && (
                          <span className="text-gray-500 text-xs block mt-1">
                            ({Object.entries(order.options).map(([k, v]) => `${k}: ${v}`).join(", ")})
                          </span>
                        )}
                      </div>
                      <div className="text-right min-w-[85px]">
                        <div className="text-gray-600">x {order.quantity}</div>
                        <div className="text-gray-900 font-semibold">{(order.price * order.quantity).toLocaleString()}원</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {Object.keys(orders).length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex justify-between mb-1">
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
