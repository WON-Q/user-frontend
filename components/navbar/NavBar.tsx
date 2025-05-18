import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import OrderListModal from "@/components/menu/OrderListModal"; // 모달 import

interface NavBarProps {
  tableId: string | null;
  restaurantId?: string;
  children: ReactNode;
  type?: "back" | "logo";
  showOrderListModal?: boolean; // New prop to control modal visibility
  storeImgUrl?: string | null; // Add store image URL prop
}

export default function NavBar({
  tableId,
  restaurantId,
  children,
  type = "logo",
  showOrderListModal = false,
  storeImgUrl, // Destructure storeImgUrl
}: NavBarProps) {
  const router = useRouter();
  const [isOrderModalOpen, setOrderModalOpen] = useState(false);

  const handleBack = () => {
    if (restaurantId && tableId) {
      router.push(`/restaurant/${restaurantId}/table/${tableId}/menu`);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-3 px-4 relative">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 로고 or 뒤로가기 */}
        <div className="flex items-center">
              {type === "back" ? (
          <button onClick={handleBack} aria-label="뒤로가기">
            <img src="/back.svg" alt="Back" className="w-6 h-6" />
          </button>
        ) : storeImgUrl ? (
          <img
            src={storeImgUrl}
            alt="Store Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : null}
          {children === "장바구니" ? (
            <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-[20px] text-[#1A1A1A]">
              {children}
            </h1>
          ) : (
            <h1 className="ml-2 font-bold text-[20px] text-[#1A1A1A]">{children}</h1>
          )}
        </div>

        {/* 오른쪽: 주문내역 버튼 + 테이블 번호 */}
        <div className="flex items-center space-x-2">
          {tableId && showOrderListModal && (
            <button
              onClick={() => setOrderModalOpen(true)}
              className="flex flex-col items-center justify-center min-w-[60px] min-h-[56px] bg-[#FFE4E1] border border-gray-200 rounded-lg shadow-sm hover:bg-[#FFDAB9]"
            >
              <span className="text-[14px] font-bold text-[#1A1A1A] leading-none">주문내역</span>
              <span className="text-[14px] font-semibold text-[#1A1A1A] leading-none">
                보기
              </span>
            </button>
          )}
          {tableId && (
            <div className="flex flex-col items-center justify-center min-w-[60px] min-h-[56px] bg-[#FFE4E1] rounded-lg">
              <span className="text-[14px] font-bold text-[#1A1A1A] leading-none">테이블</span>
              <span className="text-[14px] font-bold text-[#1A1A1A] leading-none">
                {tableId}번
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 주문내역 모달 */}
      {tableId && showOrderListModal && restaurantId && (
    <OrderListModal
      isOpen={isOrderModalOpen}
      onClose={() => setOrderModalOpen(false)}
      tableId={tableId}
      restaurantId={restaurantId} // ✅ 여기에 추가
    />
  )}
    </div>
  );
}
