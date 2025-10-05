"use client";
import React from "react";

const CustomLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />

        {/* Message */}
        <p className="text-gray-700 text-sm font-medium animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default CustomLoader;
