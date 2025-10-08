"use client";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import CustomToast from "./SideComponents/CustomToast";
export default function WishlistButton({ listingId, isInitiallySaved = false }) {
    const [isSaved, setIsSaved] = useState(isInitiallySaved);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSaveListing = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/saveToList`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ allows backend cookie to be sent automatically
                body: JSON.stringify({ listingId }),
            });

            // Handle session expiration
            if (res.status === 401) {
                router.push("/signIn");
                return;
            }

            const data = await res.json();

            if (res.ok && data.success) {
                setIsSaved(!isSaved);
            } else {
                alert(data.message || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error saving listing:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleSaveListing}
            disabled={loading}
            className="absolute right-3 bottom-3 bg-white/90 rounded-full p-2 shadow-sm hover:bg-white transition"
            aria-label="Save to wishlist"
        >
            <Heart
                className={`w-5 h-5 transition-colors duration-300 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
            />
        </button>
    );
}
