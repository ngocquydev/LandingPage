import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NextWeb — Thiết kế website theo nhu cầu",
  description: "Khám phá dịch vụ thiết kế landing page, website doanh nghiệp và cửa hàng online. Ước tính chi phí và gửi yêu cầu tư vấn cho NextWeb.",
  icons: { icon: "/favicon.svg" },
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
