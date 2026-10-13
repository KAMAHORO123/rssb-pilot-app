import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import AuthNav from "../components/auth-nav";
import RoleNav from "../components/role-nav";
import ToastProvider from "../components/toast-provider";
import ThemeProvider from "../components/theme-provider";
import ThemeToggle from "../components/theme-toggle";
import ErrorBoundary from "../components/error-boundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Smart Logistics Platform",
  description: "Real-time shipment tracking and courier management"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        <ThemeProvider>
          <ToastProvider>
            <header className="site-header border-b border-black/10 bg-white/80 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
                <Link
                  href="/"
                  className="site-brand text-lg font-bold tracking-[0.06em]"
                >
                  Smart Logistics
                </Link>

                <nav className="site-nav flex flex-wrap items-center gap-3 text-sm text-stone-700 md:gap-5">
                  <ThemeToggle />
                  <RoleNav />
                  <AuthNav />
                </nav>
              </div>
            </header>

            <ErrorBoundary>{children}</ErrorBoundary>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
