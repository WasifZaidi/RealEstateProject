'use client'; // Add this for client components

export const ModernTag = ({ children, variant = "default", className = "" }) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200";

  const variants = {
    default: "bg-gray-100/80 text-gray-800 border border-gray-300 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
    primary: "bg-blue-600/10 text-blue-700 border border-blue-300 shadow-sm hover:bg-blue-600/20 backdrop-blur-sm",
    success: "bg-emerald-600 text-emerald-100 border border-emerald-300 shadow-sm hover:bg-emerald-600/20 backdrop-blur-sm",
    warning: "bg-amber-500/10 text-amber-100 border border-amber-300 shadow-sm hover:bg-amber-500/20 backdrop-blur-sm",
    danger: "bg-rose-500/10 text-rose-200 border border-rose-300 shadow-sm hover:bg-rose-500/20 backdrop-blur-sm",
    premium: "bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-md hover:opacity-90",
    featured: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:opacity-90"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};