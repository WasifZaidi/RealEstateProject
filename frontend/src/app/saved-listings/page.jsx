"use client";
import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import {
  Heart,
  Home,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Search,
  Loader2,
  Scale,
  Trash2
} from "lucide-react";
import ListingCard from "../components/ListingCard";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SavedListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const limit = 12;
  const router = useRouter();

  // 🧠 Load compare selections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("compare_listings");
    if (saved) {
      setSelectedForCompare(JSON.parse(saved));
    }
  }, []);

  // 💾 Save to localStorage when selectedForCompare changes
  useEffect(() => {
    localStorage.setItem("compare_listings", JSON.stringify(selectedForCompare));
  }, [selectedForCompare]);

  const fetchSavedListings = async (page = 1, limit = 12) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/getSaveListings?page=${page}&limit=${limit}`,
        {
          credentials: "include",
          cache: "no-store",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Backend Error:", {
          status: res.status,
          statusText: res.statusText,
          body: errorText,
        });
        throw new Error(
          res.status === 401
            ? "Please login to view saved listings"
            : `Failed to load saved listings: ${res.status}`
        );
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("🔥 Saved Listings Fetch Error:", err);
      throw err;
    }
  };

  const handleRetry = () => {
    setPage(1);
    fetchSavedListings(1, limit)
      .then((data) => {
        setListings(data?.listings || []);
        setTotalPages(data?.totalPages || 1);
        setTotalCount(data?.totalCount || 0);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to load saved listings. Please try again.");
      });
  };

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSavedListings(page, limit);

        setListings(data?.listings || []);
        setTotalPages(data?.totalPages || 1);
        setTotalCount(data?.totalCount || 0);
      } catch (err) {
        setError(err.message || "Failed to load saved listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadListings();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearCompare = () => {
    setSelectedForCompare([]);
    localStorage.removeItem("compare_listings");
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 mb-6 animate-pulse">
          <Heart size={40} className="text-blue-500 fill-blue-500" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Saved Listings</h1>
        <p className="text-lg text-gray-600 mb-8">Loading your favorite properties...</p>

        {/* Custom smooth loader */}
        <div className="relative w-10 h-10 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin-smooth"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
          <AlertCircle size={40} className="text-red-500" />
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <p className="text-red-700 text-center flex-1">{error}</p>
          <button
            onClick={handleRetry}
            className="ml-4 px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center gap-1 whitespace-nowrap"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </section>
    );
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 md:p-8 mb-10 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-100">
              <Heart size={22} className="text-blue-600 fill-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Saved Listings</h1>
              <p className="text-gray-500 text-sm sm:text-base">
                {totalCount} {totalCount === 1 ? "property" : "properties"} saved
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/")}
            className="btn-primary"
          >
            <Home size={18} className="relative z-10" />
            <span className="relative z-10 whitespace-nowrap">Browse More</span>
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="text-center py-16 sm:py-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-6">
            <Search size={40} className="text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-3">
            No saved listings yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-8 leading-relaxed text-sm sm:text-base">
            Start exploring beautiful properties and save your favorites to see them here!
          </p>
         <button
    onClick={() => router.push("/")}
    className="btn-primary mx-auto"
>
    <Home size={20} />
    Discover Properties
</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
            {listings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                selectedForCompare={selectedForCompare}
                setSelectedForCompare={setSelectedForCompare}
              />
            ))}
            
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-14">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </div>
          )}
        </>
      )}

      {/* 🧱 Compare Overlay */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl border border-gray-200 rounded-2xl px-5 sm:px-8 py-4 sm:py-5 flex items-center gap-4 sm:gap-6 z-50 w-[90%] max-w-[1600px] backdrop-blur-lg animate-slide-up">
          <div className="flex items-center -space-x-2">
            {selectedForCompare.slice(0, 3).map((id) => {
              const item = listings.find((l) => l._id === id);
              return (
                <div key={id} className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white">
                  {!item?.media?.[0]?.url ? (
                    <Image src={item.media[0].url} alt="Compare item" fill className="object-cover" />
                  ) : (
                    <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-400 text-lg">🏠</div>
                  )}
                </div>
              );
            })}
            {selectedForCompare.length > 3 && (
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                +{selectedForCompare.length - 3}
              </div>
            )}
          </div>

          <span className="text-sm sm:text-base font-semibold text-gray-700">
            {selectedForCompare.length} selected for compare
          </span>

          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => router.push("/compare")}
              className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-full hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Scale size={16} />
              Compare Now
            </button>
            <button
              onClick={clearCompare}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              title="Clear all"
            >
              <Trash2 size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
