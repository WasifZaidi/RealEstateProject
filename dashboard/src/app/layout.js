// app/layout.js
import "./globals.css"; // Global styles
import { inter } from "@/utils/fonts";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}