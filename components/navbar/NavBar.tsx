import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface NavBarProps {
  tableId: string | null;
  restaurantId?: string;
  children: ReactNode;
  type?: "back" | "logo";
}

export default function NavBar({ tableId, restaurantId, children, type = "logo" }: NavBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (restaurantId && tableId) {
      router.push(`/restaurant/${restaurantId}/table/${tableId}/menu`);
    } else {
      router.back();
    }
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-4 px-4 relative">
      <div className="flex items-center justify-between relative">
        
      <div className="flex-1 flex justify-start">
          <div className="flex items-center justify-center h-10 px-3 py-1 rounded-lg">
            {type === "back" ? (
              <button onClick={handleBack}>
                <img src="/back.svg" alt="Back" className="w-6 h-6" />
              </button>
            ) : (
              <img src="/images/store-logo.png" alt="Store Logo" className="w-8 h-8 rounded-full" />
            )}
          </div>
        </div>


        {/* 가운데: children 정확히 중앙 정렬 */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <h1 className="font-bold text-h2-mobile">{children}</h1>
        </div>

        {/* 오른쪽: 테이블 번호 */}
        <div className="flex-1 flex justify-end">
          <div className="text-center bg-[#F0F4FF] px-3 py-1 rounded-lg">
            <p className="text-caption text-primary">테이블</p>
            <p className="text-h3 text-primary font-bold">
              {tableId + "번" || "N/A"}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
