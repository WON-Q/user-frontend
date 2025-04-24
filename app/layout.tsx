import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "원큐오더 - 한 번에 주문하세요",
  description: "우리카드로 한 큐에 주문하는 간편한 주문 서비스",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#FF6B35",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "원큐오더",
  },
  formatDetection: {
    telephone: true,
  },
};

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
