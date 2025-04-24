"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// QR 코드에서 테이블 정보 추출 함수 (실제로는 lib/qrcode.ts에 구현)
const extractTableInfo = (url: string) => {
  // 여기서는 간단한 구현만 제공
  // URL에서 storeId와 tableId 추출 (예: /store/123/table/456)
  const storeMatch = url.match(/\/store\/(\d+)/);
  const tableMatch = url.match(/\/table\/(\d+)/);

  return {
    storeId: storeMatch ? storeMatch[1] : null,
    tableId: tableMatch ? tableMatch[1] : null,
  };
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // TODO: URL 파라미터에서 QR 정보 추출 로직
    // 실제 구현에서는 URL 파라미터나 해시 등에서 정보 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const storeId = urlParams.get("storeId");
    const tableId = urlParams.get("tableId");

    // QR 코드를 통해 접속하면 자동으로 메뉴 페이지로 리디렉션
    if (storeId && tableId) {
      router.push(`/menu/${storeId}?tableId=${tableId}`);
    }
  }, [router]);

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-blue-white to-white">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8 relative overflow-hidden">
          {/* 배경 패턴 */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-40 h-40 bg-primary-light rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-32 h-32 bg-primary-light rounded-full opacity-15"></div>

          <div className="relative text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">Q</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-primary mb-2">원큐오더</h1>
            <p className="text-gray-600 mb-10">
              테이블 QR 코드를 스캔하면
              <br />
              주문 페이지로 연결됩니다
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-left text-sm">
                  카메라로 QR 코드 스캔
                </span>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-3 text-left text-sm">
                  메뉴 확인 및 선택
                </span>
              </div>

              <div className="flex items-center justify-center">
                <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z"
                      clipRule="evenodd"
                    />
                    <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
                  </svg>
                </div>
                <span className="ml-3 text-left text-sm">
                  결제 완료 후 음식 제공
                </span>
              </div>
            </div>

            {/* 개발용 바로가기 버튼 (실제 배포 시 제거) */}
            <div className="space-y-3">
              <a
                href="/menu/1?tableId=1"
                className="block w-full py-3 px-4 bg-primary text-white rounded-lg font-medium shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                (개발용) 메뉴 페이지로 이동
              </a>
            </div>
          </div>
        </div>

        <p className="mt-8 text-xs text-gray-500">
          앱 설치 없이 바로 이용 가능합니다
        </p>
      </div>
    </main>
  );
}
