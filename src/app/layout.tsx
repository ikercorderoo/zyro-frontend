import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zyro | Reserva tu estilo único",
  description: "Encuentra y reserva cita en los mejores locales de salud, belleza y bienestar de tu zona con Zyro.",
};

import { AuthProvider } from "@/context/AuthContext";
import ToastContainer from "@/components/ui/Toast";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/ui/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
          </div>
          <ToastContainer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}
