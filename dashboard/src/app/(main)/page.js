import { getCurrentAccessor } from "@/lib/getCurrentAccessor";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AgentVerificationAlert from "../components/AgentVerificationAlert";

export default async function Home() {
  const user = await getCurrentAccessor();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-3xl max-w-4xl mx-auto">
      {user && user.isVerifiedAgent === false && (
        <AgentVerificationAlert
          userName={user?.name || user?.userName || ""}
        />
      )}

      {/* --- Header Section --- */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-blue-800 tracking-tight">
          Welcome to <span className="text-blue-600">Horizon</span> Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your listings, performance insights, and client interactions — all from one place.
        </p>
      </div>

      {/* --- Analytics CTA Section --- */}
  <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl shadow-2xl p-8 relative overflow-hidden">
  {/* Background decorative elements */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
  
  <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
    <div className="flex-1 text-center lg:text-left">
      <h2 className="text-2xl lg:text-3xl font-bold mb-3">
        Want to see detailed performance insights?
      </h2>
      <p className="text-blue-100/90 text-base leading-relaxed">
        View your full analytics dashboard for comprehensive metrics and reports.
      </p>
    </div>
    
    <div className="flex-shrink-0">
      <Link
        href="/analytics"
        className="group inline-flex items-center gap-3 bg-white/95 backdrop-blur-sm text-blue-700 font-semibold px-6 py-3.5 rounded-[50px] shadow-lg hover:shadow-xl hover:scale-105 hover:bg-white transition-all duration-300 ease-out border border-white/20"
      >
        See Analytics
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
      </Link>
    </div>
  </div>
  
  {/* Subtle glow effect */}
  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-transparent pointer-events-none"></div>
</div>
    </div>
  );
}
