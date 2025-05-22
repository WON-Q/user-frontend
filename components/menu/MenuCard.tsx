import Image from 'next/image';
import { MenuItem } from '@/types/menu';
import { useEffect, useState } from 'react';

interface MenuCardProps {
  menu: MenuItem;
  onClick: (menu: MenuItem) => void;
}

const MOCK_REVIEWS = [
  '진짜 맛있어요!',
  '양도 푸짐하고 최고예요.',
  '다음에 또 시킬게요.',
  '면이 쫄깃하고 소스가 맛있어요.',
  '배달도 빠르고 친절했어요.',
  '맛은 있는데 조금 짰어요.',
  '아이도 너무 좋아했어요!',
  '사진보다 양이 많아서 놀랐어요.',
  '짜장면에 계란 조합 미쳤음',
];

export default function MenuCard({ menu, onClick }: MenuCardProps) {
  const [chatIndex, setChatIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setChatIndex((prev) => (prev + 1) % (MOCK_REVIEWS.length - 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const visibleReviews = MOCK_REVIEWS.slice(chatIndex, chatIndex + 3);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClick(menu);
  };

  return (
    <div
      className="group bg-white rounded-card overflow-hidden shadow-md h-full flex flex-col menu-card cursor-pointer relative"
      onClick={handleClick}
    >
      <div className="relative h-36 w-full">
        <Image
          src={menu.image || "/images/default-menu.png"}
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

      <div className="p-4 flex-1 flex flex-col transition-opacity duration-300 group-hover:opacity-0">
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

      {/* ✅ 리뷰 호버 UI */}
      <div className="absolute bottom-[-50%] left-0 w-full px-4 py-2 bg-white text-gray-800 text-sm shadow-xl rounded-b-xl flex flex-col items-center justify-start gap-2 transition-all duration-300 ease-in-out group-hover:bottom-0">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-medium">4.9점</span>
          <span className="text-gray-400">· 리뷰 31개</span>
        </div>
        <div className="w-full max-h-[90px] flex flex-col gap-1 overflow-hidden text-left">
          {visibleReviews.map((review, idx) => (
            <div key={idx} className="text-xs text-gray-700 bg-gray-100 px-3 py-1 rounded-md shadow-sm">
              {review}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}