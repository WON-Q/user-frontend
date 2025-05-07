import Image from 'next/image';
import { MenuItem } from '@/types/menu';

interface MenuCardProps {
  menu: MenuItem;
  onClick: (menu: MenuItem) => void;
}

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(menu);
  };

  return (
    <div
      className="bg-white rounded-card overflow-hidden shadow-md h-full flex flex-col menu-card cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-36 w-full">
        <Image
          src="/images/default.png"   // 나중에 이미지 수정정
          alt={menu.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUW0RjgAAAAASUVORK5CYII="
        />
        {menu.badge && (
          <div className="absolute top-2 left-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
            {menu.badge}
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {menu.name}
          </h3>
        </div>
        <p className="text-small text-text-light mb-2 flex-1 line-clamp-2">
          {menu.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="font-medium text-base text-primary">
            {menu.price.toLocaleString()}원
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick(menu);
            }}
          
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary-dark transition-colors active:scale-95 no-highlight"
            aria-label="메뉴 보기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}