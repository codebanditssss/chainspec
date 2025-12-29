import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChainSpec Dashboard",
  description: "Spec-First Smart Contract Development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex-1 md:ml-64">
            <header className="h-14 border-b flex items-center px-4 md:px-6 sticky top-0 z-10 bg-background/50 backdrop-blur-lg">
              <MobileSidebar />
              <div className="ml-auto flex items-center gap-4">
                {/* Topbar actions (Notifications, Profile) could go here */}
              </div>
            </header>
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
