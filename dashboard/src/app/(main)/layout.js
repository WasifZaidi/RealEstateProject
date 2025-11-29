// app/(main)/layout.js
import Navbar from "../components/Navbar";
import NavbarWrapper from "../components/NavbarWrapper";
export default function MainLayout({ children }) {
  return (
    <div className="flex bg-[#F2F3F7] h-[100vh]">
      <NavbarWrapper />
      <main className="flex-1 md:ml-[250px] py-5 px-4 md:px-8 overflow-x-hidden transition-all duration-300">
        {children}
      </main>
    </div>
  );
}