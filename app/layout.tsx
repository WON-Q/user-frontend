import "./globals.css";
import type { Metadata, Viewport } from "next";

// ✅ metadata 객체 안에는 viewport와 themeColor를 빼고 설정
export const metadata: Metadata = {
  title: "원큐오더 - 한 번에 주문하세요",
  description: "우리카드로 한 큐에 주문하는 간편한 주문 서비스",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "원큐오더",
  },
  formatDetection: {
    telephone: true,
  },
};

// ✅ viewport는 따로 export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // ✅ string 말고 boolean 사용
};

// ✅ themeColor도 따로 export
export const themeColor = "#FF6B35";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard.css"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-blue-white antialiased">
        <div className="max-w-md mx-auto min-h-screen relative shadow-xl bg-white">
          {children}
        </div>
      </body>
    </html>
  );
}
