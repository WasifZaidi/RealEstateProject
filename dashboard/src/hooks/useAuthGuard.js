// hooks/useAuthGuard.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthGuard(requiredRoles = []) {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/dashboard/accessor", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Not authorized");

        const data = await res.json();
        const userData = data?.user;

        if (!userData) throw new Error("Invalid user data");

        // ✅ Role-based check
        if (
          requiredRoles.length > 0 &&
          !requiredRoles.includes(userData.role)
        ) {
          console.warn("🚫 User lacks required role:", userData.role);
          router.replace("/unauthorized");
          return;
        }

        setUser(userData);
        setIsAuthorized(true);
      } catch (err) {
        console.error("❌ AuthGuard failed:", err.message);
        router.replace("/signIn");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, requiredRoles]);

  return { loading, isAuthorized, user };
}
