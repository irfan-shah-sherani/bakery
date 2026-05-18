import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers"; 
import Navbar from "@/components/Navbar"; // Standard, fast import

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar /> 
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}