// /lib/getCurrentAccessor.js
import { cookies } from "next/headers";

// ⚙️ Helper: safe fetch with timeout
async function safeFetch(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw new Error(error.name === "AbortError" ? "Request timed out" : error.message);
  }
}

export async function getCurrentAccessor() {
  try {
    // ✅ Get cookie securely (server-only)
    const cookieStore = cookies();
    const token = cookieStore.get("access_token_realEstate")?.value;

    if (!token) return null;

    // ✅ Use environment-safe base URL
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      "http://localhost:3001";

    // ✅ Securely call backend to verify session
    const res = await safeFetch(`http://localhost:3001/api/dashboard/accessor`, {
      headers: {
        Cookie: `access_token_realEstate=${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      credentials: "include",
    });

    // 🔒 If unauthorized, null instead of throwing unhandled error
    if (res.status === 401 || res.status === 403) {
      console.warn("⚠️ Unauthorized: Invalid or expired token.");
      return null;
    }

    // ❗ Handle other non-OK responses
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Server Error:", text);
      return null;
    }

    const data = await res.json();

    // ✅ Validate data structure defensively
    if (!data || typeof data !== "object" || !data.user) {
      console.warn("⚠️ Unexpected API response format:", data);
      return null;
    }

    // ✅ Return sanitized user object
    return {
      _id: data.user._id,
      name: data.user.userName,
      email: data.user.Email,
      role: data.user.role,
      isVerifiedAgent: data.user.isVerifiedAgent,
      // Add only safe public fields — never tokens or passwords
    };
  } catch (err) {
    // 🚨 Log minimal info in production to avoid leaking internals
    if (process.env.NODE_ENV === "development") {
      console.error("❌ getCurrentAccessor Error:", err);
    } else {
      console.error("❌ Failed to fetch current accessor");
    }
    return null;
  }
}
