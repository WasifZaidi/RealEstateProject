// app/layout.js
import "./globals.css";
import { inter } from "@/utils/fonts";
import Navbar from "./components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen flex`}>
        {/* Sidebar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 md:ml-[250px] py-5 px-4 md:px-8 bg-[#F2F3F7] overflow-x-hidden transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
