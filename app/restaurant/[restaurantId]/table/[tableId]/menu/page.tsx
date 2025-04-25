"use client";

import { useEffect, useState, useRef } from "react";
import { use } from "react";
import Link from "next/link";
import MenuCard from "@/components/menu/MenuCard";
import MenuDetailModal from "@/components/menu/MenuDetailModal";
import NavBar from "@/components/navbar/NavBar";

import OrderListModal from "@/components/menu/OrderListModal";

import { MenuItem, MenuCategory, SelectedOptions } from "@/types/menu";

// 더미 데이터 - 실제론 API 호출로 대체
const MOCK_CATEGORIES: MenuCategory[] = [
  { id: "all", name: "전체" },
  { id: "main", name: "메인메뉴" },
  { id: "side", name: "사이드" },
  { id: "drink", name: "음료" },
  { id: "dessert", name: "디저트" },
];

const MOCK_MENU_ITEMS = [
  {
    id: 1,
    name: "시그니처 버거",
    price: 8900,
    image: "/images/burger.jpg",
    description: "원큐오더 시그니처 버거",
    categoryId: "main",
    badge: "인기",
    options: [
      {
        title: "소스 선택",
        required: true,
        items: [
          { name: "기본 소스", price: 0 },
          { name: "스파이시 소스", price: 500 },
          { name: "갈릭 소스", price: 500 },
        ],
      },
      {
        title: "치즈 추가",
        required: false,
        items: [
          { name: "치즈 없음", price: 0 },
          { name: "치즈 추가", price: 1000 },
          { name: "더블 치즈", price: 2000 },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "치즈 버거",
    price: 7900,
    image: "/images/cheeseburger.jpg",
    description: "풍미 가득한 치즈 버거",
    categoryId: "main",
    options: [
      {
        title: "소스 선택",
        required: true,
        items: [
          { name: "기본 소스", price: 0 },
          { name: "스파이시 소스", price: 500 },
          { name: "갈릭 소스", price: 500 },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "감자튀김",
    price: 3500,
    image: "/images/fries.jpg",
    description: "바삭한 감자튀김",
    categoryId: "side",
    badge: "신메뉴",
    options: [
      {
        title: "사이즈",
        required: true,
        items: [
          { name: "미디움", price: 0 },
          { name: "라지", price: 1500 },
        ],
      },
    ],
  },
  {
    id: 4,
    name: "콜라",
    price: 2000,
    image: "/images/cola.jpg",
    description: "시원한 콜라",
    categoryId: "drink",
    options: [
      {
        title: "사이즈",
        required: true,
        items: [
          { name: "미디움", price: 0 },
          { name: "라지", price: 800 },
        ],
      },
      {
        title: "얼음",
        required: true,
        items: [
          { name: "보통", price: 0 },
          { name: "적게", price: 0 },
          { name: "없음", price: 0 },
        ],
      },
    ],
  },
  {
    id: 5,
    name: "아이스크림",
    price: 2500,
    image: "/images/icecream.jpg",
    description: "달콤한 아이스크림",
    categoryId: "dessert",
    options: [
      {
        title: "토핑 선택",
        required: false,
        items: [
          { name: "토핑 없음", price: 0 },
          { name: "초콜릿 토핑", price: 800 },
          { name: "딸기 토핑", price: 800 },
        ],
      },
    ],
  },
];

export default function MenuPage({
  params: paramsPromise,
}: {
  params: Promise<{ restaurantId: string; tableId: string }>;
}) {
  const params = use(paramsPromise);
  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems] = useState<MenuItem[]>(MOCK_MENU_ITEMS);
  const [storeName, setStoreName] = useState("원큐오더 레스토랑");
  const [cartItemCount, setCartItemCount] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [loading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    setStoreName(`원큐오더 레스토랑 `);

    const cartData = localStorage.getItem(`cart_${params.tableId}`);
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        const count = cart.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0
        );
        setCartItemCount(count);
      } catch (e) {
        console.error("장바구니 데이터 처리 오류", e);
      }
    }

    const lastActivity = localStorage.getItem(`lastActivity_${params.tableId}`);
    const now = Date.now();
    if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
      localStorage.removeItem(`cart_${params.tableId}`);
      setCartItemCount(0);
    }
    localStorage.setItem(`lastActivity_${params.tableId}`, now.toString());

    return () => clearTimeout(timer);
  }, [params.restaurantId, params.tableId]);

  const filteredMenuItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.categoryId === activeCategory);

  const scrollToCategory = (index: number) => {
    if (categoryScrollRef.current) {
      const categoryElement = categoryScrollRef.current.children[index];
      if (categoryElement) {
        const scrollLeft =
          categoryElement.getBoundingClientRect().left +
          categoryScrollRef.current.scrollLeft -
          categoryScrollRef.current.getBoundingClientRect().left -
          16;
        categoryScrollRef.current.scrollTo({
          left: scrollLeft,
          behavior: "smooth",
        });
      }
    }
  };

  const handleMenuClick = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };
  


  return (
    <div className="flex flex-col min-h-screen bg-blue-white pb-20">
      
      
      <NavBar tableId={params.tableId}>
         {storeName}
      </NavBar>

    

      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div
          ref={categoryScrollRef}
          className="flex overflow-x-auto py-3 px-4 hide-scrollbar ios-scroll"
        >
          {MOCK_CATEGORIES.map((category, index) => (
            <button
              key={category.id}
              className={`category-btn whitespace-nowrap mr-2 last:mr-0 ${
                activeCategory === category.id ? "active" : ""
              } no-highlight`}
              onClick={() => {
                setActiveCategory(category.id);
                scrollToCategory(index);
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-card overflow-hidden shadow-md h-64 animate-pulse"
                >
                  <div className="h-36 bg-gray-200 w-full"></div>
                  <div className="p-4">
                    <div className="h-5 w-2/3 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 mb-1 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 mb-2 rounded"></div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="h-5 w-1/3 bg-gray-200 rounded"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 px-4 py-6">
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMenuItems.map((menu) => (
                <MenuCard key={menu.id} menu={menu} onClick={handleMenuClick} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-4 text-gray-500">
                해당 카테고리에 메뉴가 없습니다
              </p>
            </div>
          )}
        </div>
      )}

      <MenuDetailModal
        menu={selectedMenu}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        restaurantId={params.restaurantId}
        tableId={params.tableId}
      />

      <div className="fixed bottom-5 inset-x-0 flex justify-center z-20">
        <Link
          href={`/restaurant/${params.restaurantId}/table/${params.tableId}/cart`}
          className="flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-full shadow-lg active:scale-95 transition-transform no-highlight"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          장바구니 보기
          {cartItemCount > 0 && (
            <span className="ml-2 bg-white text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm font-semibold">
              {cartItemCount}
            </span>
          )}
        </Link>
      </div>

      <div
        id="cartSuccess"
        className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#FF6B35] text-white px-4 py-2 rounded-[8px] shadow-md opacity-0 translate-y-2 transition-all duration-300"
      >
        장바구니에 추가되었습니다
      </div>

      <style jsx global>{`
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .active {
          background-color: #ff6b35;
          color: white;
        }

        .category-btn {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
          background-color: #f8f8f8;
          color: #4a4a4a;
        }

        .no-highlight {
          -webkit-tap-highlight-color: transparent;
        }

        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .ios-scroll {
          -webkit-overflow-scrolling: touch;
        }

        .active:scale-98 {
          transform: scale(0.98);
        }

        .rounded-card {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
