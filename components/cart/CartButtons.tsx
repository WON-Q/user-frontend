import Link from "next/link";

interface CartButtonsProps {
  restaurantId: string;
  tableId: string;
}

export default function CartButtons({
  restaurantId,
  tableId,
}: CartButtonsProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 p-4 flex gap-3 safe-area-bottom z-[100] max-w-screen-md mx-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      <Link
        href={`/restaurant/${restaurantId}/table/${tableId}/menu`}
        className="flex-1 h-12 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-xl flex items-center justify-center font-medium transition-colors hover:bg-[var(--color-primary-light)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          />
        </svg>
        메뉴 추가
      </Link>
      <Link
        href={`/payment/1`}
        className="flex-1 h-12 bg-[var(--color-primary)] text-white rounded-xl shadow-md flex items-center justify-center font-medium transition-all hover:bg-[var(--color-primary-dark)] active:scale-[0.98]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        결제하기
      </Link>
    </div>
  );
}
