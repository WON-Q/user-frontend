interface NavBarProps {
  storeName: string;
  tableId: string | null;
}

export default function NavBar({ storeName, tableId }: NavBarProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm py-4 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
            {/* 가게 이미지지 */} 
            <img
              src="/images/store-logo.png"
              alt="Store Logo"
              className="w-8 h-8 rounded-full"
            />
          </div>
          <div>
            <h1 className="font-bold text-h2-mobile">{storeName}</h1>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-center bg-[#F0F4FF] px-3 py-1 rounded-lg">
            <p className="text-caption text-primary">테이블</p>
            <p className="text-h3 text-primary font-bold">
              {tableId+"번" || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}