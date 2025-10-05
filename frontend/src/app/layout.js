import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { inter } from "@/utils/fonts";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
        <Footer />
      </body>
    </html>
  );
}
