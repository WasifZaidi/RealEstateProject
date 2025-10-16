// app/layout.js
import "../globals.css";
import { inter } from "@/utils/fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
         <main className="bg-[#F2F3F7]">
            {children}
          </main>
      </body>
    </html>
  );
}
