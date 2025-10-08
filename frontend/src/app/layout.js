// /src/app/layout.js
import "./globals.css";
import { inter } from "@/utils/fonts";
import Footer from "./components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "./components/Navbar";
import NavbarServerWrapper from "./components/NavbarServerWrapper";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
            <NavbarServerWrapper />
            <main>{children}</main>
            <Footer />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}