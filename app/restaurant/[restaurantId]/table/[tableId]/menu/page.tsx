"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MenuCard from "@/components/menu/MenuCard";
import MenuDetailModal from "@/components/menu/MenuDetailModal";
import NavBar from "@/components/navbar/NavBar";
import { fetchMenusByMerchant, MenuResponse } from "@/lib/merchant/menu";
import { MenuItem, MenuCategory } from "@/types/menu";

export default function MenuPage() {
  const pathname = usePathname();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [tableId, setTableId] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState("all");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [storeName, setStoreName] = useState("원큐오더 레스토랑");
  const [cartItemCount, setCartItemCount] = useState(0);
  const categoryScrollRef = useRef<HTMLDivElement>(null);
  const [loading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const parts = pathname.split("/");
    setRestaurantId(parts[2] || null);
    setTableId(parts[4] || null);
  }, [pathname]);

  useEffect(() => {
    if (!restaurantId || !tableId) return;

    const fetchData = async () => {
      try {
        const menus: MenuResponse[] = await fetchMenusByMerchant(restaurantId);

        const uniqueCategories = Array.from(
          new Set(menus.map((m) => m.category))
        ).map((cat) => ({
          id: cat.toLowerCase(),
          name: cat,
        }));
        setCategories([{ id: "all", name: "전체" }, ...uniqueCategories]);

        const parsedMenus: MenuItem[] = menus.map((menu) => ({
          id: menu.menuId,
          name: menu.name,
          description: menu.description,
          price: menu.price,
          image: menu.menuImgUrl,
          categoryId: menu.category.toLowerCase(),
          options: menu.optionGroups.map((group) => ({
            title: group.groupName,
            required: group.isDefault,
            items: group.options.map((opt) => ({
              name: opt.optionName,
              price: opt.optionPrice,
            })),
          })),
        }));

        setMenuItems(parsedMenus);
      } catch (error) {
        console.error("메뉴 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const cartData = localStorage.getItem(`cart_${tableId}`);
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

    const lastActivity = localStorage.getItem(`lastActivity_${tableId}`);
    const now = Date.now();
    if (lastActivity && now - parseInt(lastActivity) > 30 * 60 * 1000) {
      localStorage.removeItem(`cart_${tableId}`);
      setCartItemCount(0);
    }
    localStorage.setItem(`lastActivity_${tableId}`, now.toString());

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [restaurantId, tableId]);

  if (!restaurantId || !tableId) return null;

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
        categoryScrollRef.current.scrollTo({ left: scrollLeft, behavior: "smooth" });
      }
    }
  };

  const handleMenuClick = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-white pb-20">
      <NavBar tableId={tableId} restaurantId={restaurantId} showOrderListModal>
        {storeName}
      </NavBar>

      <div className="sticky top-[72px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div
          ref={categoryScrollRef}
          className="flex overflow-x-auto py-3 px-4 hide-scrollbar ios-scroll"
        >
          {categories.map((category, index) => (
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
        restaurantId={restaurantId}
        tableId={tableId}
      />

      <div className="fixed bottom-5 inset-x-0 flex justify-center z-20">
        <Link
          href={`/restaurant/${restaurantId}/table/${tableId}/cart`}
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
    </div>
  );
}
