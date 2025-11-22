"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";

export default function AgentVerificationAlert({ userName = "" }) {
  const router = useRouter();

  const handleComplete = () => {
    router.push("/createAgentProfile");
  };


  return (
    <div className="relative mb-10 max-w-4xl mx-auto bg-yellow-50 border border-yellow-300 rounded-2xl shadow-sm p-5 mt-6 animate-fadeIn">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-yellow-800">
            Agent Profile Required
          </h3>

          <p className="text-sm text-yellow-700 mt-1 leading-relaxed">
            {userName && <span className="font-medium">{userName}, </span>}
            your <span className="font-semibold">Agent Profile</span> is{" "}
            <span className="font-bold underline">mandatory</span> for creating
            listings. Completing it takes less than{" "}
            <span className="font-semibold">2 minutes</span> and helps your
            listings gain better visibility and verified trust.
          </p>

          <button
            onClick={handleComplete}
            className="mt-4 cursor-pointer inline-flex items-center justify-center bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium px-4 py-2 rounded-[50px] transition duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );
}
