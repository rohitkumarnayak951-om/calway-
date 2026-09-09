import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { LocationProvider } from "@/context/LocationContext";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { MobileNav } from "@/components/common/MobileNav";
import { StickyCartBar } from "@/components/common/StickyCartBar";
import { LocationModal } from "@/components/common/LocationModal";

export const metadata: Metadata = {
  title: "CALWAY — Mandi-Fresh Vegetable Delivery in Kolkata | Dawn Doorstep Run",
  description: "Fresh vegetables sourced directly from Sealdah Koley & Mechua wholesale mandis at 3:30 AM and delivered to your Kolkata doorstep before 7:00 AM. 100% zero cold storage.",
  keywords: "Kolkata fresh vegetables, mandi delivery, Koley market online, Mechua wholesale veggies, organic shaak Kolkata, morning doorstep groceries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full max-w-full overflow-x-hidden">
      <body className="bg-[#f8faf8] text-[#0f291e] min-h-screen flex flex-col antialiased selection:bg-brand-200 selection:text-brand-900 w-full max-w-full overflow-x-hidden">
        <LocationProvider>
          <CartProvider>
            {/* Global Location Selection Modal */}
            <LocationModal />

            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
              {children}
            </main>

            {/* Floating Persistent Sticky Cart Bar */}
            <StickyCartBar />

            {/* Mobile Bottom Navigation Bar (<640px) */}
            <MobileNav />

            {/* Footer */}
            <Footer />
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}

