// app/(main)/layout.js
import Navbar from "../components/Navbar";
import { getCurrentAccessor } from "@/lib/getCurrentAccessor";

// Note: No <html> or <body> tags here!
export default function MainLayout({ children }) {
  // You can fetch data here if needed for components like Navbar
  // const user = getCurrentAccessor(); 

  return (
    // Outer flex structure and background for the main content area
    <div className="flex bg-[#F2F3F7]">
      <Navbar /> 

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[250px] py-5 px-4 md:px-8 overflow-x-hidden transition-all duration-300">
        {children}
      </main>
    </div>
  );
}