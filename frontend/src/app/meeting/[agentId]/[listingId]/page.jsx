"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import CustomLoader from "@/app/components/CustomLoader";
import axios from "axios";

export default function ScheduleTourPage() {
  const { agentId, listingId } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);

  // ✅ Fetch blocked/unavailable dates for the agent
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/meeting/meetings/${agentId}`,
          {
            method: "GET",
            credentials: "include", // equivalent to axios { withCredentials: true }
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          // Normalize dates to YYYY-MM-DD format
          const formatted = data.blockedDates.map(
            (d) => new Date(d).toISOString().split("T")[0]
          );
          setBlockedDates(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch blocked dates:", err);
      } finally {
        setLoading(false);
      }
    };


    if (agentId) fetchBlockedDates();
  }, [agentId]);

  // ✅ Generate available time slots (9 AM - 5:30 PM)
  useEffect(() => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 17) slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    setAvailableSlots(slots);
  }, []);

  // ✅ Handle date and time selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const formattedDate = date.toISOString().split("T")[0];
    setFormData((prev) => ({ ...prev, date: formattedDate }));
  };

  const handleTimeSelect = (time) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      setError("Please select both date and time.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        agentId,
        listingId,
        date: `${formData.date}T${formData.time}:00Z`,
        notes: formData.notes || "",
        client: "self",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meeting/tour`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 401) {
        router.push("/signIn");
        return;
      }

      if (response.status === 403) {
        const data = await response.json();
        setError(data.message || "Access Denied");
        return;
      }


      const data = await response.json();
      if (data.success) {
        router.push(`/tourDetails/${data.meetingPublic_Id}`);
      } else {
        setError("Something Went Wrong. Try Again.");
      }
    } catch (err) {
      setError("Something Went Wrong. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Calendar Component
  const Calendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    maxDate.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // ✅ Generate only days between today and maxDate
    const days = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);

      if (date >= today && date <= maxDate) {
        days.push(date);
      }
    }

    // ✅ Prevent navigation outside allowed range
    const navigateMonth = (dir) => {
      const newMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + dir, 1);

      const monthStart = new Date(newMonth.getFullYear(), newMonth.getMonth(), 1);
      const monthEnd = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

      if (monthEnd < today || monthStart > maxDate) return; // disallow

      setCurrentMonth(newMonth);
    };

    const isDateAvailable = (date) => {
      if (!date) return false;
      const formatted = date.toISOString().split("T")[0];
      return !blockedDates.includes(formatted);
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 gap-2">
          <button
            onClick={() => navigateMonth(-1)}
            disabled={
              currentMonth.getMonth() === today.getMonth() &&
              currentMonth.getFullYear() === today.getFullYear()
            }
            className={`p-2 rounded-lg transition-all ${currentMonth.getMonth() === today.getMonth() &&
              currentMonth.getFullYear() === today.getFullYear()
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-50"
              }`}
          >
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>

          <button
            onClick={() => navigateMonth(1)}
            disabled={
              currentMonth.getMonth() === maxDate.getMonth() &&
              currentMonth.getFullYear() === maxDate.getFullYear()
            }
            className={`p-2 rounded-lg transition-all ${currentMonth.getMonth() === maxDate.getMonth() &&
              currentMonth.getFullYear() === maxDate.getFullYear()
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-blue-50"
              }`}
          >
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs sm:text-sm font-semibold text-gray-500 py-2"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date, i) => {
            const formatted = date?.toISOString().split("T")[0];
            const isBlocked = blockedDates.includes(formatted);
            const available = isDateAvailable(date);

            return (
              <div key={i} className="relative group">
                <button
                  disabled={!available}
                  onClick={() => date && handleDateSelect(date)}
                  className={`h-10 sm:h-12 w-full rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center justify-center
            ${!available
                      ? "bg-red-100 text-red-600 cursor-not-allowed border border-red-200 hover:bg-red-100"
                      : selectedDate &&
                        date.toDateString() === selectedDate.toDateString()
                        ? "bg-blue-600 text-white shadow-md hover:shadow-lg"
                        : "text-gray-700 bg-white hover:bg-blue-50 border border-gray-200 hover:border-blue-300"
                    }
          `}
                >
                  {date.getDate()}
                </button>

                {/* Tooltip / Chip */}
                {!available && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs sm:text-sm rounded-full bg-red-100 text-red-700 font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    Already Booked
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  };


  // ✅ Loader view
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-20">
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 sm:pt-16 lg:pt-14 pb-8 px-4 sm:px-5 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
              Schedule Your Tour
            </span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Choose a date and time to visit the property with your agent
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl grid md:grid-cols-2 gap-6 sm:gap-10 p-4 sm:p-10">
          {/* Left - Calendar */}
          <div className="flex flex-col gap-6">
            <Calendar />
            {selectedDate && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-600 font-semibold uppercase mb-1">
                  Selected Date
                </p>
                <p className="text-base sm:text-lg font-semibold text-gray-900">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Right - Time + Notes + Submit */}
          <div className="flex flex-col gap-6">
            {selectedDate && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Select a Time
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => handleTimeSelect(slot)}
                      className={`py-2 sm:py-3 px-2 sm:px-3 rounded-[50px] border-2 text-xs sm:text-sm font-medium transition-all
                        ${formData.time === slot
                          ? "bg-blue-600 text-white border-transparent"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows="4"
                placeholder="Any special requests or questions..."
                className="w-full normal_input rounded-xl resize-none text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!formData.date || !formData.time}
              className={`relative w-full py-3 rounded-[50px] font-semibold text-white text-base overflow-hidden transition-all duration-300
    ${!formData.date || !formData.time
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 group"
                }`}
            >
              {/* Shine Effect */}
              {!(!formData.date || !formData.time) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
              )}

              {/* Content */}
              <span className="relative z-10 whitespace-nowrap transition-all duration-300 group-hover:tracking-wide">
                Confirm Tour Schedule
              </span>
            </button>

          </div>
        </div>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-8">
          Tours available within 30 days • Available from 9:00 AM to 5:30 PM
        </p>
      </div>
    </div>
  );
}
