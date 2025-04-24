interface CartSummaryProps {
  totalItems: number;
  totalAmount: number;
}

export default function CartSummary({
  totalItems,
  totalAmount,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-5">
        <h2 className="font-semibold text-lg text-[var(--color-text-black)] mb-4">
          주문 요약
        </h2>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
          <div className="flex items-center">
            <div className="bg-[var(--color-primary)] bg-opacity-10 p-2 rounded-lg mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[var(--color-primary)]"
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
            </div>
            <div>
              <p className="font-medium text-[var(--color-text-black)]">
                총 {totalItems}개의 메뉴
              </p>
              <p className="text-sm text-[var(--color-text-mid-gray)]">
                테이블에서 준비해드립니다
              </p>
            </div>
          </div>
          <span className="font-medium text-[var(--color-text-dark-gray)]">
            {totalAmount.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100" />

      <div className="p-5">
        <div className="flex justify-between items-end mb-4">
          <span className="font-semibold text-lg text-[var(--color-text-black)]">
            총 결제 금액
          </span>
          <div className="text-right">
            <span className="font-bold text-xl text-[var(--color-primary)]">
              {totalAmount.toLocaleString()}원
            </span>
          </div>
        </div>

        <div className="bg-[var(--color-primary-light)] rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 p-2 bg-white bg-opacity-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--color-primary)]"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-[var(--color-primary-dark)]">
                우리카드 결제 혜택
              </p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-[var(--color-primary-dark)] opacity-90">
                  • 결제 금액의 1% 마일리지 적립
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
