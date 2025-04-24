import Link from 'next/link';

interface EmptyCartProps {
  restaurantId: string;
    tableId: string;
}

export default function EmptyCart({ restaurantId, tableId }: EmptyCartProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-gray-100 p-5 rounded-full mb-4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
                장바구니가 비어있습니다
            </h2>
            <p className="text-gray-500 mb-8 text-center">
                메뉴 페이지에서 메뉴를 추가해주세요
            </p>
            <Link
                href={`/restaurant/${restaurantId}/table/${tableId}/menu`}
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-md font-medium flex items-center"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                        clipRule="evenodd"
                    />
                </svg>
                메뉴 보러가기
            </Link>
        </div>
    );
}