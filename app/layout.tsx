import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISS Telemetry Tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* We moved the background, text, and dark mode colors right here! */}
      <body className={`${inter.className} bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}
