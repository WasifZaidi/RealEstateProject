// app/(authentication)/layout.js

// Note: No <html> or <body> tags here!
export default function AuthenticationLayout({ children }) {
  return (
    // Main content wrapper for authentication pages
    <main className="bg-[#F2F3F7] min-h-screen">
      {children}
    </main>
  );
}