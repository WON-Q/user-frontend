import Image from "next/image";
import type { CartItem } from "../../context/CartContext"; // Use type-only import

interface CartItemProps {
  item: CartItem;
  onQuantityChange: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4 transition-all duration-200 hover:shadow-md">
      <div className="flex p-4">
        <div className="relative h-24 w-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
          {item.image && (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          )}
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold text-[var(--color-text-black)] text-lg mb-1">
            {item.name}
          </h3>
          {item.options && Object.entries(item.options).length > 0 && (
            <p className="text-sm text-[var(--color-text-mid-gray)] mb-2">
              {Object.entries(item.options)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" · ")}
            </p>
          )}
          <p className="font-medium text-[var(--color-primary)] text-lg">
            {item.totalPrice.toLocaleString()}원
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onRemove(item.id)}
            className="text-[var(--color-text-mid-gray)] hover:text-[var(--color-error)] transition-colors p-2 rounded-full hover:bg-red-50"
            aria-label="삭제"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <div className="flex items-center bg-white rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() =>
                item.quantity > 1 &&
                onQuantityChange(item.id, item.quantity - 1)
              }
              className={`w-10 h-10 flex items-center justify-center transition-colors ${
                item.quantity <= 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-[var(--color-text-dark-gray)] hover:bg-gray-100"
              }`}
              aria-label="수량 감소"
              disabled={item.quantity <= 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <span className="w-12 text-center font-medium text-[var(--color-text-black)]">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="w-10 h-10 flex items-center justify-center text-[var(--color-text-dark-gray)] hover:bg-gray-100 transition-colors"
              aria-label="수량 증가"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
