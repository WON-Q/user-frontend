"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MenuItem } from "@/types/menu";

interface ReviewItem {
  id: number;
  name: string;
  image?: string;
  reviewed?: boolean;
}

interface ReviewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  restaurantId: string;
  menuItems: MenuItem[];
}

export default function ReviewListModal({ isOpen, onClose, tableId, restaurantId, menuItems }: ReviewListModalProps) {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<ReviewItem[]>([]);
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

      const fetchMenus = async () => {
        try {
          const orderCodes: string[] = JSON.parse(raw);

          const allMenus = await Promise.all(
            orderCodes.map(async (code) => {
              const res = await fetch(`http://localhost:8080/api/v1/orders/code/${code}`);
              const json = await res.json();
              const order = json.data;

              return order.menus.map((menu: any) => ({
                id: menu.menuId,
                name: menu.menuName,
                reviewed: false,
              }));
            })
          );

          const flatMenus = allMenus.flat();

          // ✅ menuId 기준으로 중복 제거 및 이미지 매칭
          const uniqueMenusMap = new Map<number, ReviewItem>();
          flatMenus.forEach((menu) => {
            if (!uniqueMenusMap.has(menu.id)) {
              const matchedImage = menuItems.find((item) => item.id === menu.id)?.image;
              uniqueMenusMap.set(menu.id, {
                ...menu,
                image: matchedImage || "/placeholder.png",
              });
            }
          });

          setOrders(Array.from(uniqueMenusMap.values()));
        } catch (err) {
          console.error("📛 리뷰 메뉴 불러오기 실패:", err);
        }
      };

      fetchMenus();
    }
  }, [isOpen, restaurantId, tableId, menuItems]);

  const handleReviewClick = (menuId: number) => {
    router.push(`/review/${menuId}`);
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col animate-fade-in"
      >
        <div className="bg-[var(--color-primary-light)] px-4 py-3 flex items-center justify-between border-b border-[var(--color-primary)]">
          <div className="flex items-center gap-2">
            <span className="text-xl animate-bounce">🎁</span>
            <span className="text-sm text-gray-800 font-medium">
              지금 리뷰 작성 시 <span className="text-[var(--color-primary)] font-bold">100P 포인트</span> 지급!
            </span>
          </div>
          <span className="text-xs text-[var(--color-primary-dark)] font-semibold animate-bounce">
            리뷰 작성하고 혜택 받기
          </span>
        </div>

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

        <div className="flex-1 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">작성할 리뷰가 없습니다.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-8 p-4 rounded-lg border border-gray-200 bg-white shadow-md"
                >
                  {order.image ? (
                    <img
                      src={order.image}
                      alt={order.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <p className="text-base font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis font-[Pretendard]">
                    {order.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReviewClick(order.id)}
                    disabled={order.reviewed}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shadow ${
                      order.reviewed
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
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
