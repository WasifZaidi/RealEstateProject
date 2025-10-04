import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter } from "@/utils/fonts";
import Footer from "./components/Footer";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        {children}
        <Footer/>
      </body>
    </html>
  );
}
