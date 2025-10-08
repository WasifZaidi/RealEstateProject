// /lib/getCurrentUser.js
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    // ✅ Await cookies() in Next.js 15+
    const cookieStore = await cookies();
    const token = cookieStore.get("user_token_realEstate")?.value;

    if (!token) return null;

    const res = await fetch(`http://localhost:3001/api/me`, {
      headers: {
        Cookie: `user_token_realEstate=${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data?.user || null;
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return null;
  }
}
