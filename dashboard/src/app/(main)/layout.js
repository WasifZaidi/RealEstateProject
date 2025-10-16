// app/layout.js
import "../globals.css";
import { inter } from "@/utils/fonts";
import Navbar from "../components/Navbar";
import { getCurrentAccessor } from "@/lib/getCurrentAccessor";

export default async function RootLayout({ children }) {
  const user = await getCurrentAccessor();

  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased min-h-screen flex bg-[#F2F3F7]`}
      >
        {/* ✅ Pass user to Navbar */}
        <Navbar user={user} />

        {/* Main Content */}
        <main className="flex-1 md:ml-[250px] py-5 px-4 md:px-8 overflow-x-hidden transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}
