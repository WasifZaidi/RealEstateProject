import { cookies } from "next/headers";

export async function getWishlistMinimal() {
  try {
    const cookieStore = cookies(); // no need for await
    const cookieHeader = cookieStore.get("user_token_realEstate")?.value || "";

    const res = await fetch(
      `http://localhost:3000/api/wishlistmin`,
      {
        method: "GET",
        headers: {
          Cookie: `user_token_realEstate=${cookieHeader}`, 
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    const data = await res.json();
    return data.success ? data.savedListingIds : [];
  } catch (error) {
    console.error("Error fetching wishlistMinimal:", error.message);
    return [];
  }
}
